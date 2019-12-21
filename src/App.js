import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";
import GraphDrawer from "./Graph"
import ForceGraph2D from 'react-force-graph-2d';

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
            color: "#" + intToRGB(hashCode(node["node"]["author"])),
            name: node["node"]["author"]
        });
        node["children"].map(child => {
            let link = {
                source: child["node"]["author"], target: node["node"]["author"]
            };
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
    };

    handleNextClick = () => {
        this.renderMessageNodeLink(1);
    };

    handleBackClick = () => {
        this.renderMessageNodeLink(-1);
    };

    handleSimulateClick = async () => {
        while (this.state.currentMessageIndex + 1 < this.state.allMessages.length) {
            await this.renderMessageNodeLink(1);
            await (async () => {
                console.time("Slept for");
                await sleep(1000);
                console.timeEnd("Slept for")
            })();
        }
    };

    render() {
        return (
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-1">
                    <div className="container-fluid px-5">
                        <a className="navbar-brand" href="#"><i className="fas fa-dungeon pr-2"></i>Kamin</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Popular <span className="sr-only">(current)</span></a>
                                </li>
                            </ul>
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <a className="nav-link" href="#"><i className="fas fa-sign-in-alt pr-2"></i>Sign
                                        In <span className="sr-only">(current)</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#"><i className="fas fa-user-plus pr-2"></i>Sign
                                        Up <span className="sr-only">(current)</span></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="row px-5 content">
                    <div className="col-6 py-3">
                        <Messages
                            messages={this.state.shownMessages}
                            currentMember={this.state.member}
                        />
                        <Input
                            onSendMessage={this.onSendMessage}
                        />
                    </div>
                    <div className="col-6">
                        <h2 className="text-center py-2">Simulation:</h2>
                        <div className="row justify-content-around py-3 w-85">
                            <div className="col-2"></div>
                            <div className="col-2">
                                <button type="button" className="btn btn-primary btn-lg"
                                    onClick={this.handleBackClick}>Back
                                </button>
                            </div>
                            <div className="col-2">
                                <button type="button" className="btn btn-primary btn-lg"
                                    onClick={this.handleNextClick}>Next
                                </button>
                            </div>
                            <div className="col-2">
                                <button type="button" className="btn btn-primary btn-lg"
                                    onClick={this.handleSimulateClick}>Run
                                </button>
                            </div>

                        </div>
                        <h2 className="text-center">Conversation Insights:</h2>
                        <div id="graph">
                            <ForceGraph2D graphData={{
                                "nodes": this.state.shownNodes,
                                "links": this.state.shownLinks
                            }}></ForceGraph2D>
                        </div>
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

const sleep = m => new Promise(r => setTimeout(r, m));

export default App;
