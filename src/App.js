import React, {Component} from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";


class App extends Component {
    state = {
        messages: [],
        member: {
            username: "Guy",
            color: "blue",
        }
    }

    constructor() {
        super();
        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            const member = {...this.state.member};
            member.id = 1;
            this.setState({member});
            const messages = this.state.messages;
            let response = JSON.parse(xhr.responseText);
            for (const [key, value] of Object.entries(response)) {
                let entries = Object.entries(value);
                for (const [key, value] of entries) {
                    messages.push({member: member, text: key, father: null, id: null, tag: null, action: null});

                }
                messages.push({member: member, text: key, father: null, id: null, tag: null, action: null});
            }
            this.setState({messages});

        });
        xhr.open('GET', 'https://dog.ceo/api/breeds/list/all');
        xhr.send();
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Best chat everrr</h1>
                </div>
                <div className="information">
                    <h2>Conversation insights:</h2>
                </div>
                <Messages
                    messages={this.state.messages}
                    currentMember={this.state.member}
                />
                <Input
                    onSendMessage={this.onSendMessage}
                />
            </div>
        );
    }

    onSendMessage = (message) => {

    }

}

export default App;
