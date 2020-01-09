import React, { Component } from 'react';
import '../App.css';
import Chat from "./Chat/Chat";
import Simulation from './Simulation/Simulation';
import Graph from "./Graph/Graph";
import AlertList from "./Alert/AlertsList";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shownMessages: [],
            shownNodes: [],
            shownLinks: [],
            shownAlerts: [],
            allAlerts: [],
            discussionId:"5e1646da79c9da9f2113e70c",
            isSimulation: false
        };
        this.messages = [];
        this.nodes = [];
        this.links = [];
    }

    updateMessagesHandler(newMessages, newNodes, newLinks) {
        const newAlerts = [];
        this.state.allAlerts.forEach((a) => {
            if (a.position <= newMessages.length) { newAlerts.push(a); }
        });
        this.setState({ shownAlerts: newAlerts });
        this.setState({
            shownMessages: newMessages,
            shownNodes: newNodes,
            shownLinks: newLinks
        });
    };

    updateAlertsHandler(newAlert) {
        this.state.allAlerts.push(newAlert);
    };

    render() {
        return (
            <div className="App">
                <div className="row px-5 content">
                    <div className="chat col-6 py-3">
                        <Chat messages={this.state.shownMessages} isSimulation={this.state.isSimulation}
                              messagesHandler={this.updateMessagesHandler.bind(this)} alertsHandler={this.updateAlertsHandler.bind(this)}
                              discussionId={this.state.discussionId} />
                    </div>
                    <div className="col-6">
                        {this.state.isSimulation ?
                            <Simulation messagesHandler={this.updateMessagesHandler.bind(this)} alertsHandler={this.updateAlertsHandler.bind(this)} />
                            : null
                        }
                        <Graph nodes={this.state.shownNodes} links={this.state.shownLinks} />
                        <AlertList alerts={this.state.shownAlerts} />
                    </div>
                </div>
            </div>
        );
    }
}


export default App;