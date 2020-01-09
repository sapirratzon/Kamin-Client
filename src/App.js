import React, { Component } from 'react';
import './App.css';
import NavigationBar from "./NavigationBar/NavigationBar";
import Discussion from "./DiscussionPage/Discussion"

class App extends Component {

    render() {
        return (
            <div className="App">
                <NavigationBar />
                <Discussion />
            </div>
        );
    }
}

export default App;