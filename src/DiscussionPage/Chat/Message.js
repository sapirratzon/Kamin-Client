import React, { Component } from "react";
import Input from "./Input";


class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showInput: false,
            replyText: "Reply"
        };
    }

    componentDidUpdate() {
        let messagesDiv = document.querySelector(".Messages-list");
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

    };

    replyHandler() {
        if (this.state.showInput) {
            this.setState({
                showInput: false,
                replyText: "Reply"
            });
        }
        else {
            this.setState({
                showInput: true,
                replyText: "Hide"
            });
        }
    };

    render() {
        let depthPixels = this.props.depth * 20;
        let depthString = depthPixels.toString() + "px";
        return (
            <li className="Messages-message">
                <span
                    className="avatar"
                    style={{
                        "backgroundColor": this.props.member.color,
                        "marginLeft": depthString
                    }}
                />
                <div className="Message-content">
                    <div className="username">
                        {this.props.member.username}
                    </div>
                    <div className="text"
                    >{this.props.text}</div>
                    {!this.props.isSimulation ?
                        <div className="reply">
                            <p><i className="far fa-comment-dots" onClick={this.replyHandler.bind(this)}>{this.state.replyText}</i></p>
                        </div>
                        : null
                    }
                    {this.state.showInput ?
                        <Input></Input>
                        : null
                    }
                </div>

            </li>
        );
    }
}

export default Message;
