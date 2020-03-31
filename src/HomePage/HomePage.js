import React, { Component } from "react";
import { connect } from 'react-redux'
import './HomePage.css';
import CreateDiscussionModal from "../DiscussionPage/Modals/CreateDiscussionModal";

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
                <div className="headline" />
                {this.props.currentUser ? <div className="container">
                    {this.props.userType === 'MODERATOR' || this.props.userType === 'ROOT' ?
                        <React.Fragment>
                            <p>Moderation tools:</p>
                            <button type="button" className="btn btn-info btn-sm"
                                onClick={() => this.updateModalHandler(true)}>Create New Discussion</button>
                            {this.props.userType === 'ROOT' ? <button type="button" className="btn btn-info btn-sm"
                                onClick={() => this.changePath('/moderatorsManagement')}>Manage moderators</button> : null}
                            <CreateDiscussionModal isOpen={this.state.discussionModal}
                                updateVisibility={this.updateModalHandler.bind(this)}
                                path={this.props.history} />
                        </React.Fragment> : null}
                    <form onSubmit={this.discussionHandler}>
                        <p>Join existing discussions:</p>
                        <input type="text" className="form-control" name="unique"
                            placeholder="Enter code" />
                        <button className="btn btn-info btn-sm"
                            onClick={() => this.discussionTypeHandler("true")}>Simulation
                        </button>
                        <button className="btn btn-info btn-sm"
                            onClick={() => this.discussionTypeHandler("false")}>Real-Time Discussion
                        </button>
                    </form>
                </div> : <div>
                        <h1>Hi and welcome to Kamin!</h1>
                        <h3>In order to use the application you need to create an account or sign in if you already have one.</h3>
                        <button type="button" className="btn btn-info btn-sm"
                            onClick={() => this.changePath('/login')}>Sign in
                        </button>
                        <button type="button" className="btn btn-info btn-sm"
                            onClick={() => this.changePath('/registration')}>Sign up
                        </button>
                    </div>}

            </div>
        );
    }

    changePath = (path) => {
        this.props.history.push(path);
    };

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
        xhr.send(JSON.stringify({ title: title, categories: categories }));
    };

}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        userType: state.userType
    };
};

export default connect(mapStateToProps)(HomePage);
