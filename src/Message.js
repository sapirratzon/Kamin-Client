import {Component} from "react";

import React from "react";

class Message extends Component {
    render() {
        const {member, text, depth} = this.props;
        let depthPixels = depth * 30;
        let depthString = depthPixels.toString() + "px";
        return (
            <li className="Messages-message">
                <span
                    className="avatar"
                    style={{
                        "backgroundColor": member.color,
                        "margin-left": depthString
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
