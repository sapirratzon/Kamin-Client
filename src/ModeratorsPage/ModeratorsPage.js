import React, { Component } from 'react';
import { connect } from 'react-redux'

class Moderators extends Component {
    render() {
        return (
            <div className="container col-md-6 p-5">
                <h2 className="text-center">Moderators Management</h2>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, token, userType) => dispatch({ type: 'LOGIN', payload: { username: username, token: token, userType: userType } })
    };
};

export default connect(null, mapDispatchToProps)(Moderators);