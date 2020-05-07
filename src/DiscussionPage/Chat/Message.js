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

    alertsModalHandler = () => {
        this.props.updateAlertedMessage({id: this.props.id, depth: this.props.depth + 1});
        this.props.updateVisibility(true);
    };

    sendMessageHandler = (message) => {
        if (message.length === 0) return;
        if (this.state.showReplyInput) {
            this.props.newCommentHandler(this.props.id, message, this.props.depth + 1);
            this.replyHandler();
        } else {
            this.props.newAlertHandler(this.props.id, message, this.props.depth + 1, this.props.username);
            this.alertHandler();
        }
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
            verticalLines.push(<div
                className="vl" key={ i } style={ {
                "left": ((20 * (i + 1) - depthPixels) + 3) + "px",
            } } />)
        }
        return (
            <React.Fragment >
                <li className="Messages-message" style={ {"marginLeft": depthString} } >
                    { verticalLines }
                    <a href="#messageCollapse" data-toggle="collapse" > <span
                        className="avatar"
                        style={ {
                            "backgroundColor": this.props.color,
                        } }
                    /></a >
                    <div id="messageCollapse" className="show collapse card Message-content" >
                        <div className="card-header p-1 username" >
                            { this.props.username }{ "  " }{ this.getDate(this.props.timestamp) }
                        </div >
                        <div className="text ml-2" >
                            { this.state.shownText }
                            { this.state.longMessage && <b
                                className="text-primary message-buttons"
                                onClick={ this.handleMessageDisplayLength } > { this.state.textLengthMessage } </b > }
                        </div >
                        { !this.props.isSimulation ?
                            <React.Fragment >
                                <div className="reply ml-2" >
                                    <i
                                        className="far fa-comment-dots mr-2 mb-2 message-buttons"
                                        onClick={ this.replyHandler } >{ this.state.replyText }</i >
                                    { this.props.userType !== 'USER' ?
                                            <i className="far fa-bell message-buttons"
                                                onClick={ this.alertsModalHandler } >Alert</i >
                                        : null }
                                </div >
                            </React.Fragment >
                            : null
                        }

                        { this.props.depth === 0 }
                    </div >
                </li >
                <div >
                    { this.state.showReplyInput || this.state.showAlertInput ?
                        <Input
                            depth={ depthString } onSendMessage={ this.sendMessageHandler }
                            placeHolder={ this.state.inputText } />
                        : null
                    }
                </div >
            </React.Fragment >
        );
    }
}


const mapStateToProps = state => {
    return {
        userType: state.userType,
    };
};


export default connect(mapStateToProps)(Message);
