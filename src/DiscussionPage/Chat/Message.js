import React, {Component} from "react";
import Input from "./Input";


class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showInput: false,
            replyText: "Reply"
        };
    }

    componentDidUpdate = () => {
        if (this.props.isSimulation) {
            let messagesDiv = document.querySelector(".Messages-list");
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    };

    replyHandler = () => {
        if (this.state.showInput) {
            this.setState({
                showInput: false,
                replyText: "Reply"
            });
        } else {
            this.setState({
                showInput: true,
                replyText: "Hide"
            });
        }
    };

    sendMessageHandler = (message) => {
        this.props.newMessageHandler(this.props.member.id, "Guy", message, this.props.depth + 1);
        this.replyHandler();
    };

    getDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date);
        // return date.format("dd.mm.yyyy hh:MM:ss");
    };

    render() {
        let depthPixels = this.props.depth * 20;
        let depthString = depthPixels.toString() + "px";
        return (
            <li className="Messages-message" style={{"marginLeft": depthString}}>
                <div className="vl"/>
                <span
                    className="avatar"
                    style={{
                        "backgroundColor": this.props.member.color,
                    }}
                />
                <div className="Message-content">
                    <div className="username">
                        {this.props.member.username}{"  "}{this.getDate(this.props.timestamp)}
                    </div>
                    <div className="text">{this.props.text}</div>
                    {!this.props.isSimulation ?
                        <div className="reply">
                            <p><i className="far fa-comment-dots"
                                  onClick={this.replyHandler.bind(this)}>{this.state.replyText}</i></p>
                        </div>
                        : null
                    }
                    {this.state.showInput ?
                        <Input onSendMessage={this.sendMessageHandler.bind(this)}/>
                        : null
                    }
                </div>

            </li>
        );
    }
}

export default Message;
