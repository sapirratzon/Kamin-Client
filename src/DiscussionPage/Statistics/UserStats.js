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
                    <table className="mx-auto table-sm table-striped h-100" >
                        < tbody>
                            <tr className="row xs-2" >
                                <th className="col-8" >Comments Written:</th >
                                <th className="col " >{this.state.commentsWritten}</th >
                            </tr >
                            <tr className="row xs-2" >
                                <th className="col-8" >Responded Users:</th >
                                <th className="col" >{this.state.usersResponded}</th >
                            </tr >
                            <tr className="row xs-2" >
                                <th className="col-8" >Comments Received:</th >
                                <th className="col" >{this.state.commentsReceived}</th >
                            </tr >
                            <tr className="row xs-2" >
                                <th className="col-8" >Users Replied:</th >
                                <th className="col" >{this.state.repliedUsers}</th >
                            </tr >
                            <tr className="row xs-2" >
                                <th className="col-8" >Words Written:</th >
                                <th className="col" >{this.state.wordsWritten}</th >
                            </tr >
                        </ tbody>
                    </table >
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
