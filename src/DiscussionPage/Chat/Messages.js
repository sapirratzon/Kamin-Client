import React, { Component } from "react";
import Message from './Message';
import { connect } from 'react-redux'

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsedNodes: [],
        }
    }

    handleCollapseNodes = (collapsedNode) => {
        if (this.state.collapsedNodes.includes(collapsedNode)) {
            this.setState({ collapsedNodes: [...this.state.collapsedNodes.filter((node) => node !== collapsedNode)] });
        }
        else {
            this.setState({ collapsedNodes: [...this.state.collapsedNodes, collapsedNode] });
        }
    }

    render() {
        return (
            <ul className="Messages-list" >
                {this.props.messages.map((m) => {
                    let showMessage = true;
                    let showMoreMessages = false;
                    for (let collapsedNode of this.state.collapsedNodes) {
                        if (m.branchId === collapsedNode)
                            showMoreMessages = true;
                        else if (m.branchId !== collapsedNode && m.branchId.startsWith(collapsedNode))
                            showMessage = false;
                    }
                    return showMessage && <Message
                        key={m.id} username={m.author} color={m.color} text={m.text}
                        timestamp={m.timestamp} directionClass={this.props.directionClass}
                        depth={m.depth} id={m.id} numOfChildren={m.numOfChildren} isSimulation={this.props.isSimulation}
                        newCommentHandler={this.props.newCommentHandler} newAlertHandler={this.props.newAlertHandler}
                        updateAlertedMessage={this.props.updateAlertedMessage}
                        updateVisibility={this.props.updateVisibility}
                        selected={this.props.selectedMessage === m.id}
                        branchId={m.branchId}
                        showMoreMessages={showMoreMessages}
                        collapseNode={this.handleCollapseNodes}
                    />
                })}
            </ul >
        );
    }
};

export default (Messages);