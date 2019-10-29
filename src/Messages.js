import { Component } from "react";
import Delayed from './Delayed';
import Message from './Message';

import React from "react";

class Messages extends Component {
    render() {
        const { messages } = this.props;
        return (
            <ul className="Messages-list">
                {messages.map((m , i) => <Message key={i} member={m.member} text={m.text} depth={m.depth}></Message>)}
            </ul>

        );
    }
}

export default Messages;
