import React, { Component } from 'react';
import { connect } from 'react-redux'
import './NavigationBar.css';
import { Link } from "react-router-dom";

class NavigationBar extends Component {

    logOut=(e) => {
        e.preventDefault();
        this.props.onLogOut();
    };

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-1 sticky-top" >
                <div className="container-fluid px-5" >
                    <Link to={ '/' } ><a className="navbar-brand" href="/" ><i
                        className="fas fa-dungeon pr-2" />Kamin</a ></Link >
                    <button
                        className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation" >
                        <span className="navbar-toggler-icon" />
                    </button >

                    <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                        <ul className="navbar-nav mr-auto" >
                            <li className="nav-item active" >
                                <Link to={ '/' } ><a className="nav-link" href="/" >Home <span
                                    className="sr-only" >(current)</span ></a ></Link >
                            </li >
                        </ul >
                        { this.props.currentUser ?
                            <ul className="navbar-nav ml-auto" >
                                <li className="nav-item" >
                                    <Link to={ '/' } ><a className="nav-link" >Welcome, { this.props.currentUser }!<span
                                        className="sr-only" >(current)</span ></a ></Link >
                                </li >
                                <li className="nav-item" onClick={ this.logOut } >
                                    <Link to={ '/' } ><a className="nav-link" ><i
                                        className="fas fa-sign-out-alt pr-2" />Log Out<span
                                        className="sr-only" >(current)</span ></a ></Link >
                                </li >
                            </ul >
                            : <ul className="navbar-nav ml-auto" >
                                <li className="nav-item" >
                                    <Link to={ 'login' } ><a className="nav-link" ><i
                                        className="fas fa-sign-in-alt pr-2" />Sign In<span
                                        className="sr-only" >(current)</span ></a ></Link >
                                </li >
                                <li className="nav-item" >
                                    <Link to={ 'registration' } ><a className="nav-link" href='/' ><i
                                        className="fas fa-user-plus pr-2" />Sign Up <span
                                        className="sr-only" >(current)</span ></a ></Link >
                                </li >
                            </ul > }
                    </div >
                </div >
            </nav >
        );
    };
}

const mapStateToProps=state => {
    return {
        currentUser: state.currentUser
    };
};

const mapDispatchToProps=(dispatch) => {
    return {
        onLogOut: () => dispatch({type: 'LOGOUT'})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
