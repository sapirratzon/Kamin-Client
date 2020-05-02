import React, { Component } from 'react';
import { connect } from 'react-redux'


class UserStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUser: null,
            commentsWritten: 0,
            usersResponded: 0,
            commentsReceived: 0,
            repliedUsers: 0,
            wordsWritten: 0,
        }
    }

    UNSAFE_componentWillReceiveProps() {
        this.calcUserStats();
    }

    calcUserStats() {
        let commentsWritten = 0;
        let wordsNumber = 0;
        let usersResponded = 0;
        let commentsReceived = 0;
        let repliedUsers = 0;
        let selectedUser = this.props.getSelectedUser();
        this.props.getShownLinks().forEach(link => {
            if (link.source.id === selectedUser) {
                usersResponded++;
            }
            if (link.target.id === selectedUser) {
                repliedUsers++;
                commentsReceived += link.name;
            }
        });
        this.props.getShownMessages().forEach(message => {
            if (message.author === selectedUser) {
                commentsWritten++;
                wordsNumber += message.text.split(' ').length;
            }
        });
        this.setState({
            selectedUser: selectedUser,
            commentsWritten: commentsWritten,
            usersResponded: usersResponded,
            commentsReceived: commentsReceived,
            repliedUsers: repliedUsers,
            wordsWritten: wordsNumber
        });
    };

    render() {
        return (
            <div className="card card-stats small-font" >
                <div className="card-header p-1" >
                    {this.props.allowHide ? <h4 className="Card-title" ><a href="#presentStat" data-toggle="collapse" onClick={this.props.handleHide}>
                        <i className="fa fa-angle-down" /></a>Statistics of {this.state.selectedUser} </h4 >
                        :
                        <h4 className="Card-title" > Statistics of {this.state.selectedUser} </h4 >
                    }
                </div >
                <div className="card-body p-1" >
                    <div className="container" >
                        <div className="row xs-2" >
                            <div className="col-8" >Comments Written:</div >
                            <div className="col" >{this.state.commentsWritten}</div >
                        </div >
                        <div className="row xs-2" >
                            <div className="col-8" >Responded Users:</div >
                            <div className="col" >{this.state.usersResponded}</div >
                        </div >
                        <div className="row xs-2" >
                            <div className="col-8" >Comments Received:</div >
                            <div className="col" >{this.state.commentsReceived}</div >
                        </div >
                        <div className="row xs-2" >
                            <div className="col-8" >Users Replied:</div >
                            <div className="col" >{this.state.repliedUsers}</div >
                        </div >
                        <div className="row xs-2" >
                            <div className="col-8" >Words Written:</div >
                            <div className="col" >{this.state.wordsWritten}</div >
                        </div >
                    </div >
                </div >
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        userType: state.userType
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogOut: () => dispatch({ type: 'LOGOUT' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserStats);
