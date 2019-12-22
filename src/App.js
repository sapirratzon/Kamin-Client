import React, { Component } from 'react';
import './App.css';
import NavigationBar from "./NavigationBar/NavigationBar";
import ForceGraph2D from 'react-force-graph-2d';
import Chat from "./DiscussionPage/Chat/Chat";
import "./DiscussionPage/Graph/Graph.css";
import "./DiscussionPage/Simulation/Simulation";
import Simulation from './DiscussionPage/Simulation/Simulation';

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
                        <div id="graph">
                            <ForceGraph2D className="graph" graphData={{
                                "nodes": this.state.shownNodes,
                                "links": this.state.shownLinks
                            }}></ForceGraph2D>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default App;
