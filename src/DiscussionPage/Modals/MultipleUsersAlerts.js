import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import { connect } from "react-redux";
import './MultipleUsersAlerts.css'

class MultipleUsersAlerts extends Component {
    constructor(props) {
        super(props);
        this.socket = this.props.socket;
        this.activeUsers = {};
        this.state = {
            activeUsers: {},
            alertedUsers: {},
            alertedAll: false,
            userAlerted: false,
            error: ''
        }
    }

    componentDidMount() {
        this.socket.on("new user", (response) => {
            const allUsers = response;
            this.activeUsers = {'all': false};
            Object.keys(allUsers).forEach(user => {
                this.activeUsers[allUsers[user]]= false;
            });
            // this.setState({
            //     activeUsers: activeUsers,
            // });
            console.log(this.activeUsers);
            // this.loadActiveUsers();
        })
    }

    loadActiveUsers() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            const allUsers = JSON.parse(xhr.responseText)['active_users'];
            let activeUsers = {'all': false};
            Object.keys(allUsers).forEach(user => {
                activeUsers[allUsers[user]]= false;
            });
            this.setState({
                activeUsers: activeUsers,
            });

        });
        xhr.open('GET', process.env.REACT_APP_API + '/api/getActiveDiscussionUsers/' + this.props.discussionId);
        xhr.send();
    }

    updateVisibility = (isOpen) => {
        this.props.updateVisibility(isOpen);
        this.setState({
            userAlerted: false,
            alertedAll: false
        })
    };

    handleWriteAlert = (event) => {
        const alertText = event.target.value;
        this.setState({
            error: '',
            alert: alertText
        });
    };

    updateIsUserAlerted = (event) => {
        // let allUsers = this.state.activeUsers;
        let allUsers = this.activeUsers;
        if (event.target.name === 'all') {
            Object.keys(allUsers).forEach(user => {
                allUsers[user] = event.target.checked;
            });
            this.setState({
                activeUsers: allUsers,
                alertedAll: true
            });
        } else {
            allUsers[event.target.name] = event.target.checked;
            if (!event.target.checked) {
                allUsers['all'] = event.target.checked;
                this.setState({
                    activeUsers: allUsers
                });
            }
            this.setState({
                userAlerted: true
            });
        }
    };

    sendAlert = () => {
        if (! (this.state.userAlerted || this.state.alertedAll) && this.state.alert.length === 0){
            this.setState({
                error: 'Description is required'
            })
        }
        let type = '';
        let alertComment = {};
        if (this.state.userAlerted) {
            type = 'list';
            let usersListSettings = {};
            for (let [user, config] of Object.entries(this.state.activeUsers)) {
                if (user !== 'all') {
                    usersListSettings[user] = config
                }
            }
            alertComment = {
                'extra_data': { recipients_type: type, users_list: usersListSettings }
            };
        } else if (this.state.alertedAll) {
            type = 'all';
            let allSettings = { all: this.state.activeUsers['all'] };
            alertComment = {
                'extra_data': { recipients_type: type, users_list: allSettings }
            };
        }
        Object.assign(alertComment, {
            'discussionId': this.props.discussionId,
            'author': this.props.currentUser,
            'text': this.state.alertText,
            'parentId': this.props.lastMessage.parentId,
            'depth': this.props.lastMessage.depth
        });
        if (this.state.userAlerted || this.state.alertedAll) {
            this.socket.emit('add alert', JSON.stringify(alertComment));
        }
        this.updateVisibility(false);
    };

    render() {
        return (
            <Modal className="multipleUsersAlertsModal align-items-start" visible={this.props.isOpen} >
                <div className="modal-header" >
                    <h5 className="modal-title" >Send Alert</h5 >
                </div >
                <div className="modal-body modal-body-alerts" >
                    <p><b> Choose Users: </b></p>
                        <table className="table-alerts w-50" >
                            <tbody >
                            {Object.keys(this.activeUsers).map((id) =>
                                <tr id={id} key={id} >
                                    <td >
                                        <input
                                            name={id} type="checkbox"
                                            id={id + " alert"}
                                            className="alertUser"
                                            checked={this.activeUsers[id]}
                                            onChange={(event) => this.updateIsUserAlerted(event)}
                                        />
                                        <label htmlFor={id + " alert"} />
                                    </td >
                                    <td >{id}</td >
                                </tr >
                            )}
                            </tbody >
                        </table >
                    <div >
                        <p className="pt-3"><b> And write you Alert here: </b></p>
                        <textarea
                            className="description-input" name="description" value={ this.state.alertText }
                            placeholder={ "Write Something" } onChange={this.handleWriteAlert.bind(this) }
                        />
                        <div className="help-block text-danger" >{this.state.error}</div >
                    </div >
                </div >
                <div className="modal-footer" >
                    <button
                        type="button" className="btn btn-grey"
                        onClick={() => this.updateVisibility(false)} >Cancel
                    </button >
                    <button className="btn btn-info" onClick={this.sendAlert} >Send</button >
                </div >
            </Modal >
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        token: state.token,
        userType: state.userType
    };
};

export default connect(mapStateToProps)(MultipleUsersAlerts);
