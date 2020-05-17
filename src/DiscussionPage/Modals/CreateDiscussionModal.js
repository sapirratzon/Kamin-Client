import React, { Component } from 'react';
import { connect } from 'react-redux'
import Modal from 'react-bootstrap4-modal';
import "./CreateDiscussionModal.css"
import CheckBox from './Checkbox';


class CreateDiscussionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            descriptionError: '',
            title: '',
            titleError: '',
            replyPosition: "None",
            graphChecked: true,
            statsUserChecked: true,
            statsDiscussionChecked: true,
            alertsChecked: true,
            language: 'English',
            directionClass: "leftToRight",
        };
        this.configuration = {
            vis_config: { "graph": true, "alerts": true, "statisticsUser": true, "statisticsDiscussion": true },
            extra_config: {
                language: "English"
            }
        }
    }

    handleChange = (e) => {
        this.setState({
            titleError: '',
            descriptionError: ''
        });
        const {name, value} = e.target;
        this.setState({[name]: value});
    };

    vizConfigChange = (type) => {
        this.configuration.vis_config[type] = !this.configuration.vis_config[type];
        if (type === "graph") {
            this.setState(prevState=>({graphChecked: !prevState.graphChecked}));
        }
        if (type === "statisticsUser") {
            this.setState(prevState=>({statsUserChecked: !prevState.statsUserChecked}))
        }
        if (type === "statisticsDiscussion") {
            this.setState(prevState=>({statsDiscussionChecked: !prevState.statsDiscussionChecked}))
        }
        if (type === "alerts") {
            this.setState(prevState=>({alertsChecked: !prevState.alertsChecked}))
        }
    };

    languageChange = (lang) => {
        if (lang === "English") {
            this.setState({
                language: lang,
                directionClass: 'leftToRight'
            });
        } else {
            this.setState({
                language: lang,
                directionClass: 'rightToLeft'
            });
        }
        this.configuration.language = lang;
    };

    changePath = (path) => {
        this.props.path.push(path);
    };

    createDiscussion = () => {
        const {description, title} = this.state;
        if (!title) {
            this.setState({
                titleError: 'Title is required'
            });
            return;
        }
        if (!description) {
            this.setState({
                descriptionError: 'Description is required'
            });
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            if (xhr.status === 401) {
                this.props.onLogOut();
            } else {
                let discussion_id = JSON.parse(xhr.responseText)["discussion_id"];
                this.changePath('/Discussion/false/' + discussion_id);
            }
        });
        xhr.open('POST', process.env.REACT_APP_API + '/api/createDiscussion');
        xhr.setRequestHeader("Authorization", "Basic " + btoa(this.props.token + ":"));
        xhr.setRequestHeader("Content-Type", "application/json");
        const comment = {
            "author": this.props.currentUser,
            "text": description,
            "parentId": null,
            "discussionId": "",
            "extra_data": null,
            "timestamp": null,
            "depth": 0
        };
        xhr.send(JSON.stringify({
            title: title,
            categories: [],
            root_comment_dict: comment,
            configuration: this.configuration
        }));
    };


    updateVisibility = (isOpen) => {
        this.props.updateVisibility(isOpen);
    };


    render() {
        return (
            <Modal visible={ this.props.isOpen } >
                <div className="modal-header" >
                    <h5 className="modal-title" >Create New Discussion</h5 >
                </div >
                <div className="modal-body">
                    <div >
                        <p className="title" >Title:</p >
                        <input
                            type="text" className={"title-input " + this.state.directionClass} value={this.state.title} name="title"
                            placeholder="Enter Title" onChange={this.handleChange.bind(this)} />
                        <p > {this.state.titleError} </p >
                    </div >
                    <div >
                        <p className="description" >First Message:</p >
                        <textarea
                            className={"description-input " + this.state.directionClass} name="description" value={this.state.description}
                            placeholder={"Write Something"} onChange={this.handleChange.bind(this)}
                        />
                        <p > { this.state.descriptionError } </p >
                    </div >
                    <div >
                        <label className="config mt-2" >Visualization Config:</label >
                        <div >
                            <CheckBox
                                changeHandler={()=> {this.vizConfigChange("graph")}} type="graph" text="Graph"
                                checked={ this.state.graphChecked } />
                            <CheckBox
                                changeHandler={ ()=> {this.vizConfigChange("statisticsUser")} } type="statisticsUser" text="User Stats"
                                checked={ this.state.statsUserChecked } />
                            <CheckBox
                                changeHandler={()=> {this.vizConfigChange("statisticsDiscussion")} } type="statisticsDiscussion"
                                text="Discussion Stats"
                                checked={ this.state.statsDiscussionChecked } />
                            <CheckBox
                                changeHandler={()=> {this.vizConfigChange("alerts")}} type="alerts" text="Alerts"
                                checked={this.state.alertsChecked} />
                        </div>
                        <div className="dropdown mt-2" >
                            <label >Language: </label >
                            <button
                                className="btn btn-sm btn-primary dropdown-toggle" type="button"
                                id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false" >
                                {this.state.language}
                            </button >
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                                <a
                                    href='/#' onClick={() => { this.languageChange("English") }}
                                    className="dropdown-item" >English</a >
                                <a
                                    href='/#' onClick={() => { this.languageChange("Hebrew") }}
                                    className="dropdown-item" >Hebrew</a >
                            </div >
                        </div >
                    </div >
                </div >
                <div className="modal-footer" >
                    <button
                        type="button" onClick={ () => this.updateVisibility(false) }
                        className="btn btn-grey" >Cancel
                    </button >
                    <button
                        className="btn btn-info"
                        onClick={ this.createDiscussion } >Create
                    </button >
                </div >
            </Modal >
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        token: state.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogOut: () => dispatch({type: 'LOGOUT'})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiscussionModal);
