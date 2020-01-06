import React, { Component } from 'react';
import Messages from "./MessagesList"
import "./Chat.css"
import { rgb } from "d3";


class Chat extends Component {

    constructor(props) {
        super(props);
        this.shownMessages = [];
        this.shownNodes = [];
        this.shownLinks = [];
        this.messagesCounter = 0;
    }

    componentDidMount() {
        if (!this.props.isSimulation) {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', () => {
                let response = JSON.parse(xhr.responseText);
                this.getMessagesNodesLinks(response["tree"]);
                this.props.messagesHandler(this.shownMessages, this.shownNodes, this.shownLinks);
            });
            xhr.open('GET', 'http://localhost:5000/getDiscussion/' + this.props.discussionId);
            xhr.send();
        }
    };

    // only converting tree to lists - gathering data
    getMessagesNodesLinks = (node) => {
        if (node == null) return;
        if (node["node"]["author"] === "Admin") {
            this.props.alertsHandler({ "position": this.messagesCounter, "text": node["node"]["text"] })
        }
        else {
            this.shownMessages.push({
                member: {
                    username: node["node"]["author"],
                    color: "#" + intToRGB(hashCode(node["node"]["author"])),
                },
                text: node["node"]["text"],
                depth: node["node"]["depth"]
            });
            this.shownNodes.push({
                id: node["node"]["author"],
                color: "#" + intToRGB(hashCode(node["node"]["author"])),
                name: node["node"]["author"],
                val: 3,
                updateVal: function (value) { this.val += value; },
            });
            node["children"].forEach(child => {
                if (child["node"]["author"] !== "Admin" && node["node"]["author"] !== "Admin") {
                    let link = {
                        source: child["node"]["author"],
                        target: node["node"]["author"],
                        messagesNumber: 1,
                        width: 1,
                        color: rgb(32, 32, 32, 1),
                        updateWidth: function (value) { this.width = value; },
                        updateMessagesNumber: function (value) { this.messagesNumber += value; },
                        updateOpacity: function (value) { this.color = rgb(value[0], value[1], value[2], value[3]); },
                    };
                    this.shownLinks.push(link);
                }
                this.getMessagesNodesLinks(child);
            });
        }
        this.messagesCounter++;
    };


    render() {
        return (
            <div className="chat">
                <Messages
                    messages={this.props.messages} isSimulation={this.props.isSimulation}
                />
            </div>);
    }

};

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i) {
    const c = (i & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

export default Chat;