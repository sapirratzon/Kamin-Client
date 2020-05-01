import React, { Component } from "react";
import { connect } from 'react-redux'
import './HomePage.css';
import { Link } from "react-router-dom";
import CreateDiscussionModal from "../DiscussionPage/Modals/CreateDiscussionModal";
import Loader from 'react-loader-spinner'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.realTimeDiscussions = {};
        this.simulationDiscussions = {};
        this.isLoading = false;
        this.state = {
            isSimulation: "false",
            discussionModal: false,
            simulationCodeModal: false,
            selectedRealTimeDiscussion: '',
            selectedSimulationDiscussion: '',
            typedId: '',
            error: '',
        };
    }

    componentDidMount() {
        if (this.props.currentUser) {
            const xhrRealTime = new XMLHttpRequest();
            xhrRealTime.addEventListener('load', () => {
                if (xhrRealTime.status === 401) {
                    this.props.onLogOut();
                } else {
                    this.realTimeDiscussions = JSON.parse(xhrRealTime.responseText)["discussions"];
                }
            });
            xhrRealTime.open('GET', process.env.REACT_APP_API + '/api/getDiscussions/False');
            xhrRealTime.setRequestHeader("Authorization", "Basic " + btoa(this.props.token + ":"));
            xhrRealTime.send();
            const xhrSimulation = new XMLHttpRequest();
            xhrSimulation.addEventListener('load', () => {
                if (xhrSimulation.status === 401) {
                    this.props.onLogOut();
                } else {
                    this.simulationDiscussions = JSON.parse(xhrSimulation.responseText)["discussions"];
                }
                this.isLoading = false;
            });
            this.isLoading = true;
            xhrSimulation.open('GET', process.env.REACT_APP_API + '/api/getDiscussions/True');
            xhrSimulation.setRequestHeader("Authorization", "Basic " + btoa(this.props.token + ":"));
            xhrSimulation.send();
        }
    };

    updateModalHandler = (isOpen) => {
        this.setState({
            discussionModal: isOpen
        });
    };

    handleSelectedDiscussion = (event, isSimulation) => {
        if (isSimulation) {
            this.setState({
                isSimulation: "true",
                selectedSimulationDiscussion: event.target.value,
                selectedRealTimeDiscussion: '',
                typedId: ''
            });
        } else {
            this.setState({
                isSimulation: "false",
                selectedSimulationDiscussion: '',
                selectedRealTimeDiscussion: event.target.value,
                typedId: ''
            });
        }
    };

    handleTypedId = (event) => {
        let id = event.target.value;
        let isSimulation = Object.keys(this.simulationDiscussions).includes(id);
        this.setState({
            isSimulation: isSimulation,
            selectedSimulationDiscussion: '',
            selectedRealTimeDiscussion: '',
            typedId: id
        });
    };

    handleJoinClick = (event) => {
        event.preventDefault();
        if ((!this.state.selectedRealTimeDiscussion && !this.state.selectedSimulationDiscussion && !this.state.typedId) ||
            (this.state.typedId && !Object.keys(this.simulationDiscussions).includes(this.state.typedId) && !Object.keys(this.realTimeDiscussions).includes(this.state.typedId))) {
            this.setState({
                error: 'Invalid discussion id'
            });
            return;
        }
        let path = `Discussion/` + this.state.isSimulation + "/" + this.state.selectedRealTimeDiscussion + this.state.selectedSimulationDiscussion + this.state.typedId;
        this.props.history.push(path);
    };

    render() {
        return (
            <div className="HomePage" >
                <div className="headline" />
                { this.props.currentUser ? <div className="container" >
                    { this.props.userType === 'MODERATOR' &&
                    <React.Fragment >
                        <p >Moderation tools:</p >
                        <button
                            type="button" className="btn btn-info btn-sm"
                            onClick={ () => this.updateModalHandler(true) } >Create New Discussion
                        </button >
                    </React.Fragment >
                    }
                    { this.props.userType === 'ROOT' &&
                    <Link to={ '/moderatorsManagement' } >
                        <button
                            type="button" className="btn btn-info btn-sm" >Manage moderators
                        </button >
                    </Link > }
                    <CreateDiscussionModal
                        isOpen={ this.state.discussionModal }
                        updateVisibility={ this.updateModalHandler.bind(this) }
                        path={ this.props.history } />
                    { !this.isLoading ?
                        this.props.userType !== 'ROOT' &&
                        <form onSubmit={ this.handleJoinClick } >
                            <h3 >Join existing discussions:</h3 >
                            <div className="row text-center" >
                            <span className="col-6" >
                                <p >Simulations:</p >
                                <select
                                    className="discussions" value={ this.state.selectedSimulationDiscussion }
                                    onChange={ (e) => { this.handleSelectedDiscussion(e, true) } } >
                                    <option value="" >Select Discussion</option >
                                    { Object.keys(this.simulationDiscussions).map((id) =>
                                        <option
                                            key={ id }
                                            value={ id } >{ this.simulationDiscussions[id] }, { id }</option >) }
                                </select >
                            </span >
                                <span className="col-6" >
                                <p >Real time:</p >
                                <select
                                    className="discussions" value={ this.state.selectedRealTimeDiscussion }
                                    onChange={ (e) => { this.handleSelectedDiscussion(e, false) } } >
                                    <option value="" >Select Discussion</option >
                                    { Object.keys(this.realTimeDiscussions).map((id) =>
                                        <option
                                            key={ id }
                                            value={ id } >{ this.realTimeDiscussions[id] }, { id }</option >) }
                                </select >
                            </span >
                            </div >
                            <span className="font-size-xxl" >Or</span >
                            <input
                                type="text" className="codeInput form-control" name="unique"
                                placeholder="Enter code" onChange={ this.handleTypedId }
                                value={ this.state.typedId } />
                            <p className="text-danger" >{ this.state.error }</p >
                            <button className="btn btn-info btn-sm" >Join</button >
                        </form > :
                        <Loader className="mt-3" type="TailSpin" color="#007bff" height={ 80 } width={ 80 } /> }

                </div > : <div >
                    <h1 >Hi and welcome to Kamin!</h1 >
                    <h3 >In order to use the application you need to create an account or sign in if you already have
                         one.</h3 >
                    <Link to={ '/login' } >
                        <button
                            type="button" className="btn btn-info btn-sm"
                        >Sign in
                        </button >
                    </Link >
                    <Link to={ '/registration' } >
                        <button type="button" className="btn btn-info btn-sm" >Sign up
                        </button >
                    </Link >
                </div >
                }
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        userType: state.userType,
        token: state.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogOut: () => dispatch({type: 'LOGOUT'})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
