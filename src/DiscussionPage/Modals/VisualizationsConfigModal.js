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
        this.setState({
            activeUsers: {'all': {showGraph: true, showAlerts: true, showStat: true}}
        });
        this.socket.on("user joined", (response) => {
            this.loadActiveUsers();
        })
    }

    loadActiveUsers() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (response) => {
            const allUsers = {'all': {alerts: true, graph: true, statistics: true} , ...JSON.parse(xhr.responseText)['config']};
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
                //TODO: use setState instead of direct assignment to state
                this.allSettings[event.target.name] = {
                    showGraph: this.state.activeUsers[event.target.name]['showGraph'],
                    showAlerts: this.state.activeUsers[event.target.name]['showAlerts'],
                    showStat: this.state.activeUsers[event.target.name]['showStat'],
                };
                this.allSettings[event.target.name][elementToUpdate] = event.target.checked;
                this.state.activeUsers[event.target.name][elementToUpdate] = event.target.checked;
            }
        }
    };

    handleConfigAll = (event) => {
        if (Object.keys(this.allSettings).length > 1) {
            this.state.activeUsers.forEach(user => {
                if (this.allSettings[user] === undefined || this.allSettings[user] === {})
                    this.allSettings[user] = this.state.activeUsers[user];
                this.allSettings[user][event.target.className] = event.target.checked;
                this.state.activeUsers[event.target.name][event.target.className] = event.target.checked;
            });
        }
        else {
            if (this.allSettings['all'] === undefined)
                this.allSettings['all'] = {};
            this.allSettings['all'][event.target.className] = event.target.checked;
            this.state.activeUsers[event.target.name][event.target.className] = event.target.checked;
        }
    };

    updateConfig = () => {
        if (this.state.activeUsers.length > 0) {
            let type = 'all';
            if (this.allSettings['all'] === undefined || Object.keys(this.allSettings).length > 1)
                type = 'list';
            const configComment = JSON.stringify({
                'author': this.props.currentUser,
                'text': 'config',
                'parentId': this.props.lastMessage.parentId,
                'depth': this.props.lastMessage.depth,
                'discussionId': this.props.discussionId,
                'extra_data': { recipients_type: type, users_list: this.allSettings }
            });
            this.socket.emit('change configuration', configComment);
        }
        this.updateVisibility(false);
    };

    render() {
        return (
            <form onSubmit={this.updateConfig}>
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
                                        <td className="showGraph1">
                                            <input name={id} type="checkbox"
                                                id={id + " showGraph"}
                                                className="showGraph"
                                                   // checked={this.state.activeUsers[id]['graph']}
                                                onChange={(event) => this.updateUserVisualizations(event)}
                                            />
                                            <label htmlFor={id + " showGraph"} />
                                        </td>
                                        <td className="showStat1">
                                            <input name={id} type="checkbox"
                                                   // checked={this.state.activeUsers[id]['statistics']}
                                                id={id + " showStat"}
                                                className="showStat"
                                                onChange={(event) => this.updateUserVisualizations(event)}
                                            />
                                            <label htmlFor={id + " showStat"} />
                                        </td>
                                        <td className="showAlerts1">
                                            <input name={id} type="checkbox"
                                                   // checked={this.state.activeUsers[id]['alerts']}
                                                id={id + " showAlerts"}
                                                className="showAlerts"
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
