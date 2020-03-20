import React, { Component } from 'react';
import '../App.css';
import RealTime from "./Chat/Chat";
import Simulation from './Simulation/Simulation';
import Graph from "./Graph/Graph";
import AlertList from "./Alert/AlertsList";


class Discussion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shownMessages: [],
            shownNodes: [],
            shownLinks: [],
            shownAlerts: [],
            allAlerts: [],
            discussionId: "5e0795acccadf5b7189464dd",
        };
        this.messages = [];
        this.nodes = [];
        this.links = [];
    }

    updateMessagesHandler(newMessages, newNodes, newLinks) {
        const newAlerts = [];
        this.state.allAlerts.forEach((a) => {
            if (a.position <= newMessages.length-1) { 
                newAlerts.push(a); 
                console.log("pos :"+a.position+" , length :"+newMessages.length)
            }
        });
        this.setState({
            shownMessages: newMessages,
            shownNodes: newNodes,
            shownLinks: newLinks,
            shownAlerts:newAlerts
        });
    };

    updateAlertsHandler(newAlert) {
        this.state.allAlerts.push(newAlert);
    };

    render(props) {
        return (
            <div className="App">
                <div className="row px-5 content">
                    <div className="chat col-6 py-3">
                        <RealTime messages={this.state.shownMessages} isSimulation={this.props.isSimulation === 'true'}
                              messagesHandler={this.updateMessagesHandler.bind(this)} alertsHandler={this.updateAlertsHandler.bind(this)}
                              discussionId={this.state.discussionId} />
                    </div>
                    <div className="col-6">
                        {this.props.isSimulation === 'true' ?
                            <Simulation messagesHandler={this.updateMessagesHandler.bind(this)} alertsHandler={this.updateAlertsHandler.bind(this)}
                                discussionId={this.state.discussionId} />
                            : null}
                        <Graph nodes={this.state.shownNodes} links={this.state.shownLinks} />
                        <AlertList alerts={this.state.shownAlerts} />
                    </div>
                </div>
            </div>
        );
    }
}


export default Discussion;