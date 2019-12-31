import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import "./Simulation.css"

class Simulation extends Component {
    showGraph;

    constructor(props) {
        super(props);
        this.graphLinks = [];
        this.nodesMap = new Map();
        this.currentMessageIndex = 1;
        this.allMessages = [];
        this.allNodes = [];
        this.allLinks = [];
        this.allAlerts = [];
        this.showGraph = true;
        this.shownMessages = [];
        this.shownNodes = [];
        this.shownLinks = [];
        this.messagesCounter = 0;

    }

    componentDidMount() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            const messages = this.allMessages;
            const nodes = this.allNodes;
            const links = this.allLinks;
            let response = JSON.parse(xhr.responseText);
            this.getMessagesNodesLinks(response["tree"], messages, nodes, links);
            this.nodesMap.set(nodes[0].id, nodes[0]);
            this.shownMessages = messages.slice(0, 1);
            this.shownNodes = nodes.slice(0, 1);

            this.props.messagesHandler(this.shownMessages, this.shownNodes, this.shownLinks);
        });
        xhr.open('GET', 'http://localhost:5000/getDiscussion/21');
        xhr.send();
    }

    // only converting tree to lists - gathering data
    getMessagesNodesLinks = (node, messages, nodes, links) => {
        if (node == null)
            return;
        if (node["node"]["author"] === "Admin") {
            this.props.alertsHandler({ "position": this.messagesCounter, "text": node["node"]["text"] })
        }
        else {
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
                name: node["node"]["author"],
                // extraVal: 0,
                val: 3,
                changeVal: function(value) { this.val += value; } ,
                // changeVal: function(value) { if (this.val > 4) { this.extraVal+=value; } else{ this.val += value; }} ,
                // changeValDown: function (value) { if (this.extraVal !== 0) { this.extraVal += value; } else{ this.val+=value; }}
            });
            node["children"].forEach(child => {
                if (child["node"]["author"] !== "Admin" && node["node"]["author"] !== "Admin") {
                    let link = {
                        source: child["node"]["author"],
                        target: node["node"]["author"],
                        name: 1,
                        width: 1,
                        changeWidth: function(value){this.width += value;}
                    };
                    links.push(link);
                }
                this.getMessagesNodesLinks(child, messages, nodes, links);
            });
        }
        this.messagesCounter++;
    };

    handleNextClick = () => {
        if (this.currentMessageIndex === this.allMessages.length) return;
        const nextMessage = this.allMessages[this.currentMessageIndex];
        const userName = nextMessage["member"]["username"];
        if (!this.nodesMap.has(userName))
            this.nodesMap.set(userName, this.allNodes.find(node => node.id === userName));
        const link = cloneDeep(this.allLinks[this.currentMessageIndex - 1]);
        const idx = this.graphLinks.findIndex(currentLink => currentLink !== null &&
            currentLink.source.id === link.source && currentLink.target.id === link.target);
        // const oppositeLink = this.graphLinks.findIndex(currentLink => currentLink !== null &&
        //     currentLink.source.id === link.target && currentLink.target.id === link.source);
        if (idx === -1) { this.graphLinks.push(link); }
        else { this.graphLinks[idx].changeWidth(0.1); }
        // if (oppositeLink !== -1){ this.graphLinks[oppositeLink].changeWidth(0.1); }
        this.nodesMap.get(link.target).changeVal(0.1);
        this.update(1);
    };

    handleBackClick = () => {
        if (this.currentMessageIndex === 1) return;
        const messageIndex = this.currentMessageIndex - 1;
        const userName = this.allMessages[messageIndex]["member"]["username"];
        const links = this.allLinks.slice(0, messageIndex - 1);
        const nodes = this.allNodes.slice(0, messageIndex);
        const link = cloneDeep(this.allLinks[messageIndex - 1]);
        this.nodesMap.get(link.target).changeVal(-0.1);
        if (nodes.find(node => node.id === userName) == null)
            this.nodesMap.delete(userName);
        const linkIndex = links.findIndex(currentLink => currentLink.source === link.source && currentLink.target === link.target);
        const idx = this.graphLinks.findIndex(currentLink => currentLink.source.id === link.source && currentLink.target.id === link.target);
        // const oppositeLink = this.graphLinks.findIndex(currentLink => currentLink !== null &&
        //     currentLink.source.id === link.target && currentLink.target.id === link.source);
        if (linkIndex === -1) { this.graphLinks.splice(idx); }
        else { this.graphLinks[idx].changeWidth(-0.1); }
        // if (oppositeLink !== -1){ this.graphLinks[oppositeLink].changeWidth(-0.1); }
        this.update(-1);
    };

    handleSimulateClick = async () => {
        while (this.currentMessageIndex + 1 < this.allMessages.length) {
            await this.handleNextClick();
            await (async () => {
                await sleep(1000);
            })();
        }
    };

    handleShowAllClick = async () => {
        while (this.currentMessageIndex + 1 < this.allMessages.length) {
            await this.handleNextClick();
            await sleep(1);
        }
        this.props.messagesHandler(this.shownMessages, this.shownNodes, this.shownLinks);
    };

    handleResetClick = () => {
        while (this.currentMessageIndex !== 1) {this.handleBackClick();}
        this.props.messagesHandler(this.shownMessages, this.shownNodes, this.shownLinks);
    };


    render() {
        return (
            <div id="simulation pt-2 pb-0">
                <div className="row justify-content-around py-1" id="simulation-nav">
                    <button type="button" className="btn btn-primary btn-sm"
                            onClick={this.handleResetClick}>Reset
                    </button>
                    <button type="button" className="btn btn-primary btn-sm"
                            onClick={this.handleBackClick}>Back
                    </button>
                    <button type="button" className="btn btn-primary btn-sm"
                            onClick={this.handleNextClick}>Next
                    </button>
                    <button type="button" className="btn btn-primary btn-sm"
                            onClick={this.handleShowAllClick}>All
                    </button>
                    <button type="button" className="btn btn-primary btn-sm"
                            onClick={this.handleSimulateClick}>Simulate
                    </button>
                </div>
            </div>
        );
    }

    update(dif) {
        this.shownMessages = this.allMessages.slice(0, this.currentMessageIndex + dif);
        this.shownLinks = Array.from(this.graphLinks);
        this.shownNodes = Array.from(this.nodesMap.values());
        this.currentMessageIndex = this.currentMessageIndex + dif;
        this.props.messagesHandler(this.shownMessages, this.shownNodes, this.shownLinks);
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