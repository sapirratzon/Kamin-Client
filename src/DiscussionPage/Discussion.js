import React, { Component } from 'react';
import './Discussion.css';
import Chat from "./Chat/Chat";
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
            discussionId: this.props.simulationCode,
            title: ""
        };
        this.messages = [];
        this.nodes = [];
        this.links = [];
    }

    // componentDidMount() {
    //     this.setState({
    //         discussionId: this.props.simulationCode
    //     });
    // }

    updateMessagesHandler(newMessages, newNodes, newLinks) {
        const newAlerts = [];
        this.state.allAlerts.forEach((a) => {
            if (a.position <= newMessages.length - 1) {
                newAlerts.push(a);
                console.log("pos :" + a.position + " , length :" + newMessages.length)
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
        console.log('set title');
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
                <hr width="95%"/>
                <div className="row px-5 content">
                    <div className="chatwindow col-6 py-3">
                        <Chat messages={this.state.shownMessages} isSimulation={this.props.isSimulation === 'true'}
                            messagesHandler={this.updateMessagesHandler.bind(this)}
                            alertsHandler={this.updateAlertsHandler.bind(this)}
                            discussionId={this.props.simulationCode}
                            setTitle={this.setTitle} />
                    </div>
                    <div className="col-6">
                        {this.props.isSimulation === 'true' ?
                            <Simulation messagesHandler={this.updateMessagesHandler.bind(this)}
                                alertsHandler={this.updateAlertsHandler.bind(this)}
                                discussionId={this.props.simulationCode} 
                                setTitle={this.setTitle}
                                />
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
