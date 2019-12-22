import React from 'react';
import Messages from "./Messages"
import Input from "./Input"
import "./Chat.css"


const Chat = (props) => {
    return (
        <div className="chat">
            <Messages
                messages={props.messages}
            />
            <Input
                onSendMessage={props.onSendMessage}
            />
        </div>

    );
};

export default Chat;