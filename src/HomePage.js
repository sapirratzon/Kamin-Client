import React, { Component } from "react";
import './HomePage.css';
import CreateDiscussionModal from "./DiscussionPage/Modals/CreateDiscussionModal";
import EnterSimulationCodeModal from "./DiscussionPage/Modals/EnterSimulationCodeModal";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discussionModal: false,
            simulationCodeModal: false
        }
    }

    render() {
        return (
            <div className="HomePage">
                <div className="headline" />
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3>Simulation</h3>
                            <p>Enter to simulate discussion</p>
                            <p>You will see a real time analysis on this discussion</p>
                            <button type="button" className="btn btn-info btn-sm"
                                onClick={() => this.updateSimulationCodeModalHandler(true)}>Start Simulation
                            </button>
                            <EnterSimulationCodeModal isOpen={this.state.simulationCodeModal}
                                updateVisibility={this.updateSimulationCodeModalHandler.bind(this)}
                                updateHistoryPath={this.updateSimulationCode.bind(this)} />
                        </div>
                        <div className="col-sm-6">
                            <h3>Real-time discussion</h3>
                            <p>You can join quickly to an exist discussion</p>
                            <button type="button" className="btn btn-info btn-sm" onClick={this.realTimeHandler}>Enter</button>
                        </div>
                    </div>
                    <div>
                        <button type="button" className="btn btn-info btn-sm"
                            onClick={() => this.updateModalHandler(true)}>Create a new discussion
                        </button>
                        <CreateDiscussionModal isOpen={this.state.discussionModal}
                            updateVisibility={this.updateModalHandler.bind(this)}
                            path={this.props.history} />
                    </div>
                </div>
            </div>
        );
    }

    simulationHandler = () => {
        let path = `Discussion/true`;
        this.props.history.push(path);
    };

    updateSimulationCode = (path) => {
        this.props.history.push(path);
    };

    realTimeHandler = () => {
        let path = `Discussion/false`;
        this.props.history.push(path);
    };

    updateModalHandler = (isOpen) => {
        this.setState({
            discussionModal: isOpen
        });
    };

    updateSimulationCodeModalHandler = (isOpen) => {
        this.setState({
            simulationCodeModal: isOpen
        });
    };

    createDiscussion(title, categories, description) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            let discussion_id = JSON.parse(xhr.responseText);
            this.addComment(discussion_id, description);
        });
        xhr.open('POST', 'http://localhost:5000/api/createDiscussion');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ title: title, categories: categories }));
    };

    addComment(discussion_id, description) {
    }
}

export default HomePage;
