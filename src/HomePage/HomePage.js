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
            simulationCodeModal: false,
            allDiscussions: {},
            error: ''
        }
    }

    componentDidMount() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText)["discussions"];
            this.setState({
                allDiscussions: response,
                selectedDiscussion: ''
            });
        });
        xhr.open('GET', process.env.REACT_APP_API+'/api/getDiscussions/False');
        xhr.setRequestHeader("Authorization", "Basic " + btoa(this.props.token + ":"));
        xhr.send();
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
                        <h3>Join existing discussions:</h3>
                        <span>Search Code</span>
                        <div>
                            <select className="discussions" onChange={(e) =>
                                this.setState({selectedDiscussion: e.target.value,
                                error: ''})}>
                                <option key="-1" value=''>Select Discussion</option>)}
                                {Object.keys(this.state.allDiscussions).map((id) =>
                                    <option key={id} value={id}>{this.state.allDiscussions[id]}, {id}</option>)}
                            </select>
                        </div>
                        <span className="font-size-xxl">or</span>
                        <input type="text" className="codeInput form-control" name="unique"
                            placeholder="Enter code" onChange={this.initError} />
                        <p className="errorMessage">{this.state.error}</p>
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

    initError = () => {
        this.setState({error: ''});
    };

    changePath = (path) => {
        this.props.history.push(path);
    };

    discussionHandler = (event) => {
        event.preventDefault();
        let uniqueCode = event.target.unique.value;
        if (uniqueCode.length > 0) {
            let path = `Discussion/` + this.state.isSimulation + "/" + uniqueCode;
            this.props.history.push(path);
        }
        else {
            this.discussionSelectorHandler(event);
        }
    };

    discussionSelectorHandler = (event) => {
        let uniqueCode = this.state.selectedDiscussion;
        if (uniqueCode.length === 0){
            this.setState({error: "Please select discussion or enter a code"});
            return;
        }
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

}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        userType: state.userType,
        token: state.token
    };
};

export default connect(mapStateToProps)(HomePage);
