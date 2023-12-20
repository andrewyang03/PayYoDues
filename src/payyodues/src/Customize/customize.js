let customize = () => {
    return (
        <div>
            <h1>Customize Script</h1>
            <div>
                <h3>Message Content</h3>
                <input type="text" placeholder="default message is applied for no input"></input>
            </div>
            <div>
                <h3>Frequency</h3>
                <p>How often do you want users to be reminded</p>
                <select>
                    <option>Twice a Day</option>
                    <option>Every Day</option>
                    <option>Twice a Week</option>
                    <option>Every Week</option>
                    <option>Ever Two Weeks</option>
                </select>
            </div>
            <div>
                {/* Onclick should provide a confirmation popup */}
                <button onClick="">Run SlackBot</button>
            </div>
        </div>
    )
}
export default customize