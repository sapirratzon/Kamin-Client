import React, { Component } from 'react';
import { connect } from 'react-redux'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            submitted: false,
            loginMessage: ''
        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ submitted: true });
        const { username, password } = this.state;
        if (username && password) {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', () => {
                let token = JSON.parse(xhr.responseText)['token'];
                this.props.onLogin(username, token);
                setTimeout(() => this.props.history.push('/'), 2000);
                this.setState({
                    loginMessage: 'Login successfully! Redirecting to the homepage.',
                })
            });
            xhr.addEventListener('progress', () => {
                this.setState({
                    loginMessage: 'Incorrect username or password',
                })
            });
            xhr.open('GET', 'http://localhost:5000/api/login');
            xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
            xhr.send(JSON.stringify());
        }
    }

    render() {
        const { username, password, submitted } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Login</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Login</button>
                    </div>
                </form>
                {submitted ? <h4>{this.state.loginMessage}</h4> : null}
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, token) => dispatch({ type: 'LOGIN', payload: { username: username, token: token } })
    };
};

export default connect(null, mapDispatchToProps)(Login);