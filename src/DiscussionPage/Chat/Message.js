import React, { Component } from "react";
import { connect } from 'react-redux'
import { Editor } from '@tinymce/tinymce-react';

class Message extends Component {


    constructor(props) {
        super(props);
        this.state = {
            showReplyInput: false,
            replyText: "Reply",
            inputText: "",
            fullyShown: true,
            shownText: "",
            textLengthMessage: "",
            longMessage: false,
            inputContent: ''
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
        this.setState(prevState => ({
            showReplyInput: !prevState.showReplyInput,
            replyText: prevState.replyText === 'Reply' ? 'Hide' : 'Reply'
        }));
    };

    alertsModalHandler = () => {
        this.props.updateAlertedMessage({ id: this.props.id, depth: this.props.depth + 1 });
        this.props.updateVisibility(true);
    };

    sendMessageHandler = () => {
        if (this.state.inputContent.length === 0) return;
        this.props.newCommentHandler(this.props.id, this.state.inputContent, this.props.depth + 1);
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


    getDirection = () => {
        return this.props.language === "English" ? 'ltr' : 'rtl';
    }

    handleEditorChange = (content, editor) => {
        this.setState({ inputContent: content });
    };

    render() {
        let depthPixels = this.props.depth * 20;
        let depthString = depthPixels.toString() + "px";
        let verticalLines = [];

        for (let i = 0; i < this.props.depth + 1; i++) {
            verticalLines.push(<div
                className="vl" key={i} style={{
                    "left": ((20 * (i + 1) - depthPixels) + 3) + "px",
                }} />)
        }

        return (
            <React.Fragment >
                <li className="Messages-message" style={{ "marginLeft": depthString, "direction": this.getDirection }} >
                    {verticalLines}
                    <a onClick={() => this.props.collapseNode(this.props.branchId)}> <span
                        className="avatar"
                        style={{
                            "backgroundColor": this.props.color,
                        }}
                    /></a >
                    <div className={(this.props.selected ? 'border-warning ' : '') + "card Message-content cursor-pointer" + this.props.directionClass} >
                        <div className="card-header p-1 username leftToRight" >
                            {this.props.username}{"  "}{this.getDate(this.props.timestamp)}
                        </div >
                        <div className={"mr-1 ml-1 cursor-pointer " + this.props.directionClass} >
                            < div dangerouslySetInnerHTML={{ __html: this.state.shownText }} />
                            {this.state.longMessage && <b className="text-primary message-buttons" onClick={this.handleMessageDisplayLength}> {this.state.textLengthMessage} </b >}
                        </div >
                        {!this.props.isSimulation &&
                            <React.Fragment >
                                <div className={"reply cursor-pointer " + (this.props.directionClass === "leftToRight" ? "ml-1" : "mr-1")} >
                                    <i
                                        className="far fa-comment-dots mr-2 mb-2 message-buttons"
                                        onClick={this.replyHandler} >{this.state.replyText}</i >
                                    {this.props.userType !== 'USER' ?
                                        <i
                                            className={"far fa-bell message-buttons " + (this.props.directionClass === "leftToRight" ? "ml-1" : "mr-1")}
                                            onClick={this.alertsModalHandler} >Alert</i > : null}
                                </div >
                            </React.Fragment >
                        }
                        <div>{(!this.props.isSimulation && this.props.showMoreMessages) && <b><i className="ml-2 cursor-pointer message-buttons text-muted"
                            onClick={() => this.props.collapseNode(this.props.branchId)}>Show collapsed messages</i></b>}</div>
                    </div >
                </li >
                <div className="mx-auto input mt-2">
                    {(this.state.showReplyInput) &&
                        <React.Fragment>
                            <Editor
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar:
                                        'undo redo | formatselect | bold italic backcolor | \
                                        alignleft aligncenter alignright alignjustify | \
                                        bullist numlist outdent indent | removeformat | help',
                                    directionality: (this.directionClass === "leftToRight" ? 'ltr' : 'rtl')

                                }}
                                onEditorChange={this.handleEditorChange}
                            />
                            <button
                                type="button" className={"btn btn-outline-primary waves-effect btn-sm " + this.directionClass}
                                onClick={this.sendMessageHandler} >Send
                            </button >
                        </React.Fragment>
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

const mapDispatchToProps = (dispatch) => {
    return {
        collapseNode: (nodeBranch) => dispatch({ type: 'COLLAPSE_NODE', payload: { node: nodeBranch } })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);
