import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import { connect } from "react-redux";
import './VisualizationsConfigModal.css'

class VisualizationsModal extends Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
            configType: '',
            activeUsers: {},
            updateAll: false,
            updateUser: false,
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
        xhr.addEventListener('load', () => {
            const configuration = JSON.parse(xhr.responseText)['config'];
            const allUsersConfiguration = {};
            allUsersConfiguration['all'] = {
                graph: this.props.defaultConfig['graph'],
                alerts: this.props.defaultConfig['alerts'],
                statistics: this.props.defaultConfig['statistics']
            };
            Object.keys(configuration).forEach(user => {
                allUsersConfiguration[user] = {
                    graph: configuration[user]['graph'],
                    alerts: configuration[user]['alerts'],
                    statistics: configuration[user]['statistics']
                }
            });
            this.setState({
                activeUsers: allUsersConfiguration,
            });

        });
        xhr.open('GET', process.env.REACT_APP_API + '/api/getActiveUsersConfigurations/' + this.props.discussionId);
        xhr.send();
    }

    updateVisibility = (isOpen) => {
        this.props.updateVisibility(isOpen);
        this.setState({
            updateAll: false,
            updateUser: false
        })
    };

    updateUserVisualizations = (event, type) => {
        if (event.target.name === 'all') {
            Object.keys(this.state.activeUsers).forEach(user => {
                this.updateConfigInState(event, user, type);
            });
            this.setState({
                updateAll: true
            });
        } else {
            if (!event.target.checked) {
                let allSettings = this.state.activeUsers;
                allSettings['all'][type] = event.target.checked;
                this.setState({
                    activeUsers: allSettings
                });
            }
            this.updateConfigInState(event, event.target.name, type);
            this.setState({
                updateUser: true
            });
        }
    };

    updateConfigInState = (event, username, type) => {
        let allSettings = this.state.activeUsers;
        allSettings[username][type] = event.target.checked;
        this.setState({
            activeUsers: allSettings
        });
        let elementToUpdate = type;
        let value = event.target.checked;
        this.setState(prevState => {
            let activeUsersSettings = Object.assign({ [username]: { [elementToUpdate]: value } }, prevState.activeUsers);
            activeUsersSettings[username][elementToUpdate] = value;
            return { activeUsersSettings };
        });
    };

    updateConfig = () => {
        let type = '';
        let configComment = {};
        if (this.state.updateUser) {
            type = 'list';
            let usersListSettings = {};
            for (let [user, config] of Object.entries(this.state.activeUsers)) {
                if (user !== 'all') {
                    usersListSettings[user] = config
                }
            }
            configComment = {
                'discussionId': this.props.discussionId,
                'extra_data': { recipients_type: type, users_list: usersListSettings }
            };
        } else if (this.state.updateAll) {
            type = 'all';
            let allSettings = { all: this.state.activeUsers['all'] };
            configComment = {
                'discussionId': this.props.discussionId,
                'extra_data': { recipients_type: type, users_list: allSettings }
            };
        }
        if (!this.props.isSimulation) {
            Object.assign(configComment, {
                'author': this.props.currentUser,
                'text': 'config',
                'parentId': this.props.lastMessage.parentId,
                'depth': this.props.lastMessage.depth
            })
        }
        if (this.state.updateUser || this.state.updateAll) {
            this.socket.emit('change configuration', JSON.stringify(configComment));
        }
        this.updateVisibility(false);
    };

    render() {
        return (
            <Modal className="visualModal align-items-start" visible={this.props.isOpen} >
                <div className="modal-header" >
                    <h5 className="modal-title" >Visualization Management</h5 >
                </div >
                <div className="modal-body" >
                    {this.state.activeUsers.length < 0 ?
                        <p > There are no users in the discussion </p > :
                        <table className="table" >
                            <thead >
                                <tr >
                                    <th >username</th >
                                    <th >Graph</th >
                                    <th >Statistics</th >
                                    <th >Alerts</th >
                                    <th />
                                </tr >
                            </thead >
                            <tbody >
                                {Object.keys(this.state.activeUsers).map((id) =>
                                    <tr id={id} key={id} >
                                        <td >{id}</td >
                                        <td >
                                            <input
                                                name={id} type="checkbox"
                                                id={id + " graph"}
                                                className="visModalGraph"
                                                checked={this.state.activeUsers[id]['graph']}
                                                onChange={(event) => this.updateUserVisualizations(event, 'graph')}
                                            />
                                            <label htmlFor={id + " graph"} />
                                        </td >
                                        <td  >
                                            <input
                                                name={id} type="checkbox"
                                                id={id + " statistics"}
                                                className="visModalStats"
                                                checked={this.state.activeUsers[id]['statistics']}
                                                onChange={(event) => this.updateUserVisualizations(event, 'statistics')}
                                            />
                                            <label htmlFor={id + " statistics"} />
                                        </td >
                                        <td >
                                            <input
                                                name={id} type="checkbox"
                                                id={id + " alerts"}
                                                className="visModalAlerts"
                                                checked={this.state.activeUsers[id]['alerts']}
                                                onChange={(event) => this.updateUserVisualizations(event, 'alerts')}
                                            />
                                            <label htmlFor={id + " alerts"} />
                                        </td >
                                    </tr >
                                )}
                            </tbody >
                        </table >
                    }
                </div >
                <div className="modal-footer" >
                    <button
                        type="button" className="btn btn-grey"
                        onClick={() => this.updateVisibility(false)} >Cancel
                    </button >
                    <button className="btn btn-info" onClick={this.updateConfig} >OK</button >
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

export default connect(mapStateToProps)(VisualizationsModal);