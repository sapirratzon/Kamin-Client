import React, {Component} from "react";
import './HomePage.css';
import CreateDiscussionModal from "./DiscussionPage/Modals/CreateDiscussionModal";
// import CreateDiscussionModal from "./DiscussionPage/CreateDiscussionModal";


class HomePage extends Component {
    constructor(props){
        super(props);
        this.showCreateDiscussionModal = false;
        this.state = {
            discussionModal: false
        }
    }

    render() {
        return (
            <div className="HomePage">
                <div className="headline"/>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3>Simulation</h3>
                            <p>Enter to simulate discussion</p>
                            <p>You will see a real time analysis on this discussion</p>
                            <button type="button" className="btn btn-info btn-sm" onClick={this.simulationHandler}>Start
                                Simulation
                            </button>
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
                                               loadWeather={this.createDiscussionTest}/>
                    </div>
                </div>
            </div>
        );
    }

    createDiscussionTest = (event) =>{
        event.preventDefault();
        console.log(event);
        console.log(event.target.cityZipCode.value);

    }

    simulationHandler = () => {
        let path = `Discussion/true`;
        this.props.history.push(path);
    };

    realTimeHandler = () => {
        let path = `Discussion/false`;
        this.props.history.push(path);
    };

    updateModalHandler = (isOpen) => {
        this.setState ({
            discussionModal: isOpen
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
        xhr.send(JSON.stringify({title: title, categories: categories}));
    };

    addComment(discussion_id, description){
    }
}

export default HomePage;
