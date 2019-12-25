import React, { Component } from 'react';
import './App.css';
import NavigationBar from "./NavigationBar/NavigationBar";
import Chat from "./DiscussionPage/Chat/Chat";
import "./DiscussionPage/Graph/Graph.css";
import "./DiscussionPage/Simulation/Simulation";
import Simulation from './DiscussionPage/Simulation/Simulation';
import Graph from "./DiscussionPage/Graph/Graph";
import AlertList from "./DiscussionPage/Alert/AlertsList";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shownMessages: [],
            shownNodes: [],
            shownLinks: [],
            shownAlerts: [],
            allAlerts: []
        };
    }

    updateMessagesHandler(newMessages, newNodes, newLinks) {
        this.state.allAlerts.forEach((a) => {
            if (a.position === newMessages.length) {
                this.state.shownAlerts.push(a);
            }
        });
        this.setState({
            shownMessages: newMessages,
            shownNodes: newNodes,
            shownLinks: newLinks
        });
    };

    updateAlertsHandler(newAlert) {
        this.state.allAlerts.push(newAlert);
        console.log("Added " + newAlert.text + " at pos " + newAlert.position)
    };

    render() {
        return (
            <div className="App">
                <NavigationBar />
                <div className="row px-5 content">
                    <div className="chat col-6 py-3">
                        <Chat messages={this.state.shownMessages} />
                    </div>
                    <div className="col-6">
                        <Simulation messagesHandler={this.updateMessagesHandler.bind(this)} alertsHandler={this.updateAlertsHandler.bind(this)} />
                        {/*<h2 className="text-center">Conversation Insights:</h2>*/}
                         <Graph nodes={this.state.shownNodes} links={this.state.shownLinks}/>
                        <AlertList alerts={this.state.shownAlerts} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
