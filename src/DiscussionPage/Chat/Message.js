import React, { Component } from "react";
import Input from "./Input";
import { connect } from 'react-redux'



class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showReplyInput: false,
            replyText: "Reply",
            showAlertInput: false,
            alertText: "Alert"
        };
    }

    componentDidUpdate = () => {
        if (this.props.isSimulation) {
            let messagesDiv = document.querySelector(".Messages-list");
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    };

    replyHandler = () => {
        if (this.state.showReplyInput) {
            this.setState({
                showReplyInput: false,
                replyText: "Reply"
            });
        } else {
            this.setState({
                showReplyInput: true,
                replyText: "Hide"
            });
        }
    };

    alertHandler = () => {
        if (this.state.showAlertInput) {
            this.setState({
                showAlertInput: false,
                alertText: "Alert"
            });
        } else {
            this.setState({
                showAlertInput: true,
                alertText: "Hide"
            });
        }
    };

    sendMessageHandler = (message) => {
        this.state.showReplyInput ? this.props.newMessageHandler(this.props.id, "Guy", message, this.props.depth + 1) :
            this.props.newAlertHandler(this.props.id, message);
        this.replyHandler();
    };

    getDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        console.log(timestamp);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(date);
        // return date.format("dd.mm.yyyy hh:MM:ss");
    };

    render() {
        let depthPixels = this.props.depth * 20;
        let depthString = depthPixels.toString() + "px";
        return (
            <li className="Messages-message" style={{ "marginLeft": depthString }}>
                <div className="vl" />
                <span
                    className="avatar"
                    style={{
                        "backgroundColor": this.props.color,
                    }}
                />
                <div className="Message-content">
                    <div className="username">
                        {this.props.username}{"  "}{this.getDate(this.props.timestamp)}
                    </div>
                    <div className="text">{this.props.text}</div>
                    {!this.props.isSimulation ?
                        <React.Fragment>
                            <div className="reply">
                                <p>
                                    <i className="far fa-comment-dots"
                                        onClick={this.replyHandler.bind(this)}><b>{this.state.replyText}</b></i>
                                    {this.props.userType === 'MODERATOR' || this.props.userType === 'ROOT' ? <i className="fas fa-exclamation-circle"
                                        onClick={this.alertHandler.bind(this)}><b>{this.state.alertText}</b></i> : null}

                                </p>
                            </div>
                        </React.Fragment>
                        : null
                    }
                    {this.state.showReplyInput || this.state.showAlertInput ?
                        <Input onSendMessage={this.sendMessageHandler.bind(this)} />
                        : null
                    }
                </div>
            </li>
        );
    }
}


const mapStateToProps = state => {
    return {
        userType: state.userType,
    };
};


export default connect(mapStateToProps)(Message);