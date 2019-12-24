import React, { Component } from 'react';
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
        this.showGraph = true;
        this.shownMessages = [];
        this.shownNodes = [];
        this.shownLinks = [];
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleSimulateClick = this.handleSimulateClick.bind(this);
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
            this.shownMessages= messages.slice(0, 1);
            this.shownNodes= nodes.slice(0, 1);
            this.props.messagesHandler(this.shownMessages, this.shownNodes, this.shownLinks);
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
        node["children"].forEach(child => {
            let link = { source: child["node"]["author"], target: node["node"]["author"] };
            links.push(link);
            this.getMessagesNodesLinks(child, messages, nodes, links);
        });
    };

    //presenting one message and matching graph
    renderMessageNodeLink = (dif, message) => {
        let i = this.currentMessageIndex;
        if (i + dif > 0 && i + dif < this.allMessages.length) {
            const userName = message["member"]["username"];
            const messages = this.allMessages.slice(0, i + dif);
            const nodes = this.allNodes.slice(0, i + dif);
            const links = this.allLinks.slice(0, i + dif - 1);
            this.shownMessages= messages;
            return {nodes, links, userName};
        }
        return 0;
    };

    handleNextClick = () => {
        const nextMessage = this.allMessages[this.currentMessageIndex];
        const result = this.renderMessageNodeLink(1, nextMessage);
        if (result !== 0) {
            if (!result.nodes.includes(result.userName))
                this.nodesMap.set(result.userName, this.allNodes.find(node => node.id === result.userName));
            const link = this.allLinks[this.currentMessageIndex - 1];
            const ans = this.graphLinks.findIndex(currentLink => currentLink.source === link.source && currentLink.target === link.target);
            if (ans === -1)
                this.graphLinks.push(link);
            this.update(1);
        }
    };

    handleBackClick = () => {
        const deleteMessage = this.allMessages[this.currentMessageIndex - 1];
        const result = this.renderMessageNodeLink(-1, deleteMessage);
        if (result !== 0) {
            if (result.nodes.find(node => node.id === result.userName) == null)
                this.nodesMap.delete(result.userName);
            const link = this.allLinks[this.currentMessageIndex - 2];
            const linkIndex = result.links.findIndex(currentLink => currentLink.source.id === link.source && currentLink.target === link.target.id);
            if (linkIndex === -1) {
                const idx = this.graphLinks.findIndex(currentLink => currentLink.source === link.source && currentLink.target === link.target);
                this.graphLinks.splice(idx);
            }
            this.update(-1);
        }
    };

    handleSimulateClick = async () => {
        while (this.currentMessageIndex + 1 < this.allMessages.length) {
            await this.handleNextClick();
            await (async () => {
                await sleep(1000);
            })();
        }
    };

    handleShowAllClick = () => {
        const uniqueIds = new Set();
        const uniqueNodes = [];
        for(let node of this.allNodes){
            if(!node.id in uniqueNodes){
                uniqueNodes.push(node);
                uniqueIds.add(node.id);
            }
        }
        this.props.messagesHandler(this.allMessages, uniqueNodes, this.graphLinks);
    };

    handleResetClick =  () => {
        this.props.messagesHandler(this.allMessages[0], this.allNodes[0], []);
    }


    render() {
        return (
            <div id="simulation pt-2 pb-0">
                <h2 className="text-center">Simulation:</h2>
                <div className="row justify-content-around py-1" id="simulation-nav">
                    <div className="col">
                        <button type="button" className="btn btn-primary btn-m"
                                onClick={this.handleResetClick}>Reset
                        </button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-primary btn-m"
                                onClick={this.handleBackClick}>Back
                        </button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-primary btn-m"
                                onClick={this.handleNextClick}>Next
                        </button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-primary btn-m"
                                onClick={this.handleShowAllClick}>All
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    update(dif) {
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
;
const sleep = m => new Promise(r => setTimeout(r, m));

export default Simulation;