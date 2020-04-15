import React, { Component } from 'react';
import './Discussion.css';
import Chat from "./Chat/Chat";
import Simulation from './Simulation/Simulation';
import Graph from "./Graph/Graph";
import AlertList from "./Alert/AlertsList";
import UserStats from "./Statistics/UserStats";
import DiscussionStats from "./Statistics/DiscussionStats";
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux'

class Discussion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shownMessages: [],
            shownNodes: [],
            shownLinks: [],
            shownAlerts: [],
            allAlerts: [],
            discussionId: this.props.simulationCode,
            title: ""
        };
    }

    updateMessagesHandler(newMessages, newNodes, newLinks) {
        const newAlerts = [];
        this.state.allAlerts.forEach((a) => {
            if (a.position <= newMessages.length - 1) {
                newAlerts.push(a);
            }
        });
        this.setState({
            shownMessages: newMessages,
            shownNodes: newNodes,
            shownLinks: newLinks,
            shownAlerts: newAlerts
        });
    };

    updateAlertsHandler(newAlert) {
        this.state.allAlerts.push(newAlert);
    };

    setTitle = (title) => {
        this.setState({
                title: title
            }
        );
    };

    handleShareClick = () => {
        let dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.setAttribute('value', this.state.discussionId);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    };

    getShownMessages () {
        return this.state.shownMessages;
    };

    getShownLinks () {
        return this.state.shownLinks;
    };

    getShownNodes () {
        return this.state.shownNodes;
    };

    render() {
        return (
            <div className="App">
                <div className="row text-center">
                    <span className="col-4"/>
                    <span className="col-4">
                        <h3><b>{this.state.title}</b><i className="fas fa-share-square text-primary pl-2 cursor-pointer"
                                                        data-tip="Copied!" data-event="click"/></h3>
                        <ReactTooltip eventOff="mousemove" afterShow={this.handleShareClick}/>
                    </span>
                    <span className="col-4">
                        {this.props.isSimulation === 'true' ?
                            <Simulation messagesHandler={this.updateMessagesHandler.bind(this)}
                                        alertsHandler={this.updateAlertsHandler.bind(this)}
                                        discussionId={this.props.simulationCode}
                                        setTitle={this.setTitle}
                                        messagesOrder={'chronological'}
                                        nodeColor={intToRGB}
                            /> : null}
                    </span>
                </div>
                <hr/>
                <div className="row content mr-3 ml-1">
                    <div className="discussion-col col-lg-6 col-md-12 px-1">
                        <Chat messages={this.state.shownMessages} isSimulation={this.props.isSimulation === 'true'}
                              messagesHandler={this.updateMessagesHandler.bind(this)}
                              alertsHandler={this.updateAlertsHandler.bind(this)}
                              discussionId={this.props.simulationCode}
                              setTitle={this.setTitle}
                              nodeColor={intToRGB}/>

                    </div>
                    <div className="discussion-col col-lg-6 col-md-12">
                        <div className="graph row blue-border mb-1">
                            <Graph nodes={this.state.shownNodes} links={this.state.shownLinks}/>
                        </div>
                        <div className="row insights">
                            <div className="col-lg-4 col-md-12 p-0 blue-border mr-1">
                                <UserStats className="stats"
                                           discussionId={this.state.discussionId}
                                           getShownMessages={this.getShownMessages.bind(this)}
                                           getShownLinks={this.getShownLinks.bind(this)}/>
                                <DiscussionStats className="stats h-50"
                                                 discussionId={this.state.discussionId}
                                                 getShownMessages={this.getShownMessages.bind(this)}
                                                 getShownLinks={this.getShownLinks.bind(this)}
                                                 getShownNodes={this.getShownNodes.bind(this)}/>
                            </div>
                            <div className="col p-0 blue-border">
                                <AlertList alerts={this.state.shownAlerts}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i) {
    const c = (hashCode(i) & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        token: state.token,
        userType: state.userType
    };
};

export default connect(mapStateToProps)(Discussion);
