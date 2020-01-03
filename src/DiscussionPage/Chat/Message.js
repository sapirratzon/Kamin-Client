import React, { Component } from "react";


class Message extends Component {

    componentDidUpdate() {
        let messagesDiv = document.querySelector(".Messages-list");
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

    };

    render() {
        const { member, text, depth } = this.props;
        let depthPixels = depth * 20;
        let depthString = depthPixels.toString() + "px";
        return (
            <li className="Messages-message">
                <span
                    className="avatar"
                    style={{
                        "backgroundColor": member.color,
                        "marginLeft": depthString
                    }}
                />
                <div className="Message-content">
                    <div className="username">
                        {member.username}
                    </div>
                    <div className="text"
                    >{text}</div>
                </div>
            </li>
        );
    }
}

export default Message;
