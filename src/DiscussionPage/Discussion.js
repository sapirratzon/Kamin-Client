import React, { Component } from "react";
import "./Discussion.css";
import Chat from "./Chat/Chat";
import Simulation from "./Simulation/Simulation";
import Graph from "./Graph/Graph";
import AlertList from "./Alert/AlertsList";
import UserStats from "./Statistics/UserStats";
import DiscussionStats from "./Statistics/DiscussionStats";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import io from "socket.io-client";
import VisualizationsModal from "./Modals/VisualizationsConfigModal";
import Loader from "react-loader-spinner";

class Discussion extends Component {
    constructor(props) {
        super(props);
        this.socket = io(process.env.REACT_APP_API);
        this.lastMessage = {};
        this.defaultConfig = {};
        this.state = {
            shownMessages: [],
            shownNodes: [],
            shownLinks: [],
            shownAlerts: [],
            allAlerts: [],
            discussionId: this.props.simulationCode,
            showVisualizationSettingsModal: false,
            title: "",
            selectedUser: "",
            lastMessage: {},
            graph: true,
            alerts: true,
            statistics: true,
            isLoading: false,
        };
    }

    componentDidMount() {
        this.setState({isLoading: true});
        this.socket.on("unauthorized", () => {
            this.props.onLogOut();
            this.props.history.push("/");
        });

        this.socket.on("end_session", () => {
            this.props.history.push("/");
        });

        this.socket.on("error", (response) => {
            console.log({response});
        });
        this.socket.on("new configuration", (response) => {
            this.handleNewConfig(response);
        });
        if (this.props.userType !== 'USER')
            this.setState({
                graph: true,
                alerts: true,
                statistics: true,
            });
    }

    setDefaultVisualConfig = (discussionVisualConfig, userVisualConfig) => {
        if (this.props.userType === 'USER') {
            this.setState({
                graph: userVisualConfig['graph'],
                alerts: userVisualConfig['alerts'],
                statistics: userVisualConfig['statistics'],
                discussionVisualConfig: discussionVisualConfig,
            });
        }
    };

    setCurrentConfig = () => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("load", (response) => {
            const configuration = JSON.parse(xhr.responseText)["config"][
                this.props.currentUser
                ];
            this.setState({
                graph: configuration["graph"],
                alerts: configuration["alerts"],
                statistics: configuration["statistics"],
            });
        });
        xhr.open(
            "GET",
            process.env.REACT_APP_API +
            "/api/getActiveUsersConfigurations/" +
            this.state.discussionId
        );
        xhr.send();
    };

    setModeratorSettings = (element, toShow) => {
        this.setState({
            [element]: toShow,
        });
    };

    updateLastMessage = (message) => {
        this.lastMessage = message;
    };

    updateMessagesHandler(newMessages, newNodes, newLinks, lastMessage) {
        const newAlerts = [];
        this.state.allAlerts.forEach((a) => {
            newAlerts.push(a);
        });
        this.setState({
            shownMessages: newMessages,
            shownNodes: newNodes,
            shownLinks: newLinks,
            shownAlerts: newAlerts,
            lastMessage: lastMessage,
        });
    }

    updateAlertsHandler(newAlert) {
        this.state.allAlerts.push(newAlert);
    }

    updateSelectedUserHandler(username) {
        this.setState({selectedUser: username});
    }

    setTitle = (title) => {
        this.setState({
            title: title,
        });
    };

    handleShareClick = () => {
        let dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.setAttribute("value", this.state.discussionId);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    };

    getSelectedUser() {
        return this.state.selectedUser;
    }

    getShownMessages() {
        return this.state.shownMessages;
    }

    getShownLinks() {
        return this.state.shownLinks;
    }

    getShownNodes() {
        return this.state.shownNodes;
    }

    updateModalHandler = (isOpen) => {
        this.setState({
            showVisualizationSettingsModal: isOpen,
        });
    };

    handleVisualizationSettings = (settings) => {
        this.setState({
            graph: settings.graph,
            alerts: settings.alerts,
            statistics: settings.statistics,
        });
    };

    handleEndSession = () => {
        const data = {
            token: this.props.token,
            discussionId: this.state.discussionId,
        };
        this.socket.emit("end_session", data);
    };

    handleNewConfig = (response) => {
        for (let setting in response) {
            this.setState({[setting]: response[setting]});
        }
    };

    handleFinishLoading = () => {
        this.setState({isLoading: false});
    };

    handleHideInsight = (insight) => {
        if (insight === 'graph') {
            this.setState({graph: false});
        } else if (insight === 'alerts') {
            this.setState({alerts: false});
        } else if (insight === 'stat') {
            this.setState({statistics: false});
        }
    };

    handleShowInsight = (insight) => {
        if (insight === 'graph') {
            this.setState({graph: true});
        } else if (insight === 'alerts') {
            this.setState({alerts: true});
        } else if (insight === 'stat') {
            this.setState({statistics: true});
        }
    };

    render() {
        return (
            <div className="App" >
                { this.state.isLoading && (
                    <Loader className="mt-5 text-center" type="TailSpin" color="#007bff" height={ 300 } width={ 300 } />
                ) }
                <React.Fragment >
                    <div className="row text-center" >
                        { !this.state.isLoading &&
                        <React.Fragment >
                                <span className="col-4" >
                                    { (this.props.userType === "MODERATOR" || this.props.userType === "ROOT") &&
                                    this.props.isSimulation === "false" ?
                                        <button
                                            type="button" className="btn btn-danger btn-sm"
                                            onClick={ this.handleEndSession } >
                                            End Session
                                        </button >
                                        : null }
                                </span >
                            <span className="col-4" >
                                          <h3 >
                                            <b >{ this.state.title }</b >
                                            <i
                                                className="fas fa-share-square text-primary pl-2 cursor-pointer"
                                                data-tip="Copied!" data-event="click" />
                                              { this.props.userType === "MODERATOR" ||
                                              this.props.userType === "ROOT" ?
                                                  <i
                                                      className="fas fa-cog cursor-pointer"
                                                      onClick={ () => this.updateModalHandler(true) } />
                                                  : null }
                                          </h3 >
                                    <ReactTooltip eventOff="mousemove" afterShow={ this.handleShareClick } />
                                { (this.props.userType === "MODERATOR" || this.props.userType === "ROOT") &&
                                <VisualizationsModal
                                    isOpen={ this.state.showVisualizationSettingsModal }
                                    discussionId={ this.state.discussionId }
                                    updateVisibility={ this.updateModalHandler.bind(this) }
                                    isSimulation={ this.props.isSimulation === "true" }
                                    lastMessage={ this.state.lastMessage }
                                    defaultConfig={ this.defaultConfig }
                                    socket={ this.socket }
                                    setModeratorSettings={ () => this.setModeratorSettings.bind(this) }
                                />
                                }
                                </span >
                        </React.Fragment >
                        }
                        <span className="col-4" >
                            { this.props.isSimulation === "true" &&
                            <Simulation
                                messagesHandler={ this.updateMessagesHandler.bind(this) }
                                alertsHandler={ this.updateAlertsHandler.bind(this) }
                                discussionId={ this.props.simulationCode }
                                setTitle={ this.setTitle }
                                messagesOrder={ "chronological" }
                                nodeColor={ intToRGB }
                                socket={ this.socket }
                                updateLastMessage={ this.updateLastMessage.bind(this) }
                                isLoading={ this.state.isLoading }
                                handleFinishLoading={ this.handleFinishLoading }
                                updateVisualConfig={ this.setDefaultVisualConfig }
                            />
                            }
                        </span >
                    </div >
                    { !this.state.isLoading && <hr /> }
                    <div className="row content mr-3 ml-1" >
                        <div className="discussion-col col-lg-6 col-md-12 px-1" >
                            <Chat
                                messages={ this.state.shownMessages }
                                isSimulation={ this.props.isSimulation === "true" }
                                messagesHandler={ this.updateMessagesHandler.bind(this) }
                                alertsHandler={ this.updateAlertsHandler.bind(this) }
                                discussionId={ this.props.simulationCode }
                                updateSelectedUser={ this.updateSelectedUserHandler.bind(this) }
                                setTitle={ this.setTitle }
                                nodeColor={ intToRGB }
                                socket={ this.socket }
                                isLoading={ this.state.isLoading }
                                handleFinishLoading={ this.handleFinishLoading }
                                updateVisualConfig={ this.setDefaultVisualConfig }
                            />
                        </div >
                        { !this.state.isLoading &&
                        <div className="discussion-col col-lg-6 col-md-12" >
                            <div
                                id="presentGraph"
                                className={ (this.state.graph ? "show" : "") + " collapse graph row blue-border mb-1" } >
                                { this.state.shownMessages.length > 0 &&
                                <Graph
                                    nodes={ this.state.shownNodes }
                                    links={ this.state.shownLinks }
                                    currentUser={ this.props.currentUser }
                                    updateSelectedUser={ this.updateSelectedUserHandler.bind(this) }
                                    rootId={ this.state.shownMessages[0]["author"] }
                                    handleHide={ () => this.handleHideInsight('graph') }
                                    allowHide={ this.props.userType !== 'USER' }
                                />
                                }
                            </div >
                            { (!this.state.graph && this.props.userType !== 'USER') && <a
                                href="#presentGraph" data-toggle="collapse"
                                onClick={ () => this.handleShowInsight('graph') } ><h4 ><i
                                className="fa fa-angle-up p-2" />Graph</h4 ></a > }
                            <div className="row insights" >
                                <div
                                    id="presentStat"
                                    className={ (this.state.statistics ? "show" : "") + " collapse col-lg-4 col-md-12 p-0 blue-border mr-1" } >
                                    <UserStats
                                        className="stats"
                                        getSelectedUser={ this.getSelectedUser.bind(this) }
                                        discussionId={ this.state.discussionId }
                                        getShownMessages={ this.getShownMessages.bind(this) }
                                        getShownLinks={ this.getShownLinks.bind(this) }
                                        getShownNodes={ this.getShownNodes.bind(this) }
                                        handleHide={ () => this.handleHideInsight('stat') }
                                        allowHide={ this.props.userType !== 'USER' }
                                    />
                                    <DiscussionStats
                                        className="stats h-50"
                                        discussionId={ this.state.discussionId }
                                        getShownMessages={ this.getShownMessages.bind(this) }
                                        getShownLinks={ this.getShownLinks.bind(this) }
                                        getShownNodes={ this.getShownNodes.bind(this) }
                                    />
                                </div >
                                { (!this.state.statistics && this.props.userType !== 'USER') && <a
                                    href="#presentStat" data-toggle="collapse"
                                    onClick={ () => this.handleShowInsight('stat') } ><h4 ><i
                                    className="fa fa-angle-up p-2" />Statistics</h4 ></a > }
                                <div
                                    id="presentAlerts"
                                    className={ (this.state.alerts ? "show" : "") + " collapse col p-0 blue-border" } >
                                    <AlertList
                                        alerts={ this.state.shownAlerts }
                                        handleHide={ () => this.handleHideInsight('alerts') }
                                        allowHide={ this.props.userType != 'USER' } />
                                </div >
                                { (!this.state.alerts && this.props.userType !== 'USER') && <a
                                    href="#presentAlerts" data-toggle="collapse"
                                    onClick={ () => this.handleShowInsight('alerts') } ><h4 ><i
                                    className="fa fa-angle-up p-2" />Alerts</h4 ></a > }
                            </div >
                        </div >
                        }
                    </div >
                </React.Fragment >
            </div >
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
    const c = (hashCode(i) & 0x00ffffff).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        userType: state.userType,
        token: state.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogOut: () => dispatch({type: "LOGOUT"}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Discussion);
