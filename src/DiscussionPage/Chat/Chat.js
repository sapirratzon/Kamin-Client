import React, { Component } from 'react';
import Messages from "./MessagesList"
import "./Chat.css"


const Chat = (props) => {
    return (
        <div className="chat">
            <Messages
                messages={props.messages} isSimulation={props.isSimulation}
            />
        </div>
    );
};

export default Chat;