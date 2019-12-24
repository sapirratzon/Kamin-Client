import React from "react";
import Message from './Message';


const Messages = (props) => {
    return (
        <ul className="Messages-list">
            {props.messages.map((m, i) => <Message key={i} member={m.member} text={m.text} depth={m.depth} />)}
        </ul>
    );
}

export default Messages;
