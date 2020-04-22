import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import io from 'socket.io-client';
import { connect } from "react-redux";
import './VisualizationsConfigModal.css'

class VisualizationsModal extends Component {
    constructor() {
        super();
        this.socket = io(process.env.REACT_APP_API);
        this.allSettings= new Map();
        this.state = {
            regularUsers: [],
            error: ''
        }
    }

    componentDidMount() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (response) => {
            const allUsers = JSON.parse(xhr.responseText)['active_users'];
            allUsers.unshift('All');
            this.setState({
                regularUsers: allUsers,
                selectedUser: ''
            });
        });
        xhr.open('GET', process.env.REACT_APP_API + '/api/getActiveDiscussionUsers/' + this.props.discussionId);
        xhr.send();
    }

    updateVisibility = (isOpen) => {
        this.props.updateVisibility(isOpen);
    };

    updateUserVisualizations = (event) => {
        const userConfig = this.allSettings.get(event.target.name);
        const elementToUpdate = event.target.className;
        if (userConfig === undefined)
            this.allSettings.set(event.target.name, {});
        this.allSettings.get(event.target.name)[elementToUpdate] = event.target.checked;
    };

    realTimeUpdateConfig = () => {
        console.log(this.props.lastMessage);
        const configComment = JSON.stringify({
            "author": this.props.currentUser,
            "text": 'Config',
            "parentId": 'targetId',
            "discussionId": this.props.discussionId,
            "depth": 'depth',
            "extra_data": this.allSettings
        });
        this.socket.emit('change_configuration', configComment);
        this.updateVisibility(false);
    };

    simulationUpdateConfig = () => {
        const comment = JSON.stringify({
            "author": this.props.currentUser,
            "text": 'config',
            "parentId": 'targetId',
            "discussionId": this.props.discussionId,
            "depth": 'depth',
            "extra_data": {"Recipients_type": "all", "users_list": {"Guy":{"Graph": true, "Statistics": true, "Alerts": true}}}
        });
        const simData = JSON.stringify({
            "discussionId": this.props.discussionId,
            "Recipients_type": "list",
            "users_list": {"Guy": {"Graph": true, "Statistics": true, "Alerts": true}}
        });
        this.socket.emit('change configuration', simData);

        const configComment = JSON.stringify({
            "author": this.props.currentUser,
            "text": 'Config',
            "parentId": 'targetId',
            "discussionId": this.props.discussionId,
            "depth": '',
            "extra_data": this.allSettings
        });
        this.socket.emit('change_configuration', configComment);
        this.updateVisibility(false);
    };

    render() {
        return (
            <form onSubmit={this.props.isSimulation ? this.simulationUpdateConfig : this.realTimeUpdateConfig}>
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
                                <tr id={this.state.regularUsers[id]} key={this.state.regularUsers[id]}>
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
