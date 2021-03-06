import React, { Component } from 'react';
import './RegisterPage.css'

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                username: '',
                password: '',
                firstName: '',
                lastName: ''
            },
            usernameError: '',
            passwordError: '',
            failureError: '',
            submitted: false,
            registered: false
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        const regex = RegExp('^[A-Za-z0-9]+$');
        if (name === 'username') {
            if (!regex.test(value)) {
                this.setState({
                    usernameError: 'Invalid Username, only letters and numbers are allowed, no spaces.'
                });
            }
            else {
                this.setState({
                    usernameError: ''
                })
            }
        } else if (name === 'password') {
            if (!regex.test(value)) {
                this.setState({
                    passwordError: 'Invalid password, only letters and numbers are allowed, no spaces.'
                });
            }
            else {
                this.setState({
                    passwordError: ''
                })
            }
        }
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ submitted: true });
        const { user } = this.state;
        if (this.state.usernameError !== "" || this.state.passwordError !== "") {
            return
        }
        if (user.username.length < 6) {
            this.setState({
                usernameError: 'Username must be of minimum 6 characters length'
            });
            return;
        }
        if (user.password.length < 8) {
            this.setState({
                passwordError: 'Password must be of minimum 8 characters length'
            });
            return;
        }


        if (user.firstName && user.lastName && user.username && user.password) {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', res => {
                if (res.target.status === 200) {
                    this.setState({
                        registered: true,
                        failureError:""
                    });
                    setTimeout(() => this.props.history.push('/login/'), 2000);
                }
            });
            xhr.addEventListener("error", () => {
                this.setState({
                    failureError: "Registration failed, Username is taken, choose a different Username "
                })
            });
            xhr.onreadystatechange = () => {
                if (xhr.status === 400) {
                    this.setState({
                        failureError: "Registration failed, Username is taken, choose a different Username "
                    })
                }
            };
            xhr.open('POST', process.env.REACT_APP_API + '/api/newUser');
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({
                username: user.username,
                password: user.password,
                first_name: user.firstName,
                last_name: user.lastName
            }));
        }
    };

    render() {
        const { user, submitted, registered } = this.state;
        return (
            <React.Fragment >
                <div className="container col-md-2 p-5" >
                    <h2 >Register</h2 >
                    <form name="form" onSubmit={this.handleSubmit} >
                        <div className={'form-group' + (submitted && !user.username ? ' has-error' : '')} >
                            {/*<label htmlFor="username" >Username</label >*/}
                            <input
                                type="text" className="form-control" name="username" value={user.username}
                                placeholder="Username"
                                onChange={this.handleChange} />
                            <div className="help-block text-danger" >{this.state.usernameError}</div >
                            {submitted && !user.username &&
                                <div className="help-block text-danger" >Username is required</div >
                            }
                        </div >
                        <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')} >
                            {/*<label htmlFor="password" >Password</label >*/}
                            <input
                                type="password" className="form-control" name="password" value={user.password}
                                placeholder="Password"
                                onChange={this.handleChange} />
                            <div className="help-block text-danger" >{this.state.passwordError}</div >
                            {submitted && !user.password &&
                                <div className="help-block text-danger" >Password is required</div >
                            }
                        </div >
                        <div className={'form-group' + (submitted && !user.firstName ? ' has-error' : '')} >
                            {/*<label htmlFor="firstName" >First Name</label >*/}
                            <input
                                type="text" className="form-control" name="firstName" value={user.firstName}
                                placeholder="First Name"
                                onChange={this.handleChange} />
                            {submitted && !user.firstName &&
                                <div className="help-block text-danger" >First Name is required</div >
                            }
                        </div >
                        <div className={'form-group' + (submitted && !user.lastName ? ' has-error' : '')} >
                            {/*<label htmlFor="lastName" >Last Name</label >*/}
                            <input
                                type="text" className="form-control" name="lastName" value={user.lastName}
                                placeholder="Last Name"
                                onChange={this.handleChange} />
                            {submitted && !user.lastName &&
                                <div className="help-block text-danger" >Last Name is required</div >
                            }
                        </div >
                        <div className="form-group register-btn" >
                            <button className="btn btn-primary" >Register</button >
                        </div >
                    </form >
                </div >
                <h3 className="text-center text-danger" >{this.state.failureError}</h3 >
                {registered ?
                    <h3 className="text-center text-success " ><b >Registered successfully! Redirecting to the login
                                                                   page.</b ></h3 > : null}
            </React.Fragment >
        );
    }
}

export default Registration;
