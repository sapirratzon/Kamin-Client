import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import { connect } from "react-redux";
import './MultipleUsersAlerts.css'

class MultipleUsersAlerts extends Component {
    constructor(props) {
        super(props);
        this.socket = this.props.socket;
        this.activeUsers = {};
        this.noUsers= '';
        this.state = {
            alertedUsers: {},
            alertedAll: false,
            userAlerted: false,
            alertText: '',
            error: ''
        }
    }

    componentDidMount() {
        this.socket.on("new user", (response) => {
            const allUsers = response;
            if (Object.keys(allUsers).length > 0) {
                this.noUsers = 'Choose Users:';
                this.activeUsers = {'all': false};
                Object.keys(allUsers).forEach(user => {
                    this.activeUsers[allUsers[user]]= false;
                });
            }
            else {
                this.noUsers = 'There are no users in discussion';
            }
        })
    }

    updateVisibility = (isOpen) => {
        this.props.updateVisibility(isOpen);
        this.setState({ error: ''});
        this.setState({
            userAlerted: false,
            alertedAll: false,
        })
    };

    handleWriteAlert = (event) => {
        const alertText = event.target.value;
        this.setState({ error: ''});
        this.setState({
            alertText: alertText
        });
    };

    updateIsUserAlerted = (event) => {
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

    validateFields = () => {
        if (! (this.state.userAlerted || this.state.alertedAll)){
            this.setState({
                error: 'You must select users from the list.'
            });
            return false;
        }
        if (this.state.alertText.length === 0) {
            this.setState({
                error: 'Alert is required'
            });
            return false;
        }
        return true;
    };

    sendAlert = () => {
        if (!this.validateFields()) return;
        let type = '';
        let alertComment = {};
        if (this.state.userAlerted) {
            type = 'list';
            let usersListSettings = {};
            for (let [user, toAlert] of Object.entries(this.activeUsers)) {
                if (user !== 'all' && toAlert === true) {
                    usersListSettings[user] = toAlert
                }
            }
            alertComment = {
                'extra_data': { recipients_type: type, users_list: usersListSettings }
            };
        } else if (this.state.alertedAll) {
            type = 'all';
            let allSettings = { all: this.activeUsers['all'] };
            alertComment = {
                'extra_data': { recipients_type: type, users_list: allSettings }
            };
        }
        Object.assign(alertComment, {
            'discussionId': this.props.discussionId,
            'author': this.props.currentUser,
            'text': this.state.alertText,
            'parentId': this.props.lastMessage.id,
            'depth': this.props.lastMessage.depth
        });
        if (this.state.userAlerted || this.state.alertedAll) {
            this.socket.emit('add alert', JSON.stringify(alertComment));
        }
        this.setState({
            alertText: ''
        });
        Object.keys(this.activeUsers).map(user => this.activeUsers[user] = false);
        this.updateVisibility(false);
    };

    render() {
        return (
            <Modal className="multipleUsersAlertsModal align-items-start" visible={this.props.isOpen} >
                <div className="modal-header" >
                    <h5 className="modal-title" >Send Alert</h5 >
                </div >
                <div className="modal-body modal-body-alerts" >
                    <p><b> {this.noUsers} </b></p>
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
