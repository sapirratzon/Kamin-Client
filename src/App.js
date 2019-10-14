import React, {Component} from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";


class App extends Component {
    state = {
        messages: [],
    }

    constructor() {
        super();
        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            const messages = this.state.messages;
            let response = JSON.parse(xhr.responseText);
            pushAllMessages(response["tree"], messages);
            this.setState({messages});

        });
        xhr.open('GET', 'http://localhost:5000/getDiscussion/777');
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

function pushAllMessages(node, messages) {
    if (node == null)
        return;
    messages.push({
            member: {
                username: node["node"]["author"],
                color: "#" + intToRGB(hashCode(node["node"]["author"]))
            },
            text: node["node"]["text"],
            depth: node["node"]["depth"]

        }
    );
    node["children"].forEach(function (child) {
        pushAllMessages(child, messages);
    });


    function hashCode(str) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    function intToRGB(i) {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "00000".substring(0, 6 - c.length) + c;
    }
}


export default App;
