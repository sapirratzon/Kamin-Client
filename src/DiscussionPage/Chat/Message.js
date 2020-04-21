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
            alertText: "Alert",
            inputText: "",
            fullyShown: true,
            shownText: "",
            textLengthMessage: "",
            longMessage: false
        };
    }

    componentDidMount() {
        if (this.props.text.length > 500) {
            this.setState({
                longMessage: true,
                fullyShown: false,
                shownText: this.props.text.substring(0, 500),
                textLengthMessage: " Show more"
            });
        } else {
            this.setState({
                fullyShown: true,
                shownText: this.props.text
            });
        }
    };

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
                showAlertInput: false,
                replyText: "Hide",
                alertText: "Alert",
                inputText: "What do you think?"
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
                showReplyInput: false,
                alertText: "Hide",
                replyText: "Reply",
                inputText: "Alert text..."
            });
        }
    };

    sendMessageHandler = (message) => {
        if (message.length === 0) return;
        this.state.showReplyInput ? this.props.newMessageHandler(this.props.id, "Guy", message, this.props.depth + 1) :
            this.props.newAlertHandler(this.props.id, message);
        this.replyHandler();
    };

    getDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    handleMessageDisplayLength = () => {
        this.state.fullyShown ? this.setState({
                fullyShown: false,
                shownText: this.props.text.substring(0, 500),
                textLengthMessage: " Show more"
            })
            : this.setState({
                fullyShown: true,
                shownText: this.props.text,
                textLengthMessage: " Show less"
            });
    };

    render() {
        let depthPixels = this.props.depth * 20;
        let depthString = depthPixels.toString() + "px";
        let verticalLines = [];
        for (let i = 0; i < this.props.depth + 1; i++) {
            verticalLines.push(<div className="vl" key={i} style={{
                "left": ((2 * (i + 1) - depthPixels) + 2) + "px",
            }}/>)
        }
        return (
            <div>
                <li className="Messages-message" style={{"marginLeft": depthString}}>
                    {verticalLines}
                    <div className="Message-content mr-2 ml-2 mt-2">
                        <div className="username mt-1 mb-1">
                            <span
                                className="avatar"
                                style={{
                                    "backgroundColor": this.props.color
                                }}
                            />
                            <span> {this.props.username}{"  "}{this.getDate(this.props.timestamp)} </span>
                        </div>
                        <div className="card-header text">
                            {this.state.shownText}
                            {this.state.longMessage && <b className="text-primary message-buttons"
                                                          onClick={this.handleMessageDisplayLength}> {this.state.textLengthMessage} </b>}

                        </div>
                        {!this.props.isSimulation ?
                            <React.Fragment>
                                <div className="reply">
                                    <p>
                                        <i className="far fa-comment-dots mr-2 message-buttons"
                                           onClick={this.replyHandler}>{this.state.replyText}</i>
                                        {this.props.userType === 'MODERATOR' || this.props.userType === 'ROOT' ?
                                            <i className="far fa-bell message-buttons"
                                               onClick={this.alertHandler}>{this.state.alertText}</i> : null}
                                    </p>
                                </div>
                            </React.Fragment>
                            : null
                        }
                        {this.state.showReplyInput || this.state.showAlertInput ?
                            <Input onSendMessage={this.sendMessageHandler} placeHolder={this.state.inputText}/>
                            : null
                        }
                    </div>
                </li>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        userType: state.userType,
    };
};


export default connect(mapStateToProps)(Message);
