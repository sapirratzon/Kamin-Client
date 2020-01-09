import React from 'react';
import "./Navigation.css"

const NavigationBar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-1">
            <div className="container-fluid px-5">
                <a className="navbar-brand" href="/"><i className="fas fa-dungeon pr-2"/>Kamin</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/"><i className="fas fa-sign-in-alt pr-2"/>Sign
                            In <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/"><i className="fas fa-user-plus pr-2"/>Sign
                            Up <span className="sr-only">(current)</span></a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;