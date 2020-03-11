import React, { Component } from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import './App.css';
import HomePage from "./HomePage";
import Discussion from "./DiscussionPage/Discussion"

class App extends Component {
    render(props){
        return(
            <BrowserRouter>
                <div className="App">
                    <div className="content">
                        <Route exact path="/" component={HomePage} />
                        <Route path="/Discussion/:isSimulation"
                               render={(props) => <Discussion {...props} isSimulation={props.match.params.isSimulation} />}/>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;