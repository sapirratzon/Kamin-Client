import React, { Component } from 'react';
import {BrowserRouter, Route} from "react-router-dom";
// import './App.css';
import HomePage from "./HomePage";
import Discussion from "./DiscussionPage/Discussion"

class App extends Component {
    render(){
        return(
            <BrowserRouter>
                <div className="App">
                    <div className="content">
                        <Route exact path="/" component={HomePage} />
                        <Route path="/Discussion" component={Discussion} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;