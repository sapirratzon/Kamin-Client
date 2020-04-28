import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import { connect } from "react-redux";
import './VisualizationsConfigModal.css'

class VisualizationsModal extends Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.allSettings = {};
        this.state = {
            configType: '',
            activeUsers: {},
            error: ''
        }
    }

    componentDidMount() {
        this.socket.on("user joined", (response) => {
            this.loadActiveUsers();
        })
    }

    loadActiveUsers() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (response) => {
            const allUsers = {'all': {showGraph: this.props.defaultConfig['Graph'],
                    showAlerts: this.props.defaultConfig['Alerts'],
                    showStat: this.props.defaultConfig['statistics']},
                ...JSON.parse(xhr.responseText)['config']};
            this.setState({
                activeUsers: allUsers
            });
        });
        xhr.open('GET', process.env.REACT_APP_API + '/api/getActiveUsersConfigurations/' + this.props.discussionId);
        xhr.send();
    }

    updateVisibility = (isOpen) => {
        this.props.updateVisibility(isOpen);
    };

    updateUserVisualizations = (event) => {
        const username = this.allSettings[event.target.name];
        const elementToUpdate = event.target.className;
        if (event.target.name === 'all')
            this.handleConfigAll(event);
        else if (username === undefined) {
            if (this.allSettings['all'] !== undefined) {
                this.allSettings[event.target.name] = {};
                this.handleConfigAll(event);
            }
            else {
                this.allSettings[event.target.name] = {
                    showGraph: this.state.activeUsers[event.target.name]['graph'],
                    showAlerts: this.state.activeUsers[event.target.name]['alerts'],
                    showStat: this.state.activeUsers[event.target.name]['statistics'],
                };
                this.allSettings[event.target.name][elementToUpdate] = event.target.checked;
                let activeUsersSettings = this.state.activeUsers;
                activeUsersSettings[event.target.name][elementToUpdate] = event.target.checked;
                this.setState({
                    activeUsers: activeUsersSettings
                });
            }
        }
    };

    handleConfigAll = (event) => {
        if (Object.keys(this.allSettings).length > 1) {
            Object.keys(this.state.activeUsers).forEach(user => {
                if (this.allSettings[user] === undefined || this.allSettings[user] === {})
                    this.allSettings[user] = this.state.activeUsers[user];
                this.allSettings[user][event.target.className] = event.target.checked;
                let activeUsersSettings = this.state.activeUsers;
                activeUsersSettings[event.target.name][event.target.className] = event.target.checked;
                this.setState({
                    activeUsers: activeUsersSettings
                });
            });
        }
        else {
            if (this.allSettings['all'] === undefined)
                this.allSettings['all'] = {};
            this.allSettings['all'][event.target.className] = event.target.checked;
            let activeUsersSettings = this.state.activeUsers;
            activeUsersSettings[event.target.name][event.target.className] = event.target.checked;
            this.setState({
                activeUsers: activeUsersSettings
            });
        }
    };

    updateConfig = () => {
        if (Object.keys(this.allSettings).length > 0) {
            let type = 'all';
            if (this.allSettings['all'] === undefined || Object.keys(this.allSettings).length > 1)
                type = 'list';
            const configComment = {
                'discussionId': this.props.discussionId,
                'extra_data': { recipients_type: type, users_list: this.allSettings }
            };
            if (!this.props.isSimulation){
                Object.assign(configComment, {'author': this.props.currentUser,
                    'text': 'config',
                    'parentId': this.props.lastMessage.parentId,
                    'depth': this.props.lastMessage.depth})
            }
            console.log(configComment);
            // this.socket.emit('change configuration', JSON.stringify(configComment));
        }
        this.updateVisibility(false);
    };

    render() {
        return (
                <Modal className="visualModal align-items-start" visible={this.props.isOpen}>
                    <div className="modal-header">
                        <h5 className="modal-title">Visualization Management</h5>
                    </div>
                    <div className="modal-body">
                        {this.state.activeUsers.length < 0 ?
                        <p> There are no users in the discussion </p> :
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>username</th>
                                    <th>Graph</th>
                                    <th>Statistics</th>
                                    <th>Alerts</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(this.state.activeUsers).map((id) =>
                                    <tr id={id} key={id}>
                                        <td>{id}</td>
                                        <td className="graph">
                                            <input name={id} type="checkbox"
                                                id={id + " showGraph"}
                                                className="showGraph"
                                                   defaultChecked={this.state.activeUsers[id]['showGraph']}
                                                onChange={(event) => this.updateUserVisualizations(event)}
                                            />
                                            <label htmlFor={id + " showGraph"} />
                                        </td>
                                        <td className="Statistics">
                                            <input name={id} type="checkbox"
                                                id={id + " showStat"}
                                                className="showStat"
                                                   defaultChecked={this.state.activeUsers[id]['showStat']}
                                                onChange={(event) => this.updateUserVisualizations(event)}
                                            />
                                            <label htmlFor={id + " showStat"} />
                                        </td>
                                        <td className="alerts">
                                            <input name={id} type="checkbox"
                                                id={id + " showAlerts"}
                                                className="showAlerts"
                                                   defaultChecked={this.state.activeUsers[id]['showAlerts']}
                                                onChange={(event) => this.updateUserVisualizations(event)}
                                            />
                                            <label htmlFor={id + " showAlerts"} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-grey"
                            onClick={() => this.updateVisibility(false)}>Cancel
                        </button>
                        <button className="btn btn-info" onClick={this.updateConfig}>OK</button>
                    </div>
                </Modal>
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
