import React, { Component } from 'react';
import Messages from "./MessagesList"
import "./Chat.css"
import { rgb } from "d3";
import io from 'socket.io-client';


class Chat extends Component {

    constructor(props) {
        super(props);
        this.shownMessages = [];
        this.shownNodes = [];
        this.shownLinks = [];
        this.messagesCounter = 0;
        this.state = {
            root: null
        }
        this.socket = io('http://localhost:5000/');
    }

    componentDidMount() {
        if (!this.props.isSimulation) {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', () => {
                let response = JSON.parse(xhr.responseText);
                this.setState(
                    {
                        root: response["tree"]
                    }
                );
                this.getMessagesNodesLinks(this.state.root);
                this.props.messagesHandler(this.shownMessages, this.shownNodes, this.shownLinks);
            });
            xhr.open('GET', 'http://localhost:5000/api/getDiscussion/' + this.props.discussionId);
            // For Chat Debug
            // xhr.open('GET', 'http://localhost:5000/api/getDiscussion/5e1646da79c9da9f2113e70c');
            xhr.open('GET', 'http://localhost:5000/api/getDiscussion/5e0795acccadf5b7189464dd');
            xhr.send();
            this.socket.on('add comment', (res) => {
                this.addMessage(res.comment);
            });
        }
    };

    sendMessage(targetId, author, message, depth) {
        const comment = JSON.stringify({
            "author": "Guy",
            "text": message,
            "parentId": targetId,
            "discussionId": this.props.discussionId,
            "extra_data": null,
            "time_stamp": 0,
            "depth": depth
        });
        this.socket.emit('add comment', comment)
    };

    addMessage(message) {
        console.log(message.depth);
        this.addMessageHelper(this.state.root, null, message.parentId, message.author, message.text, message.depth, message.id);
        this.shownMessages = [];
        this.shownNodes = [];
        this.shownLinks = [];
        this.getMessagesNodesLinks(this.state.root);
        this.props.messagesHandler(this.shownMessages, this.shownNodes, this.shownLinks);
    };

    addMessageHelper(node, fatherNode, targetId, author, message, depth, messageId) {
        if (node == null) return;
        if (node["node"]["id"] === targetId) {
            if (fatherNode === null) {
                this.state.root["children"].push({
                    node: {
                        author: author,
                        depth: depth,
                        id: messageId,
                        text: message,
                        children: []
                    },
                    children: []
                });
            }
            else {
                fatherNode["children"].push({
                    node: {
                        author: author,
                        depth: depth,
                        id: messageId,
                        text: message,
                        children: []
                    },
                    children: []
                });
            }


        }
        node["children"].forEach(child => {
            this.addMessageHelper(child, node, targetId, author, message, depth, messageId);
        });
    };


    getMessagesNodesLinks = (node) => {
        if (node == null) return;
        this.shownMessages.push({
            member: {
                username: node["node"]["author"],
                id: node["node"]["id"],
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
    };


    render() {
        return (
            <div className="chat">
                <Messages
                    messages={this.props.messages} isSimulation={this.props.isSimulation} newMessageHandler={this.sendMessage.bind(this)}
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