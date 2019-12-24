import React, { Component } from 'react';
import "./Simulation.css"

class Simulation extends Component {

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
        xhr.open('GET', 'http://localhost:5000/getDiscussion/1');
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
        this.props.messagesHandler(this.state.shownMessages, this.state.shownNodes, this.state.shownLinks);

    };

    handleNextClick = () => {
        this.renderMessageNodeLink(1);
        this.props.messagesHandler(this.state.shownMessages, this.state.shownNodes, this.state.shownLinks);
    };

    handleBackClick = () => {
        this.renderMessageNodeLink(-1);
        this.props.messagesHandler(this.state.shownMessages, this.state.shownNodes, this.state.shownLinks);
    };

    handleSimulateClick = async () => {
        while (this.state.currentMessageIndex + 1 < this.state.allMessages.length) {
            await this.renderMessageNodeLink(1);
            await (async () => {
                await sleep(1000);
            })();
        }
    };

    render() {
        return (
            <div id="simulation pt-2 pb-0">
                <h2 className="text-center">Simulation:</h2>
                <div className="row justify-content-around py-1" id="simulation-nav">
                    <div className="col-2">
                        <button type="button" className="btn btn-primary btn-m"
                            onClick={this.handleBackClick}>Back
                </button>
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-primary btn-m"
                            onClick={this.handleNextClick}>Next
                </button>
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-primary btn-m"
                            onClick={this.handleSimulateClick}>Run
                </button>
                    </div>
                </div>
            </div>
        );
    }

}

function hashCode(str) {
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

export default Simulation;