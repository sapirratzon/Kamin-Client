import React, {Component} from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import HomePage from "./HomePage";
import Discussion from "./DiscussionPage/Discussion"


class App extends Component {
    constructor(props){
        super(props);
        this.state={
            isSimulation: false
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <div className="content">“
                        <Route exact path="/" updateIsSimulation2={this.updateIsSimulation.bind(this)} isSimulation={this.state.isSimulation} component={HomePage}>
                        </Route>
                        <Route path="/Discussion" >
                            <Discussion isSimulation={this.state.isSimulation} />
                        </Route>
                    </div>
                </div>
            </BrowserRouter>
        );
    }

    updateIsSimulation () {
        this.setState({
            isSimulation: true
        })
    }
}

export default App;