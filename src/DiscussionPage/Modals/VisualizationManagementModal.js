import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import io from 'socket.io-client';
import { connect } from "react-redux";

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

    updateUserVisualizations = (username) => {
        console.log(username);
        console.log(username.target);

        this.state.allSettings.set(
            username,
            {
                graph: '',
                alerts: '',
                stat: ''
            });
    };

    sendUsersVisualizationsSettings = () => {
        this.socket.emit('updateUsersVisualizationsSettings', this.state.allSettings);
        this.updateVisibility(false);
    };

    handlePresentGraph = (event) => {
        this.setState({
            presentGraph: event.target.checked
        })
    };

    handlePresentAlerts = (event) => {
        this.setState({
            presentAlerts: event.target.checked
        })
    };

    handlePresentStat = (event) => {
        this.setState({
            presentStat: event.target.checked
        })
    };

    handleUpdatedUser = (event) => {
        console.log(event);
        console.log(event.target);
        console.log(event.target.elements);
        // this.setState({
        //     selectedUser: event.target.value,
        //     error: ''
        // })
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
                                // <form onSubmit={event => this.handleUpdatedUser(event)}>
                                    <tr id={this.state.regularUsers[id]}>
                                        <td>{this.state.regularUsers[id]}</td>
                                        <td className="showGraph">
                                            <div className="form-check">
                                            <input type="checkbox" className="form-check-input"
                                                   id="materialUnchecked"/></div></td>
                                        <td className="showStat"><i className="fa fa-refresh cursor-pointer"/></td>
                                        <td className="showAlerts"><i className="fa fa-refresh cursor-pointer"/></td>
                                        <td>
                                            <button type="button" className="btn btn-grey btn-xs m-0 p-1">Update
                                            </button>
                                        </td>
                                    </tr>
                                // </form>
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
