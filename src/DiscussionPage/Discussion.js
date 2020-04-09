import React, {Component} from 'react';
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
                    <h3><b>{this.state.title}</b></h3>
                </div>
                <hr width="95%"/>
                <div className="row px-5 content">
                    <div className="chatWindow col-6 py-3">
                        <Chat messages={this.state.shownMessages} isSimulation={this.props.isSimulation === 'true'}
                              messagesHandler={this.updateMessagesHandler.bind(this)}
                              alertsHandler={this.updateAlertsHandler.bind(this)}
                              discussionId={this.props.simulationCode}
                              setTitle={this.setTitle}
                              nodeColor={intToRGB}
                        />
                    </div>
                    <div className="col-6">
                        {this.props.isSimulation === 'true' ?
                            <Simulation messagesHandler={this.updateMessagesHandler.bind(this)}
                                        alertsHandler={this.updateAlertsHandler.bind(this)}
                                        discussionId={this.props.simulationCode}
                                        setTitle={this.setTitle}
                                        messagesOrder={'chronological'}
                                        nodeColor={intToRGB}
                            />
                            : null }
                        <Graph nodes={this.state.shownNodes} links={this.state.shownLinks}/>
                        <AlertList alerts={this.state.shownAlerts}/>
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

export default Discussion;
