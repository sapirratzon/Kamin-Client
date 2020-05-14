import React, { Component } from 'react';
import { rgb } from "d3";
import { connect } from 'react-redux'
import Switch from 'react-switch'
import './Simulation.css';

class Simulation extends Component {

    constructor(props) {
        super(props);
        this.nodesChildren = new Map();
        this.currentMessageIndex = 1;
        this.allMessages = [];
        this.regularMessages = [];
        this.chronologicMessages = [];
        this.shownAlerts = [];
        this.shownMessages = [];
        this.shownNodes = [];
        this.shownLinks = [];
        this.messagesCounter = 0;
        this.socket = props.socket;
        this.state = {
            isChronological: true,
            selfControl: false
        }
    }

    componentDidMount() {
        this.socket.on('join room', async (response) => {
            if (this.allMessages.length === 0) {
                this.props.setTitle(response["discussionDict"]["discussion"]["title"]);
                this.loadMessages(response["discussionDict"]["tree"], 0, 1);
                this.chronologicMessages.sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                });
                if (response.simulationOrder === "regular") {
                    await this.setState({ isChronological: false });
                    this.allMessages = [...this.regularMessages];
                } else {
                    this.allMessages = [...this.chronologicMessages];
                }
                this.shownMessages = this.allMessages.slice(0, 1);
                this.nodesChildren.set(this.shownMessages[0].id, []);
                this.shownNodes.push({
                    id: this.shownMessages[0].author,
                    color: "#" + this.props.nodeColor(this.shownMessages[0].author),
                    name: this.shownMessages[0].author,
                    val: 0.5,
                    comments: 1,
                    commentsReceived: 0
                });
                const language = response.discussionDict.discussion.configuration.language;
                if (language) {
                    this.props.updateLanguage(language);
                }
                this.props.updateShownState(this.shownMessages, this.shownNodes, this.shownLinks, this.shownLinks);
                this.props.updateVisualConfig(response['discussionDict']['discussion']['configuration']['vis_config'],
                    response['visualConfig']['configuration']);
                while (this.currentMessageIndex < response["currentIndex"]) {
                    this.handleNextClick(false);
                }
                this.props.updateShownState(this.shownMessages, this.shownNodes, this.shownLinks, this.shownAlerts);
                if (response.selfControl === "on") {
                    await this.setState({ selfControl: true })
                }
                this.props.handleFinishLoading();
            }
        });
        const data = {
            discussion_id: this.props.discussionId,
            token: this.props.token
        };
        this.socket.emit('join', data);
        this.handleModeratorActions();
    }

    loadMessages = (commentNode, childIdx, branchId) => {
        if (commentNode == null) return;
        this.messagesCounter++;
        let parentUserName = '';
        if (commentNode["node"].parentId !== null)
            parentUserName = this.regularMessages.find(message => message.id === commentNode["node"].parentId).author;
        commentNode["node"].branchId = (commentNode["node"]["depth"] > 0 ? branchId + '.' + childIdx : '1');
        commentNode["node"].color = "#" + this.props.nodeColor(commentNode["node"]["author"]);
        commentNode["node"].numOfChildren = commentNode["children"].length;
        commentNode["node"].parentUsername = parentUserName;
        this.regularMessages.push(commentNode["node"]);
        this.chronologicMessages.push(commentNode["node"]);
        let i = 0;
        commentNode["children"].forEach(child => {
            this.loadMessages(child, i, commentNode["node"].branchId);
            i += 1;
        });
    };

    handleModeratorActions = () => {
        this.socket.on('next', () => { this.handleNextClick(true) });
        this.socket.on('back', () => { this.handleBackClick(true) });
        this.socket.on('reset', this.handleResetClick);
        this.socket.on('all', this.handleShowAllClick);
        this.socket.on('change_simulation_order', this.handleOrderSettings);
        this.socket.on('change_simulation_control', this.handleSelfControl);
    };

    handleNavigationClickModerator = (type) => {
        if (this.props.userType !== 'USER') {
            const data = { "discussionId": this.props.discussionId };
            this.socket.emit(type, data);
        }
    };

    handleNextClick = (toUpdateState) => {
        if (this.currentMessageIndex === this.allMessages.length) return;
        const nextMessage = this.allMessages[this.currentMessageIndex];
        if (nextMessage["comment_type"] !== "comment") {
            this.shownAlerts.push(nextMessage)
            this.update(1, toUpdateState);
            return;
        }
        const userName = nextMessage.author;
        const parentId = nextMessage.parentId;
        const parentUserName = this.shownMessages.find(message => message.id === parentId).author;
        const selfMessage = (userName === parentUserName);
        if (this.state.isChronological) {
            this.nextByTimestamp(nextMessage, selfMessage)
        }
        else {
            this.shownMessages = this.allMessages.slice(0, this.currentMessageIndex + 1);
            this.shownMessages = this.shownMessages.filter(msg => msg["comment_type"] === "comment");
        }
        if (selfMessage) {
            this.update(1, toUpdateState);
            return;
        }
        this.updateNodesNext(userName, parentUserName);
        this.updateLinksNext(userName, parentUserName);
        this.update(1, toUpdateState);
    };

    handleBackClick = (toUpdateState) => {
        if (this.currentMessageIndex === 1) return;
        const messageIndex = this.currentMessageIndex - 1;
        let deletedMessage = this.allMessages[messageIndex];
        if (deletedMessage["comment_type"] !== "comment") {
            this.shownAlerts.pop();
            this.update(-1, toUpdateState);
            return;
        }
        const userName = deletedMessage.author;
        const parentId = deletedMessage.parentId;
        const parentUserName = this.shownMessages.find(message => message.id === parentId).author;
        const selfMessage = (userName === parentUserName);
        if (this.state.isChronological) {
            this.backByTimestamp(messageIndex, selfMessage)
        } else {
            this.shownMessages = this.allMessages.slice(0, this.currentMessageIndex - 1);
            this.shownMessages = this.shownMessages.filter(msg => msg["comment_type"] === "comment");
        }
        if (selfMessage) {
            this.update(-1, toUpdateState);
            return;
        }
        this.updateLinksBack(userName, parentUserName);
        this.updateNodesBack(userName, parentUserName);
        this.update(-1, toUpdateState);
    };

    /*
     nextMessage - the next message that will be presented in the chat.
     Each node has an array of the ids of its children.
     Once the user press next, the function add the message to the children array of the parent of the author,
     add new element of the node (author).
     If the parent there are no children yet, the node will be add directly to the array, otherwise, the function
     will look for the last child (message) of its parent and will add this child after it.
     */
    nextByTimestamp = (nextMessage) => {
        const parentId = nextMessage.parentId;
        const parentIndex = this.shownMessages.findIndex(message => message.id === parentId);
        let children = this.nodesChildren.get(parentId);
        if (children.length === 0)
            this.shownMessages.splice(parentIndex + 1, 0, nextMessage);
        else {
            const lastChildId = children[children.length - 1];
            let prevMessageIndex = this.shownMessages.findIndex(message => message.id === lastChildId);
            while (prevMessageIndex + 1 < this.shownMessages.length &&
                this.shownMessages[prevMessageIndex + 1].depth > nextMessage.depth) {
                prevMessageIndex++;
            }
            this.shownMessages.splice(prevMessageIndex + 1, 0, nextMessage);
        }
        children.push(nextMessage.id);
        this.nodesChildren.set(parentId, children);
        this.nodesChildren.set(nextMessage.id, []);
    };

    /*
     properties:
     name - represents the messages number (also the tooltip)
     width - represent the
     color - represents the updating of the last message
     */

    updateLinksNext = (userName, parentUserName) => {
        const idx = this.shownLinks.findIndex(currentLink =>
            currentLink.source.id === userName && currentLink.target.id === parentUserName);
        if (idx === -1) {
            this.shownLinks.push({
                source: this.shownNodes.filter(node => node.id === userName)[0],
                target: this.shownNodes.filter(node => node.id === parentUserName)[0],
                name: 1,
                width: 1,
                color: rgb(32, 32, 32, 1),
                curvature: 0.2,
            })
        } else {
            this.shownLinks[idx].name = this.shownLinks[idx].name + 1;
            let updatedLink = this.shownLinks.splice(this.shownLinks[idx], 1);
            this.shownLinks.unshift(updatedLink[0]);
        }
        this.updateOpacityAll();
        this.updateWidthAll();
    };

    updateLinksBack = (userName, parentUserName) => {
        const linkIndex = this.shownLinks.findIndex(
            currentLink => currentLink.source.id === userName && currentLink.target.id === parentUserName);
        this.shownLinks[linkIndex].name -= 1;
        if (this.shownLinks[linkIndex].name === 0)
            this.shownLinks.splice(linkIndex, 1);
        this.updateWidthAll();
        this.updateOpacityAll();
    };

    updateNodesNext = (userName, parentUserName) => {
        const idx = this.shownNodes.findIndex(currentNode =>
            currentNode.id === userName);
        if (idx === -1) {
            this.shownNodes.push({
                id: userName,
                color: "#" + this.props.nodeColor(userName),
                name: userName,
                val: 0.5,
                children: [],
                comments: 1,
                commentsReceived: 0
            })
        } else {
            this.shownNodes[idx].val += 0.05;
            this.shownNodes[idx].comments++;
        }
        const parentIdx = this.shownNodes.findIndex(currentNode =>
            currentNode.id === parentUserName);
        this.shownNodes[parentIdx].commentsReceived++;
    };

    updateNodesBack = (userName, parentUserName) => {
        const linkIndex = this.shownLinks.findIndex(link => link.source.id === userName || link.target.id === userName);
        if (linkIndex === -1 && this.shownNodes.length > 1)
            this.shownNodes.splice(this.shownNodes.findIndex(node => node.id === userName), 1);
        else {
            const nodeIndex = this.shownNodes.findIndex(node => node.id === userName);
            this.shownNodes[nodeIndex].val -= 0.05;
            this.shownNodes[nodeIndex].comments--;
        }
        const parentIdx = this.shownNodes.findIndex(currentNode =>
            currentNode.id === parentUserName);
        this.shownNodes[parentIdx].commentsReceived--;
    };

    backByTimestamp = (messageIndex, selfMessage) => {
        const parentId = this.allMessages[messageIndex].parentId;
        let children = this.nodesChildren.get(parentId);
        children.splice(children.length - 1, 1);
        this.nodesChildren.set(parentId, children);

        const indexToDelete = this.shownMessages.findIndex(node => node.id === this.allMessages[messageIndex].id);
        this.shownMessages.splice(indexToDelete, 1);
    };

    handleShowAllClick = () => {
        while (this.currentMessageIndex < this.allMessages.length) {
            this.handleNextClick(false);
        }
        this.props.updateShownState(this.shownMessages, this.shownNodes, this.shownLinks, this.shownAlerts);
    };

    handleResetClick = () => {
        while (this.currentMessageIndex !== 1) {
            this.handleBackClick(false);
        }
        this.props.updateShownState(this.shownMessages, this.shownNodes, this.shownLinks, this.shownAlerts);
    };

    handleOrderSettings = () => {
        this.handleResetClick();
        this.setState((prevState) => ({
            isChronological: !prevState.isChronological,
        }), () => {
            this.state.isChronological ?
                this.allMessages = [...this.chronologicMessages] : this.allMessages = [...this.regularMessages];
        });

    };

    handleSelfControl = () => {
        this.setState((prevState) => ({
            selfControl: !prevState.selfControl,
        }), () => {
            if (!this.state.selfControl) {
                this.handleResetClick();
            }
        });

    };


    update(dif, toUpdateState) {
        this.currentMessageIndex = this.currentMessageIndex + dif;
        if (toUpdateState) {
            this.props.updateShownState(this.shownMessages, this.shownNodes, this.shownLinks, this.shownAlerts);
        }
    };

    updateOpacityAll() {
        for (let index = 0; index < this.shownLinks.length; index++) {
            let newOpacity = Math.pow(index, 3) / Math.pow(this.shownLinks.length - 1, 3);
            if (newOpacity < 0.2) {
                newOpacity = 0.2
            }
            this.shownLinks[index].color = rgb(32, 32, 32, newOpacity);
        }
    };

    updateWidthAll() {
        const allMessagesNumber = this.shownLinks.map(link => link.name);
        const max = Math.max(...allMessagesNumber);
        for (let index = 0; index < this.shownLinks.length; index++) {
            const value = this.shownLinks[index].name;
            this.shownLinks[index].width = (2 * (value - 1) / max) + 1;
        }
    };

    render() {
        return (
            <React.Fragment>
                {!this.props.isLoading ? <React.Fragment >
                    {(this.props.userType === "MODERATOR" || this.props.userType === "ROOT" || this.state.selfControl) &&
                        <div className={"row"} >
                            <button
                                type="button" className="btn btn-primary btn-sm"
                                onClick={() => { this.state.selfControl ? this.handleResetClick() : this.handleNavigationClickModerator("reset") }} >Reset
                            </button >
                            <button
                                type="button" className="btn btn-primary btn-sm"
                                onClick={() => { this.state.selfControl ? this.handleBackClick(true) : this.handleNavigationClickModerator("back") }} >Back
                            </button >
                            <button
                                type="button" className="btn btn-primary btn-sm"
                                onClick={() => { this.state.selfControl ? this.handleNextClick(true) : this.handleNavigationClickModerator("next") }} >Next
                            </button >
                            <button
                                type="button" className="btn btn-primary btn-sm"
                                onClick={() => { this.state.selfControl ? this.handleShowAllClick() : this.handleNavigationClickModerator("all") }} >All
                            </button >
                            <div data-tip={'Press here to change to ' + (!this.state.isChronological ? 'Chronological' : 'Regular') + ' order.'} >
                                <Switch
                                    className="commentsOrderToggle"
                                    onChange={() => { this.state.selfControl ? this.handleOrderSettings() : this.handleNavigationClickModerator("change_simulation_order") }}
                                    checked={this.state.isChronological}
                                    offColor="#4285f4"
                                    onColor="#4285f4"
                                />
                                <span ><b >{(this.state.isChronological ? 'Chronological' : 'Regular')}</b ></span >
                            </div >
                            {this.props.userType !== "USER" &&
                                <div className="pl-2" data-tip={'Press here to change to ' + (!this.state.selfControl ? 'Controll All' : 'Self Control')} >
                                    <Switch
                                        className="commentsOrderToggle"
                                        onChange={() => { this.handleNavigationClickModerator("self control change"); }}
                                        checked={this.state.selfControl}
                                        offColor="#4285f4"
                                        onColor="#4285f4"
                                    />
                                    <span ><b >Self Control</b ></span >
                                </div >
                            }
                        </div >
                    }
                </React.Fragment > : null}
            </React.Fragment>
        );
    };
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        userType: state.userType,
        token: state.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogOut: () => dispatch({ type: 'LOGOUT' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Simulation);
