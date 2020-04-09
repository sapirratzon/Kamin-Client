import React, { Component } from 'react';
import './Discussion.css';
import Chat from "./Chat/Chat";
import Simulation from './Simulation/Simulation';
import Graph from "./Graph/Graph";
import AlertList from "./Alert/AlertsList";
import UserStats from "./Statistics/UserStats"
import DiscussionStats from './Statistics/DiscussionStats';

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
        this.setState(
            {
                title: title
            }
        );
    };

    render(props) {
        return (
            <div className="App">
                <div className="text-center text-body">
                    <h1><b>{this.state.title}</b></h1>
                </div>
                <hr width="95%" />
                <div className="row px-5 content">
                    <div className="chatwindow col-6 py-3">
                        <Chat messages={this.state.shownMessages} isSimulation={this.props.isSimulation === 'true'}
                            messagesHandler={this.updateMessagesHandler.bind(this)}
                            alertsHandler={this.updateAlertsHandler.bind(this)}
                            discussionId={this.props.simulationCode}
                            setTitle={this.setTitle} />
                    </div>
                    <div className="col-6">
                        <div className="row">
                            {this.props.isSimulation === 'true' ?
                                <Simulation messagesHandler={this.updateMessagesHandler.bind(this)}
                                    alertsHandler={this.updateAlertsHandler.bind(this)}
                                    discussionId={this.props.simulationCode}
                                    setTitle={this.setTitle}
                                    messagesOrder={'chronological'}
                                />
                                : null}
                            <Graph nodes={this.state.shownNodes} links={this.state.shownLinks} />
                        </div>
                        <div className="row">
                            <div className="col-6 pl-0 pr-0">
                                    <UserStats userName={this.currentUser} />
                                    <DiscussionStats className="h-50" discussionId={this.state.discussionId} />
                            </div>
                            <div className="col pl-0 pr-0">
                                <AlertList alerts={this.state.shownAlerts} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Discussion;
