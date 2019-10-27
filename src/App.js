import React, {Component} from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";
import GraphDrawer from "./Graph"

class App extends Component {
    state = {
        messages: [],
        nodes: [],
        links: []
    };

    constructor() {
        super();
        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            const messages = this.state.messages;
            const nodes = this.state.nodes;
            const links = this.state.links;
            let response = JSON.parse(xhr.responseText);
            pushAllMessages(response["tree"], messages, nodes, links);
            this.setState({messages: messages, nodes: nodes, links: links});

        });
        xhr.open('GET', 'http://localhost:5000/getDiscussion/777');
        xhr.send();
    }


    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Best chat ever</h1>
                </div>
                <div className="split right">
                    <div className="centered">
                        <h2>Conversation insights:</h2>
                        <GraphDrawer
                            nodes={this.state.nodes}
                            links={this.state.links}
                        />
                    </div>
                </div>
                <div className="split left">
                    <div className="centered">
                        <Messages
                            messages={this.state.messages}
                            currentMember={this.state.member}
                        />
                        <Input
                            onSendMessage={this.onSendMessage}
                        />
                    </div>
                </div>

            </div>
        );
    }

    onSendMessage = (message) => {

    }

}

function pushAllMessages(node, messages, nodes, links) {
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
    nodes.push({
        id: node["node"]["author"],
        color: "#" + intToRGB(hashCode(node["node"]["author"]))
    });
    node["children"].forEach(function (child) {
        if (node["node"]["author"].length !== 0) {
            links.push({
                source: child["node"]["author"], target: node["node"]["author"]
            });
        }
    });
    node["children"].forEach(function (child) {
        pushAllMessages(child, messages, nodes, links);
    });


}

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function intToRGB(i) {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}


export default App;
