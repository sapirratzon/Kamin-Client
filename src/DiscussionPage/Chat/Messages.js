import React, {Component} from "react";
import Message from './Message';


class Messages extends Component{
    constructor(props) {
        super(props);
        this.state = {
            branchId: '~'
        }
    }

    updateSelectedBranch = (parentBranchId) => {
        this.setState({
            branchId: parentBranchId
        })
    };

    render() {
        return (
            <ul className="Messages-list" >
                { this.props.messages.map((m) =>
                    <Message
                        key={ m.id } username={ m.author } color={ m.color } text={ m.text }
                        timestamp={ m.timestamp }
                        depth={ m.depth } id={ m.id } isSimulation={ this.props.isSimulation }
                        newCommentHandler={ this.props.newCommentHandler } newAlertHandler={ this.props.newAlertHandler }
                        updateAlertedMessage={ this.props.updateAlertedMessage }
                        updateVisibility={ this.props.updateVisibility }
                        selected={ this.props.selectedMessage === m.id }
                        branchId={ m.branchId }
                        updateSelectedBranch={ this.updateSelectedBranch }
                        parentBranchId={ this.state.branchId }
                    />) }
            </ul >
        );
    }
};

export default Messages;
