import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';
import { connect } from "react-redux";
import './VisualizationsConfigModal.css'

class VisualizationsModal extends Component {
    constructor(props) {
        super(props);
        this.activeUsers = {};
        this.noUsers = 'There are no users in discussion';
        this.socket = props.socket;
        this.state = {
            configType: '',
            activeUsers: {},
            updateAll: false,
            updateUser: false,
        }
    }

    componentDidMount() {
        this.socket.on("new user config", (response) => {
            this.loadActiveUsers(response);
        })
    }

    loadActiveUsers(configuration) {
        this.activeUsers = {};
        if (Object.keys(configuration).length > 0) {
            this.activeUsers['all'] = {
                graph: true,
                alerts: true,
                statisticsUser: true,
                statisticsDiscussion: true,
            };

            Object.keys(configuration).forEach(user => {
                
                this.activeUsers[user] = {
                    graph: configuration[user]['graph'],
                    alerts: configuration[user]['alerts'],
                    statisticsUser: configuration[user]['statisticsUser'],
                    statisticsDiscussion: configuration[user]['statisticsDiscussion'],
                };
                if (!configuration[user]['graph'])
                    this.activeUsers['all']['graph'] = false;
                if (!configuration[user]['alerts'])
                    this.activeUsers['all']['alerts'] = false;
                if (!configuration[user]['statisticsUser'])
                    this.activeUsers['all']['statisticsUser'] = false;
                if (!configuration[user]['statisticsDiscussion'])
                    this.activeUsers['all']['statisticsDiscussion'] = false;
            });
        }
        else {
            this.noUsers = 'There are no users in discussion';
        }
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
            Object.keys(this.activeUsers).forEach(user => {
                this.updateConfigInState(event, user, type);
            });
            this.setState({
                updateAll: true
            });
        } else {
            if (!event.target.checked) {
                let allSettings = this.activeUsers;
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
        let allSettings = this.activeUsers;
        allSettings[username][type] = event.target.checked;
        this.setState({
            activeUsers: allSettings
        });
    };

    updateConfig = () => {
        let type = '';
        let configComment = {};
        let usersList;
        if (this.state.updateUser) {
            type = 'list';
            usersList = {};
            for (let [user, config] of Object.entries(this.activeUsers)) {
                if (user !== 'all') {
                    usersList[user] = config
                }
            }
            configComment = {
                discussionId: this.props.discussionId,
                extra_data: { recipients_type: type, users_list: usersList }
            };
        } else if (this.state.updateAll) {
            type = 'all';
            usersList = { all: this.activeUsers['all'] };
            configComment = {
                discussionId: this.props.discussionId,
                extra_data: { recipients_type: type, users_list: usersList }
            };
        }
        if (!this.props.isSimulation) {
            let text = '';
            for (const [user, actions] of Object.entries(usersList)) {
                text += `User : ${user}, Action : ${JSON.stringify(actions)}`;
            }
            Object.assign(configComment, {
                'author': this.props.currentUser,
                'text': text,
                'parentId': this.props.lastMessage.id,
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
                    {Object.keys(this.activeUsers).length > 0 ?
                        <table className="table" >
                            <thead >
                                <tr >
                                    <th >username</th >
                                    <th >Graph</th >
                                    <th >User Statistics </th >
                                    <th >Discussion Statistics</th >
                                    <th >Alerts</th >
                                </tr >
                            </thead >
                            <tbody >
                                {Object.keys(this.activeUsers).map((id) =>
                                    <tr id={id} key={id} >
                                        <td >{id}</td >
                                        <td >
                                            <input
                                                name={id} type="checkbox"
                                                id={id + " graph"}
                                                className="visModalGraph"
                                                checked={this.activeUsers[id]['graph']}
                                                onChange={(event) => this.updateUserVisualizations(event, 'graph')}
                                            />
                                            <label htmlFor={id + " graph"} />
                                        </td >
                                        <td >
                                            <input
                                                name={id} type="checkbox"
                                                id={id + " statisticsUser"}
                                                className="visModalStatsUser"
                                                checked={this.activeUsers[id]['statisticsUser']}
                                                onChange={(event) => this.updateUserVisualizations(event, 'statisticsUser')}
                                            />
                                            <label htmlFor={id + " statisticsUser"} />
                                        </td >
                                        <td >
                                            <input
                                                name={id} type="checkbox"
                                                id={id + " statisticsDiscussion"}
                                                className="visModalStatsDiscussion"
                                                checked={this.activeUsers[id]['statisticsDiscussion']}
                                                onChange={(event) => this.updateUserVisualizations(event, 'statisticsDiscussion')}
                                            />
                                            <label htmlFor={id + " statisticsDiscussion"} />
                                        </td >
                                        <td >
                                            <input
                                                name={id} type="checkbox"
                                                id={id + " alerts"}
                                                className="visModalAlerts"
                                                checked={this.activeUsers[id]['alerts']}
                                                onChange={(event) => this.updateUserVisualizations(event, 'alerts')}
                                            />
                                            <label htmlFor={id + " alerts"} />
                                        </td >
                                    </tr >
                                )}
                            </tbody >
                        </table >
                        : <p><b> {this.noUsers} </b></p>
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
