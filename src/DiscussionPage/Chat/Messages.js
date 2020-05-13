import React, { Component } from "react";
import Message from './Message';
import { connect } from 'react-redux'

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branchId: '~'
        }
    }

    render() {
        return (
            <ul className="Messages-list" >
                {this.props.messages.map((m) => {
                    debugger
                    let showMessage = true;
                    let showMoreMessages = false;
                    for (let collapsedNode of this.props.collapsedNodes) {
                        if (m.branchId === collapsedNode)
                            showMoreMessages = true;
                        else if (m.branchId !== collapsedNode && m.branchId.startsWith(collapsedNode))
                            showMessage = false;
                    }
                    return showMessage && <Message
                        key={m.id} username={m.author} color={m.color} text={m.text}
                        timestamp={m.timestamp} directionClass={props.directionClass}
                        depth={m.depth} id={m.id} isSimulation={this.props.isSimulation}
                        newCommentHandler={this.props.newCommentHandler} newAlertHandler={this.props.newAlertHandler}
                        updateAlertedMessage={this.props.updateAlertedMessage}
                        updateVisibility={this.props.updateVisibility}
                        selected={this.props.selectedMessage === m.id}
                        branchId={m.branchId}
                        parentBranchId={this.state.branchId}
                        showMoreMessages={showMoreMessages}
                    />
                })}
            </ul >
        );
    }
};

const mapStateToProps = state => {
    return {
        collapsedNodes: state.collapsedNodes,
    };
};

export default connect(mapStateToProps)(Messages);