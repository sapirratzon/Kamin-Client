import React, { Component } from 'react';
import './App.css';
import NavigationBar from "./NavigationBar/NavigationBar";
import Chat from "./DiscussionPage/Chat/Chat";
import "./DiscussionPage/Graph/Graph.css";
import "./DiscussionPage/Simulation/Simulation";
import Simulation from './DiscussionPage/Simulation/Simulation';
import Graph from "./DiscussionPage/Graph/Graph";

class App extends Component {
    constructor() {
        super();
        this.state = {
            shownMessages: [],
            shownNodes: [],
            shownLinks: []
        };
    }

    updateMessagesHandler(newMessages, newNodes, newLinks) {
        this.setState({
            shownMessages: newMessages,
            shownNodes: newNodes,
            shownLinks: newLinks
        }, () => {
            console.log(this.state)
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
                        <Graph shownNodes={this.state.shownNodes} shownLinks={this.state.shownLinks} />
                    </div>
                </div>
            </div>
        );
    }
}


export default App;
