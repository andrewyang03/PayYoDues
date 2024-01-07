import React, {useState, useEffect} from 'react'
import styles from "./remind.module.css"
import popup from "./popup.module.css"
import "../index.css"

const Remind = () => {
    const [intervalID, setIntervalID] = useState(null)
    const [frequency, setFrequency] = useState("")
    const [message, setMessage] = useState("")
    const [sheetLink, setSheetLink] = useState("")
    const [sheetName, setSheetName] = useState("")
    const [rangeStart, setRangeStart] = useState("")
    const [rangeEnd, setRangeEnd] = useState("")
    const [modalStart, setModalStart] = useState(false)
    const [modalStop, setModalStop] = useState(false)
    const baseFrequency = 10 * 1000 //Runs every 10 seconds

    const getFrequency = () => {
        switch(frequency) {
            case 'twice-day':
                return 2 * baseFrequency
            case 'once-day':
                return 4 * baseFrequency
            case 'twice-week':
                return 8 * baseFrequency
            case 'once-week':
                return 16 * baseFrequency
            case 'two-weeks':
                return 32 * baseFrequency
            default:
                return null
        }
    }

    const runScript = () => {
        let payload = {}
        const linkid = sheetLink.match(/\/d\/(.+)\//)

        let sheetsSpecifics = [linkid[1], sheetName, rangeStart, rangeEnd]

        if (sheetsSpecifics.length !== 4) {
            alert("Form in incomplete!")
            return
        }
        if (message.length > 0) {
            payload.message = message
        }
        payload.sheetID = sheetsSpecifics[0]
        payload.sheetName = sheetsSpecifics[1]
        payload.start = sheetsSpecifics[2]
        payload.end = sheetsSpecifics[3]
        console.log(payload)
        fetch('http://localhost:5000/run-script', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`)
            }
            return response.text()
        }).then(data => {
            console.log("Response from server:", data)
        }).catch(err => {
            console.error("Error fetching data:", err)
        })
    }
    const startRunningScript = () => {
        const curFrequency = getFrequency();

        if (!sheetLink) {
            alert("Please put a link in the input")
            return
        }
        if (!curFrequency) {
            alert("Please select how often you want users to be reminded!")
            return
        }
        if (!intervalID) {
            runScript()
            setIntervalID(setInterval(runScript, curFrequency));
            setModalStart(true)
        } else {
            alert("Script is already running")
            return
        }
    }

    const stopRunningScript = () => {
        if (!intervalID) {
            alert("Script is currently not running")
            return
        }
        clearInterval(intervalID);
        setIntervalID(null);
        console.log('anti viggy bot stopped')
        setModalStop(true)

    }
    useEffect(() => {
        if (modalStart || modalStop) {
            document.body.classList.add('activeModal');
        } else {
        document.body.classList.remove('activeModal');
        }
    }, [modalStart, modalStop])
   
    const handleMessageChange = (e) => {
        setMessage(e.target.value.trim())
    }
    const handleSheetLinkChange = (e) => {
        setSheetLink(e.target.value.trim())
    }
    const handleSheetNameChange = (e) => {
        setSheetName(e.target.value.trim())
    }
    const handleRangeStartChange = (e) => {
        setRangeStart(e.target.value.trim())
    }
    const handleRangeEndChange = (e) => {
        setRangeEnd(e.target.value.trim())
    }
    const handleFrequencyChange = (e) => {
        setFrequency(e.target.value)
    }

    const closeModalStart = () => {
        setModalStart(false)
    }

    const closeModalStop = () => {
        setModalStop(false)
    }

    return (
        <div className={styles.content}>
            <div className={styles.description}>
                <h1>Pay Yo Dues</h1>
                <h2 className="headers">Customize Reminders</h2>
                <p className="paragraph">Please read the descriptions carefully as incorrect inputs can cause the script to not run.</p>
            </div>
            <div className={styles.messageAndSheet}>
                <div className={styles.changeMessage}>
                    <h3 className="headers">Change Message Content</h3>
                    <p className="paragraph">Default message is: You have an outstanding balance of $ dollars in wet/dry dues. Please pay to CashApp $SAMMYSX or you will be fined</p>
                    <textarea 
                        className={styles.messageBox} 
                        type="text" 
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="Please type your message"
                    ></textarea>
                </div>
                <div className={styles.spreadsheet}>
                    <h3 className="headers">Insert Sheet Link</h3>
                    <p className="paragraph">Please put link for the spreadsheet you have and make sure it is has anyone with the link can view permissions</p>
                    <input 
                        className={styles.sheetLink}
                        value={sheetLink}
                        onChange={handleSheetLinkChange}
                        type="text" 
                        placeholder="Paste link here"
                    ></input>
                </div>
            </div>
            <div className={styles.range}>
                <div className={styles.rangeOptions}>
                    <p className={styles.optionText}>Sheet Name:</p>
                    <input 
                        className={styles.optionBox} 
                        type="text"
                        value={sheetName}
                        onChange={handleSheetNameChange}
                    ></input>
                </div>
                <div className={styles.rangeOptions}>
                    <p className={styles.optionText}>From (upper left corner cell):</p>
                    <input 
                        className={styles.optionBox} 
                        type="text"
                        value={rangeStart}
                        onChange={handleRangeStartChange}
                    ></input>
                </div>
                <div className={styles.rangeOptions}>
                    <p className={styles.optionText}>To (bottom right corner cell):</p>
                    <input 
                        className={styles.optionBox} 
                        type="text"
                        value={rangeEnd}
                        onChange={handleRangeEndChange}
                    ></input>
                </div>
            </div>
            <div className={styles.frequency}>
                <h3 className="headers">Frequency</h3>
                <p className="paragraph">How often do you want users to be reminded?</p>
                <div className={styles.freqOptions}>
                    <div className={styles.radioGroup}>
                        <input 
                            type="radio" 
                            name="frequency" 
                            id="twice-day"
                            value="twice-day"
                            checked={frequency === 'twice-day'}
                            onChange={handleFrequencyChange}
                        ></input>
                        <label className={styles.bullets}>Twice a Day</label>
                    </div>
                    <div className={styles.radioGroup}>
                        <input 
                            type="radio" 
                            name="frequency" 
                            id="once-day"
                            value="once-day"
                            checked={frequency === 'once-day'}
                            onChange={handleFrequencyChange}
                        ></input>
                        <label className={styles.bullets}>Every Day</label>
                    </div>
                    <div className={styles.radioGroup}>
                        <input 
                            type="radio" 
                            name="frequency" 
                            id="twice-week"
                            value="twice-week"
                            checked={frequency === 'twice-week'}
                            onChange={handleFrequencyChange}
                        ></input>
                        <label className={styles.bullets}>Twice a Week</label>
                    </div>
                    <div className={styles.radioGroup}>
                        <input 
                            type="radio" 
                            name="frequency" 
                            id="once-week"
                            value="once-week"
                            checked={frequency === 'once-week'}
                            onChange={handleFrequencyChange}
                        ></input>
                        <label className={styles.bullets}>Every Week</label>
                    </div>
                    <div className={styles.radioGroup}>
                        <input 
                            type="radio" 
                            name="frequency" 
                            id="two-weeks"
                            value="two-weeks"
                            checked={frequency === 'two-weeks'}
                            onChange={handleFrequencyChange}
                        ></input>
                        <label className={styles.bullets}>Every Two Weeks</label>
                    </div>
                </div>
            </div>
            <div className={styles.scriptRun}>
                <button className={styles.scriptBtnStart} onClick={startRunningScript}>Run</button>
                <button className={styles.scriptBtnStop} onClick={stopRunningScript}>Stop</button>
            </div>
            <p id = "result"></p>
            {modalStart && (
                <div className={popup.modal}>
                        <div className={popup.content}>
                        <div className={popup.confirmation}>
                            <h3 className="headers">Bot Started!</h3>
                            <p className="paragraph">SlackBot has been successfully started, you can close this popup</p>
                        </div>
                            <button className={popup.close} onClick={closeModalStart}>Close</button>
                        </div>
                    
                </div>
            )}
            {modalStop && (
                <div className={popup.modal}>
                    <div className={popup.content}>
                        <div className={popup.confirmation}>
                            <h3 className="headers">Bot Stopped!</h3>
                            <p className="paragraph">SlackBot has been successfully stopped, you can close this popup</p>
                        </div>
                        <button className={popup.close} onClick={closeModalStop}>Close</button>
                    </div>
                </div>

            )}
        </div>
    )
}
export default Remind