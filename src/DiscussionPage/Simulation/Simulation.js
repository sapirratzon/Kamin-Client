import React, { Component } from 'react';
import "./Simulation.css"

class Simulation extends Component {

    constructor() {
        super();
        this.state = {
            shownMessages: [],
            shownNodes: [],
            shownLinks: [],
            linksSet: new Set(),
            nodesMap: new Map (),
            currentMessageIndex: 1,
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
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            const messages = this.state.allMessages;
            const nodes = this.state.allNodes;
            const links = this.state.allLinks;
            let response = JSON.parse(xhr.responseText);
            this.getMessagesNodesLinks(response["tree"], messages, nodes, links);
            this.state.nodesMap.set(nodes[0].id, nodes[0]);
            this.state.shownMessages = messages.slice(0,1);
            this.state.shownNodes = nodes.slice(0,1);
            this.props.messagesHandler(this.state.shownMessages, this.state.shownNodes, this.state.shownLinks);
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
                color: "#" + intToRGB(hashCode(node["node"]["author"])),
            },
            text: node["node"]["text"],
            depth: node["node"]["depth"]
        });
        nodes.push({
            id: node["node"]["author"],
            color: "#" + intToRGB(hashCode(node["node"]["author"])),
            name: node["node"]["author"]
        });
        node["children"].map(child => {
            let link = {source: child["node"]["author"], target: node["node"]["author"]};
            links.push(link);
            this.getMessagesNodesLinks(child, messages, nodes, links);
        });
    };

    //presenting one message and matching graph
    renderMessageNodeLink = (dif) => {
        let i = this.state.currentMessageIndex;
        if (i + dif > 0 && i + dif < this.state.allMessages.length) {
            let messages = this.state.allMessages.slice(0, i+dif);
            let nodes = this.state.allNodes.slice(0, i+dif);
            let links = this.state.allLinks.slice(0, i+dif-1);
            this.state.shownMessages = messages;
            return {messages, nodes, links};
        }
    };

    handleNextClick = () => {
        const result = this.renderMessageNodeLink(1);
        const nextMessage = result.messages[this.state.currentMessageIndex];
        const userName = nextMessage["member"]["username"];
        if (!result.nodes.includes(userName))
            this.state.nodesMap.set(userName, this.state.allNodes.find(node=> node.id === userName));
        const link = {source: this.state.allLinks[this.state.currentMessageIndex - 1].source, target: this.state.allLinks[this.state.currentMessageIndex - 1].target};
        if (!result.links.includes(link))
            this.state.linksSet.add(link);
        this.updateState(1);
        this.props.messagesHandler(this.state.shownMessages, this.state.shownNodes, this.state.shownLinks);
    };

    handleBackClick = () => {
        const result = this.renderMessageNodeLink(-1);
        const deleteMessage = this.state.allMessages[this.state.currentMessageIndex-1];
        const userName = deleteMessage["member"]["username"];
        if (result.nodes.find(node => node.id === userName) == null)
            this.state.nodesMap.delete(userName);
        const link = {source: this.state.allLinks[this.state.currentMessageIndex - 2].source, target: this.state.allLinks[this.state.currentMessageIndex - 2].target};
        const ans = result.links.find(currLink => (currLink.source ===link.source && currLink.target === link.target));
        if (ans == null)
            this.state.linksSet.delete(ans);
        this.updateState(-1);
    };

    handleSimulateClick = async () => {
        while (this.state.currentMessageIndex + 1 < this.state.allMessages.length) {
            await this.handleNextClick();
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

    updateState(dif) {
        this.state.shownLinks = Array.from(this.state.linksSet);
        this.state.shownNodes = Array.from(this.state.nodesMap.values());
        this.state.currentMessageIndex+=dif;
        this.props.messagesHandler(this.state.shownMessages, this.state.shownNodes, this.state.shownLinks);
    }
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i) {
    const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

const sleep = m => new Promise(r => setTimeout(r, m));

export default Simulation;