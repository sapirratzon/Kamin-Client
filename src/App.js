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
            alerts: [{ "text": "This is an alert test :)" }]
        };
    }

    updateMessagesHandler(newMessages, newNodes, newLinks) {
        this.setState({
            shownMessages: newMessages,
            shownNodes: newNodes,
            shownLinks: newLinks
        });
    }

    render() {
        return (
            <div className="App">
                <NavigationBar />
                <div className="row px-5 content">
                    <div className="chat col-6 py-3">
                        <Chat messages={this.state.shownMessages} />
                    </div>
                    <div className="col-6">
                        <Simulation messagesHandler={this.updateMessagesHandler.bind(this)} />
                        <h2 className="text-center">Conversation Insights:</h2>
                        <Graph nodes={this.state.shownNodes} links={this.state.shownLinks} />
                        <AlertList alerts={this.state.alerts} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
