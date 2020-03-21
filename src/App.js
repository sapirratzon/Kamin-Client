import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import './App.css';
import HomePage from "./HomePage";
import Discussion from "./DiscussionPage/Discussion"
import NavigationBar from "./NavigationBar/NavigationBar"
import Login from './LoginPage/Login'
import Registration from './RegistrationPage/Registration'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Route component={NavigationBar} />
                    <div className="content">
                        <Route exact path="/" component={HomePage} />
                        <Route path="/Discussion/:isSimulation"
                            render={(props) => <Discussion {...props} isSimulation={props.match.params.isSimulation} />} />
                        <Route path="/login/" component={Login} />
                        <Route path="/registration/" component={Registration} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;