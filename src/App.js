import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";
import GraphDrawer from "./Graph"
import { link } from 'fs';

class App extends Component {

    constructor() {
        super();
        this.state = {
            messages: [],
            nodes: [],
            links: [],
            linksSet: new Set([]),
            countMessages: 0,
            initialMessages: [],
            initialNodes: [],
            initialLinks: [],
            showGraph: false
        };

        this.handleNextClick = this.handleNextClick.bind(this);
    }

    componentDidMount() {
        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            const messages = this.state.initialMessages;
            const nodes = this.state.initialNodes;
            const links = this.state.initialLinks;
            let response = JSON.parse(xhr.responseText);
            // this.renderAllMessages(response["tree"], messages, nodes, links);
            this.getMessagesNodesLinks(response["tree"], messages, nodes, links);
        });
        xhr.open('GET', 'http://localhost:5000/getDiscussion/777');
        xhr.send();
    }

    pushAllMessages = (node, messages, nodes, links) => {
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
        this.setState({
            messages: messages
        });
        nodes.push({
            id: node["node"]["author"],
            color: "#" + intToRGB(hashCode(node["node"]["author"]))
        });
        this.setState({
            nodes: nodes
        });
        node["children"].map(child => {
            this.pushAllMessages(child, messages, nodes, links);
            let link = {
                source: child["node"]["author"], target: node["node"]["author"]
            }
            if (node["node"]["author"].length !== 0) {
                links.push(link);
            }
            this.setState({
                links: links
            });
        });
    };

    pushAllMessagesInDelay = (node, messages, nodes, links) => {
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
        this.setState({
            messages: messages
        });
        nodes.push({
            id: node["node"]["author"],
            color: "#" + intToRGB(hashCode(node["node"]["author"]))
        });
        this.setState({
            nodes: nodes
        });
        node["children"].map(child => {
            setTimeout(
                function () {
                    this.pushAllMessagesInDelay(child, messages, nodes, links);
                    let link = {
                        source: child["node"]["author"], target: node["node"]["author"]
                    }
                    if (node["node"]["author"].length !== 0) {
                        links.push(link);
                    }
                    this.setState({
                        links: links
                    });
                }
                    .bind(this),
                7000
            );
        });
    };

    getMessagesNodesLinks = (node, messages, nodes, links) => {
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
        node["children"].map(child => {
            let link = {
                source: child["node"]["author"], target: node["node"]["author"]
            }
            links.push(link);
            // if (node["node"]["author"].length !== 0 && node["node"]["author"] !== "[deleted]"
            //     && !this.state.linksSet.has(node.node.author + "," + child.node.author) && !this.state.linksSet.has(node.node.author + "," + node.node.author)) {
            //     links.push(link);
            //     this.state.linksSet.add(node.node.author + "," + child.node.author);
            // }
            this.getMessagesNodesLinks(child, messages, nodes, links);
        });
    };

    renderMessageNodeLink = () => {
        if (this.state.countMessages < this.state.initialMessages.length) {
            let i = this.state.countMessages;
            let messages = this.state.initialMessages.slice(0, i + 1);
            let nodes = this.state.initialNodes.slice(0, i + 1);
            let links = [];
            if (i > 0) {
                // let link = this.state.initialLinks[this.state.initialNodes[i].id + this.state.initialMessages[i].depth];
                links = this.state.initialLinks.slice(0, i)
            }
            this.setState({
                messages: messages,
                nodes: nodes,
                // links: link ? this.state.links.concat([link]) : [],
                links: links,
                countMessages: i + 1,
            })
            if (i > 0) {
                this.setState({ showGraph: true });
            }

        }
    }
    handleNextClick = () => {
        this.renderMessageNodeLink();
        console.log(this.state);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <button onClick={this.handleNextClick}>next</button>
                    <h1>Kamin Chat App</h1>
                </div>
                <div className="split right">
                    <div className="centered">
                        <h2>Conversation insights:</h2>
                        {this.state.showGraph ? <GraphDrawer
                            nodes={this.state.nodes}
                            links={this.state.links}
                        /> : <div></div>}

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
