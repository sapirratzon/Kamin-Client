import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import io from 'socket.io-client';
import { connect } from "react-redux";
import './VisualizationManagementModal.css'

class VisualizationsModal extends Component {
    constructor() {
        super();
        this.socket = io(process.env.REACT_APP_API);
        this.state = {
            regularUsers: [],
            allSettings: {},
            error: ''
        }
    }

    componentDidMount() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            const allUsers = JSON.parse(xhr.responseText)['users'];
            this.setState({
                regularUsers: allUsers,
                selectedUser: ''
            });
        });
        xhr.open('POST', process.env.REACT_APP_API + '/api/getDiscussionUsers');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({discussionId: this.props.discussionId}));
    }

    updateVisibility = (isOpen) => {
        this.props.updateVisibility(isOpen);
    };

    updateUserVisualizations = (event) => {
        if (this.state.allSettings.keys)
            this.state.allSettings.set(
                event.target.name,
                {
                    showGraph: '',
                    showAlerts: '',
                    showStat: ''
                });
        this.state.allSettings[event.target.username].event.target.className = event.target.checked;
    };

    sendUsersVisualizationsSettings = () => {
        const configComment = JSON.stringify({
            "author": this.props.currentUser,
            "text": 'Config',
            "parentId": 'targetId',
            "discussionId": this.props.discussionId,
            "depth": 'depth'
        });
        this.socket.emit('change_configuration', configComment);

        this.socket.emit('updateUsersVisualizationsSettings', this.state.allSettings);
        this.updateVisibility(false);
    };

    render() {
        return (
            <form onSubmit={this.sendUsersVisualizationsSettings}>
                <Modal className="visualModal align-items-start" visible={this.props.isOpen}>
                    <div className="modal-header">
                        <h5 className="modal-title">Visualization Management</h5>
                    </div>
                    <div className="modal-body">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>username</th>
                                <th>Graph</th>
                                <th>Statistics</th>
                                <th>Alerts</th>
                                <th/>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.keys(this.state.regularUsers).map((id) =>
                                <tr id={this.state.regularUsers[id]}>
                                    <td>{this.state.regularUsers[id]}</td>
                                    <td className="showGraph1">
                                        <input name={this.state.regularUsers[id]} type="checkbox"
                                               id={this.state.regularUsers[id] + " showGraph"}
                                               className="showGraph"
                                               onChange={(event) => this.updateUserVisualizations(event)}
                                        />
                                        <label htmlFor={this.state.regularUsers[id] + " showGraph"}/>
                                    </td>
                                    <td className="showStat1">
                                        <input name={this.state.regularUsers[id]} type="checkbox"
                                               id={this.state.regularUsers[id] + " showStat"}
                                               className="showStat"
                                               onChange={(event) => this.updateUserVisualizations(event)}
                                        />
                                        <label htmlFor={this.state.regularUsers[id] + " showStat"}/>
                                    </td>
                                    <td className="showAlerts1">
                                        <input name={this.state.regularUsers[id]} type="checkbox"
                                               id={this.state.regularUsers[id] + " showAlerts"}
                                               className="showAlerts"
                                               onChange={(event) => this.updateUserVisualizations(event)}
                                        />
                                        <label htmlFor={this.state.regularUsers[id] + " showAlerts"}/>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-grey"
                                onClick={() => this.updateVisibility(false)}>Cancel
                        </button>
                        <button className="btn btn-info">OK</button>
                    </div>
                </Modal>
            </form>
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

export default connect(mapStateToProps)(VisualizationsModal);
