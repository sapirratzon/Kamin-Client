import { Component } from "react";
import Delayed from './Delayed';

import React from "react";

class Message extends Component {
    render() {
        // let delayTime = 1000;
        const { member, text, depth } = this.props;
        var depthPixels = depth * 30;
        var depthString = depthPixels.toString() + "px";
        return (
            // <Delayed waitBeforeShow={delayTime}>

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
                        style={{
                            "backgroundColor": member.color
                        }}
                    >{text}</div>
                </div>
            </li>
            // </Delayed>
        );
    }
}

export default Message;
