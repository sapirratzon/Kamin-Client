import React, { Component } from 'react';
import { connect } from 'react-redux'
import Messages from "./Messages"
import "./Chat.css"
import { rgb } from "d3";

class Chat extends Component {

    constructor(props) {
        super(props);
        this.shownMessages = [];
        this.shownNodes = [];
        this.shownLinks = [];
        this.shownAlerts = [];
        this.linksMap = new Map();
        this.nodesMap = new Map();
        this.messagesCounter = 0;
        this.lastMessage = null;
        this.state = {
            root: null
        };
        this.socket = props.socket;
        this.sentimentColors = {
            good: rgb(0, 128, 0, 1),
            bad: rgb(255, 0, 0, 1),
            neutral: rgb(32, 32, 32, 1)
        }
    }

    componentDidMount() {
        if (!this.props.isSimulation) {
            this.socket.on('join room', (response) => {
                this.join(response);
            });
            const data = {
                discussion_id: this.props.discussionId,
                token: this.props.token
            };
            this.socket.emit('join', data);
            this.socket.on('message', (res) => {
                this.addComment(res.comment);
            });
            this.socket.on('new alert', (alert) => {
                this.addAlert(alert);
            });
        }
    };

    join(response) {
        this.initFields();
        this.setState(
            {
                root: response["discussionDict"]["tree"],
            }
        );
        this.props.setTitle(response["discussionDict"]["discussion"]["title"]);
        this.loadDiscussion(this.state.root, null, null);
        this.updateGraph();
        this.lastMessage = this.shownMessages.slice().sort(function (a, b) { return b.timestamp - a.timestamp; })[0];
        this.props.updateAlertedMessage(this.shownMessages.slice().sort(function (a, b) { return b.timestamp - a.timestamp; })[0]);
        this.shownAlerts.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });
        this.props.updateVisualConfig(response['discussionDict']['discussion']['configuration']['vis_config'],
            response['visualConfig']['configuration']);
        const language = response.discussionDict.discussion.configuration.language;
        if (language) {
            this.props.updateLanguage(language);
        }

        this.props.updateShownState(this.shownMessages, this.shownNodes, this.shownLinks, this.shownAlerts, this.lastMessage);
        this.props.handleFinishLoading();
    }

    updateGraph() {
        this.shownLinks = Array.from(this.linksMap.values());
        this.shownNodes = Array.from(this.nodesMap.values());
        this.shownLinks.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });
        this.updateLinksOpacity();
        this.updateLinksWidth();
    }

    reloadChat() {
        this.initFields();
        this.loadDiscussion(this.state.root, null, null);
        this.shownAlerts.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });
        this.updateGraph();
    }

    initFields() {
        this.linksMap = new Map();
        this.nodesMap = new Map();
        this.shownMessages = [];
        this.shownNodes = [];
        this.shownLinks = [];
        this.shownAlerts = [];
    }

    sendComment(targetId, message, depth) {
        const comment = JSON.stringify({
            "author": this.props.currentUser,
            "text": message,
            "parentId": targetId,
            "discussionId": this.props.discussionId,
            "depth": depth
        });
        this.socket.emit('add comment', comment)
    };

    addComment(message) {
        this.addMessageHelper(this.state.root, message);
        this.reloadChat();
        this.lastMessage = message;
        this.props.updateShownState(this.shownMessages, this.shownNodes, this.shownLinks, this.shownAlerts, message);
    };

    addAlert(alert) {
        this.addMessageHelper(this.state.root, alert);
        this.shownAlerts.push(alert);
        this.props.updateShownState(this.shownMessages, this.shownNodes, this.shownLinks, this.shownAlerts, this.lastMessage);
    };

    updateLinksOpacity() {
        this.shownLinks.forEach(link => {
            const index = this.shownLinks.indexOf(link);
            let newOpacity = Math.pow(index, 3) / Math.pow(this.shownLinks.length - 1, 3);
            if (newOpacity < 0.2) {
                newOpacity = 0.2
            }
            link.updateOpacity([link.color.r, link.color.g, link.color.b, newOpacity]);
        });
    }

    updateLinksWidth() {
        const allMessagesNumber = this.shownLinks.map(link => link.name);
        const max = Math.max(...allMessagesNumber);
        this.shownLinks.forEach(link => {
            const value = link.name;
            link.updateWidth((2 * (value - 1) / max) + 1);
        });
    }

    addMessageHelper(currentNode, comment, childIdx, branchId) {
        if (currentNode == null) return;
        if (currentNode["node"]["id"] === comment.parentId) {
            comment.childIdx = childIdx;
            comment.branchId = branchId + '.' + childIdx;
            currentNode["children"].push({
                node: comment,
                children: []
            });
            return;
        }
        let i = 0;
        currentNode["children"].forEach(child => {
            this.addMessageHelper(child, comment, i, currentNode.node.branchId);
            i += 1;
        });
    };

    loadDiscussion = (commentNode, childIdx, branchId) => {
        if (commentNode == null) return;
        if (commentNode["node"]["comment_type"] !== "comment") {
            if (commentNode["node"]["extra_data"]["recipients_type"] === 'all' ||
                this.props.currentUser in commentNode["node"]["extra_data"]["users_list"] ||
                this.props.userType !== "USER")
                if (this.props.userType !== "USER" || commentNode["node"]["comment_type"] === "alert") {
                    this.shownAlerts.push(commentNode["node"]);
                }
        } else if (commentNode["node"]["comment_type"] === "comment") {
            this.messagesCounter++;
            let newBranchId = (commentNode["node"]["depth"] > 0 ? branchId + '.' + childIdx : '1');

            this.shownMessages.push({
                ...commentNode["node"],
                parentUsername: commentNode["node"]["author"],
                color: "#" + this.props.nodeColor(commentNode["node"]["author"]),
                numOfChildren: commentNode["children"].length,
                childIdx: childIdx,
                branchId: newBranchId
            });
            if (!this.nodesMap.has(commentNode["node"]["author"])) {
                let node = {
                    id: commentNode["node"]["author"],
                    color: "#" + this.props.nodeColor(commentNode["node"]["author"]),
                    name: commentNode["node"]["author"],
                    timestamp: commentNode["node"]["timestamp"],
                    val: 0.5,
                    updateVal: function (value) {
                        this.val += value;
                    },
                    comments: 1,
                    commentsReceived: 0
                };
                this.nodesMap.set(commentNode["node"]["author"], node)
            }
            else {
                this.nodesMap.get(commentNode['node']['author'])['comments']++;
            }
            const parentId = this.shownMessages.find(message =>
                message.id === commentNode['node']['parentId']);
            if (parentId !== undefined) {
                let parentUsername = parentId.author;
                this.nodesMap.get(parentUsername)['commentsReceived']++;
            }
            let i = 0;
            commentNode["children"].forEach(childComment => {
                if (commentNode["node"]["comment_type"] === "comment" && childComment["node"]["comment_type"] === "comment") {
                    if (childComment["node"]["author"] !== commentNode["node"]["author"]) {
                        const key = childComment["node"]["author"] + " -> " + commentNode["node"]["author"];
                        if (!this.linksMap.has(key)) {
                            const sentimentColor = this.sentimentColors[commentNode.node.extra_data.sentiment];
                            const link = {
                                source: childComment["node"]["author"],
                                target: commentNode["node"]["author"],
                                timestamp: childComment["node"]["timestamp"],
                                name: 1,
                                width: 1,
                                curvature: 0.2,
                                // color: rgb(32, 32, 32, 1),
                                color: sentimentColor ? sentimentColor : this.sentimentColors["neutral"],
                                updateWidth: function (value) {
                                    this.width = value;
                                },
                                updateOpacity: function (value) {
                                    this.color = rgb(this.color.r, this.color.g, this.color.b, value[3]);
                                },
                            };
                            this.linksMap.set(key, link);
                        } else {
                            const link = this.linksMap.get(key);
                            link.timestamp = childComment["node"]["timestamp"];
                            link.name += 1;
                            const sentimentColor = this.sentimentColors[commentNode.node.extra_data.sentiment];
                            link.color = sentimentColor ? sentimentColor : this.sentimentColors["neutral"];
                            this.nodesMap.get(link.source).updateVal(0.05);
                        }
                    }
                }
                this.loadDiscussion(childComment, i, newBranchId);
                i += 1;
            });
        }
    };

    render() {
        return (
            <React.Fragment>
                {!this.props.isLoading ? <div className="chat" >
                    <Messages
                        messages={this.props.messages} isSimulation={this.props.isSimulation} directionClass={this.props.directionClass}
                        newCommentHandler={this.sendComment.bind(this)}
                        updateAlertedMessage={this.props.updateAlertedMessage}
                        updateVisibility={this.props.updateVisibility}
                        selectedMessage={this.props.selectedMessage}
                        selectedLink={this.props.selectedLink}
                    />
                </div > : null}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        token: state.token,
        userType: state.userType,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        collapseNode: (nodeBranch) => dispatch({ type: 'COLLAPSE_NODE', payload: { node: nodeBranch } })
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Chat);
