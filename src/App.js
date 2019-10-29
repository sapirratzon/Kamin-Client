import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";
import GraphDrawer from "./Graph"

class App extends Component {

    constructor() {
        super();
        this.state = {
            shownMessages: [],
            shownNodes: [],
            shownLinks: [],
            linksSet: new Set([]),
            currentMessageIndex: 0,
            allMessages: [],
            allNodes: [],
            allLinks: [],
            showGraph: true
        };

        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleSimulateClick = this.handleSimulateClick.bind(this);
    }

    componentDidMount() {
        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            const messages = this.state.allMessages;
            const nodes = this.state.allNodes;
            const links = this.state.allLinks;
            let response = JSON.parse(xhr.responseText);
            this.getMessagesNodesLinks(response["tree"], messages, nodes, links);
        });
        xhr.open('GET', 'http://localhost:5000/getDiscussion/777');
        xhr.send();
    }

    // not using this function - here hust for example
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

    // not using this function - here hust for example
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
            shownMessages: messages
        });
        nodes.push({
            id: node["node"]["author"],
            color: "#" + intToRGB(hashCode(node["node"]["author"]))
        });
        this.setState({
            shownNodes: nodes
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
                        shownLinks: links
                    });
                }
                    .bind(this),
                7000
            );
        });
    };

    // only converting tree to lists - gathering data
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
            this.getMessagesNodesLinks(child, messages, nodes, links);
        });
    };

    //presenting one messeage and matching graph
    renderMessageNodeLink = (dif) => {
        let i = this.state.currentMessageIndex;
        if (i + dif > 0 && i + dif < this.state.allMessages.length) {
            let messages = this.state.allMessages.slice(0, i + dif);
            let nodes = this.state.allNodes.slice(0, i + dif);
            let links = [];
            if (i > 0) {
                links = this.state.allLinks.slice(0, i + dif - 1)
            }
            this.setState({
                shownMessages: messages,
                shownNodes: nodes,
                shownLinks: links,
                currentMessageIndex: i + dif,
            }, () => {
                console.log(this.state)
            })
        }
    }

    handleNextClick = () => {
        this.renderMessageNodeLink(1);
    }

    handleBackClick = () => {
        this.renderMessageNodeLink(-1);
    }

    handleSimulateClick = async () => {
        while (this.state.currentMessageIndex + 1 < this.state.allMessages.length) {
            await this.renderMessageNodeLink(1);
            await (async () => {
                console.time("Slept for")
                await sleep(1000)
                console.timeEnd("Slept for")
            })();
        }
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <button onClick={this.handleNextClick}>next</button>
                    <button onClick={this.handleBackClick}>back</button>
                    <button onClick={this.handleSimulateClick}>simulate</button>
                    <h1>Kamin Chat App</h1>
                </div>
                <div className="split right">
                    <div className="centered">
                        <h2>Conversation insights:</h2>
                        {this.state.showGraph ? <GraphDrawer
                            nodes={this.state.shownNodes}
                            links={this.state.shownLinks}
                        /> : <div></div>}

                    </div>
                </div>
                <div className="split left">
                    <div className="centered">
                        <Messages
                            messages={this.state.shownMessages}
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
}


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

const sleep = m => new Promise(r => setTimeout(r, m))

export default App;
