import React, { Component } from 'react';
import { connect } from 'react-redux';

class DiscussionStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            participants: 0,
            comments: 0,
            repliedMost: "",
            receivedMost: ""
        }
    }
    componentDidMount() {
        this.calcDiscussionStats();
    }

    UNSAFE_componentWillReceiveProps() {
        this.calcDiscussionStats();
    }

    calcDiscussionStats() {
        let nodes = this.props.getShownNodes();
        if (nodes.length === 0) return;
        nodes.sort(function (a, b) { return b.comments - a.comments; });
        let maxComments = nodes[0].id;
        nodes.sort(function (a, b) { return b.commentsReceived - a.commentsReceived; });
        let maxReceivedComments = nodes[0].id;
        this.setState({
            participants: this.props.getShownNodes().length,
            comments: this.props.getShownMessages().length,
            repliedMost: maxComments,
            receivedMost: maxReceivedComments
        });
    }

    render() {
        return (
            <div className="card card-stats small-font" >
                <div className="card-header p-1" >
                    <h4 className="Card-title" >Discussion Statistics</h4 >
                </div >
                <div className="card-body p-1" >
                    <table className="mx-auto table-sm table-striped h-100" >
                        < tbody>
                            <tr className="row xs-2" >
                                <th className="col-8" >Participants:</th >
                                <th className="col" >{this.state.participants}</th  >
                            </tr >
                            <tr className="row xs-2" >
                                <th className="col-8" >Comments:</th >
                                <th className="col" >{this.state.comments}</th >
                            </tr >
                            <tr className="row xs-2" >
                                <th className="col-8" >Replied Most Comments:</th >
                                <th className="col" >{this.state.repliedMost}</th >
                            </tr >
                            <tr className="row xs-2" >
                                <th className="col-8" >Received Most Comments:</th >
                                <th className="col" >{this.state.receivedMost}</th >
                            </tr >
                        </tbody>
                    </table >
                </div >
            </div >
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogOut: () => dispatch({ type: 'LOGOUT' })
    };
};

export default connect(null, mapDispatchToProps)(DiscussionStats);
