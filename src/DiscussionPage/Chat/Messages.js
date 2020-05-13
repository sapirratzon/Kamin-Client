import React from "react";
import Message from './Message';
import { connect } from 'react-redux'

const Messages = (props) => {
    return (
        <ul className="Messages-list" >
            {props.messages.map((m) => {
                let showMessage = true;
                let showMoreMessages = false;
                for (let collapsedNode of props.collapsedNodes) {
                    if (m.branchId === collapsedNode)
                        showMoreMessages = true;
                    else if (m.branchId !== collapsedNode && m.branchId.startsWith(collapsedNode))
                        showMessage = false;
                }
                return showMessage && <Message
                    key={m.id} username={m.author} color={m.color} text={m.text}
                    timestamp={m.timestamp} directionClass={props.directionClass}
                    depth={m.depth} id={m.id} isSimulation={props.isSimulation}
                    newCommentHandler={props.newCommentHandler} newAlertHandler={props.newAlertHandler}
                    updateAlertedMessage={props.updateAlertedMessage}
                    updateVisibility={props.updateVisibility}
                    selected={props.selectedMessage === m.id}
                    branchId={m.branchId}
                    showMoreMessages={showMoreMessages}
                />
            })}
        </ul >
    );
};

const mapStateToProps = state => {
    return {
        collapsedNodes: state.collapsedNodes,
    };
};

export default connect(mapStateToProps)(Messages);