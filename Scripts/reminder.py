#!/usr/bin/env python3
import slack
import sys
import os
import time
import re
from pathlib import Path
from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

current_directory = os.getcwd()
env_path = Path(current_directory) / '.env'

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
# This ID can be changed once we have the real list
SPREADSHEET_ID = "1U0yyxK8cErhOgN-eSbTbLnSjYhyjWGxREOiNMoU5HDo"

CLIENT_SECRETS_FILE = "/home/andrewy/SlackBot/SAM-SX/Scripts/test.json"
TOKEN_PATH = "/home/andrewy/SlackBot/SAM-SX/Scripts/token.json"

load_dotenv(dotenv_path=env_path)

# Stores the token by loading an environment variable
client = slack.WebClient(token=os.environ['SLACK_TOKEN'])

dues_pattern = r'\$[0-9\,]+'

# Limitation: if someone just changes their slack name, there's no way to actually send them a message.
# Ask if this can be done with just id's, so we'll need a list of getters for the ID of each brother with their slack name displayed on the frontend too
def get_users(): 
    try:
        # Adjust this later
        response = client.users_list()
        # print(response)
        # print(response['members'])
        if response['ok']:
            actives_list = {}
            for user in response['members']:
                # AND NOT PAID yet
                # don't include the slackbot and other slackbots
                if not user['is_bot'] and user['id'] != 'USLACKBOT':
                    if "first_name" in user['profile'] and "last_name" in user['profile']:
                        first_name = user['profile']['first_name']
                        last_name = user['profile']['last_name']
                        full_name = first_name + " " + last_name
                        actives_list[full_name] = user['id']
                    elif "real_name" in user['profile']:
                        real_name = user['profile']['real_name']
                        actives_list[real_name] = user['id']
            return actives_list
        else:
            if response['error'] == 'ratelimited':
                # Respect the Retry-After header
                retry_after = int(response.headers['Retry-After'])
                print(f"Rate limited. Retrying after {retry_after} seconds.")
                time.sleep(retry_after)
                return get_users()  # Retry the request
            else:
                print(f"Error: {response['error']}")
    except Exception as error:
        print(f"Error fetching users list: {error}")
        return []

def remind_dues(id, wet_balance, dry_balance, custom_message):
    try:
        wet_dues = "You have an outstanding balance of $" + str(wet_balance) +" for Wet Dues. Please pay your dues or you will be fined"
        dry_dues = "You have an outstanding balance of $"+ str(dry_balance) +" for Dry Dues. Please pay your dues or you will be fined"
        if custom_message:
            client.chat_postMessage(channel=id, text=custom_message)
        else:
            if wet_balance > 0:
                client.chat_postMessage(channel=id, text=wet_dues)
            time.sleep(1)
            if dry_balance > 0:
                client.chat_postMessage(channel=id, text=dry_dues)
        print(f"Messages send to {id}")
    except Exception as error:
        print(f"Failed to send message to {id}: {error}")



# message = "You have an outstanding balance "
def read_sheet():
    # Set up credentials from the token. If there's no credentials, get it from the JSON file
    # Handle refresh for invalid credentials
    credentials = None
    if os.path.exists("token.json"):
        credentials = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
            # credentials = flow.run_console()
            credentials = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(credentials.to_json())
    
    try:
        service = build("sheets", "v4", credentials=credentials)
        sheets = service.spreadsheets()
        
        # Adjust the cell range as fit
        result = sheets.values().get(spreadsheetId=SPREADSHEET_ID, range="Sheet1!A3:C7").execute()
        
        values = result.get("values", [])
        
        return values
        # for row in values:
        #     print(row)
    except HttpError as error:
        print(error)

# Get optional message if there is one 
custom_message = ""
if len(sys.argv) > 1:
    custom_message = sys.argv[1]

need_to_pay = read_sheet()
paylist_dictionary = {}
for brother in need_to_pay:
    paylist_dictionary[brother[0].upper()] = (brother[1], brother[2])
announcements_id = ""
actives_list = get_users()

for active in actives_list.keys():
    if active.upper() in paylist_dictionary.keys():
        match_wet = re.match(dues_pattern, paylist_dictionary[active.upper()][0])
        match_dry = re.match(dues_pattern, paylist_dictionary[active.upper()][1])
        
        wet_amount = 0
        dry_amount = 0
        if match_wet:
            wet_no_commas = paylist_dictionary[active.upper()][0][1:].replace(",", "")
            wet_amount = int(wet_no_commas)
        if match_dry:
            dry_no_commas = paylist_dictionary[active.upper()][1][1:].replace(",", "")
            dry_amount = int(dry_no_commas)
        
        print(active)
        remind_dues(actives_list[active], wet_amount, dry_amount, custom_message)
        time.sleep(1)
