import React, {Component} from "react";
import './HomePage.css';
import CreateDiscussionModal from "./DiscussionPage/Modals/CreateDiscussionModal";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSimulation: "false",
            discussionModal: false,
            simulationCodeModal: false
        }
    }

    render() {
        return (
            <div className="HomePage">
                <div className="headline"/>
                <div className="container">
                    <div className="create-discussion">
                        <button type="button" className="btn btn-info btn-sm"
                                onClick={() => this.updateModalHandler(true)}>Create New Discussion
                        </button>
                        <CreateDiscussionModal isOpen={this.state.discussionModal}
                                               updateVisibility={this.updateModalHandler.bind(this)}
                                               path={this.props.history}/>
                    </div>
                    <form onSubmit={this.discussionHandler}>
                        <p>Join to exists discussion</p>
                        <input type="text" className="form-control" name="unique"
                               placeholder="Enter code"/>
                        <button className="btn btn-info btn-sm"
                                onClick={() => this.discussionTypeHandler("true")}>Simulation
                        </button>
                        <button className="btn btn-info btn-sm"
                                onClick={() => this.discussionTypeHandler("false")}>Real-Time Discussion
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    discussionHandler = (event) => {
        event.preventDefault();
        let uniqueCode = event.target.unique.value;
        let path = `Discussion/` + this.state.isSimulation + "/" + uniqueCode;
        this.props.history.push(path);
    };

    updateModalHandler = (isOpen) => {
        this.setState({
            discussionModal: isOpen
        });
    };

    discussionTypeHandler = (isSimulation) => {
        this.setState({
            isSimulation: isSimulation
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

    addComment(discussion_id, description) {
    }
}

export default HomePage;
