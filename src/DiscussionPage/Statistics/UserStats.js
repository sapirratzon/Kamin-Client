import React, { Component } from 'react';

import {
    Card, CardBody, CardTitle, CardHeader,
    Container, Row, Col
} from 'reactstrap';
import { connect } from 'react-redux'



class UserStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentsWritten: 0,
            recievingUsers: 0,
            commentsRecieved: 0,
            repliedUsers: 0,
            wordsWritten: 0,
            username: ""
        }
    }

    componentDidMount() {
        this.getUserStats();
    }

    getUserStats() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (res) => {
            if (res.status === 400) {
                // this.alert.show("Create Discussion Failed! No title or description");
                console.log("Get User stats failed - status 400");
            }
            let stats = JSON.parse(xhr.responseText)["user_in_discussion_statistics"];
            this.setState({
                commentsWritten: stats.num_of_comments,
                recievingUsers: stats.num_of_commented_users,
                commentsRecieved: stats.num_of_responses,
                repliedUsers: stats.responded_users,
                wordsWritten: stats.total_words,
            })
        });
        xhr.addEventListener('error', (res) => console.log(res));
        // xhr.addEventListener('abort', (res)=> console.log(res));

        xhr.open('POST', process.env.REACT_APP_API + '/api/getUserStatisticsInDiscussion');
        xhr.setRequestHeader("Authorization", "Basic " + btoa(this.props.token + ":"));
        xhr.setRequestHeader("Content-Type", "application/json");
        if (this.props.username) {
            xhr.send(JSON.stringify({ username: this.props.username, discussionId: this.props.discussionId }));
            this.setState({ username: this.props.username })
        } else {
            xhr.send(JSON.stringify({ username: this.props.currentUser, discussionId: this.props.discussionId }));
            this.setState({ username: this.props.currentUser })
        }
    }

    render() {
        return (
            <Card className="card-stats">
                <CardHeader className="p-1">
                    <CardTitle tag="h4">Statistics of {this.state.username} </CardTitle>
                </CardHeader>
                <CardBody className="p-1">
                    <Container>
                        <Row xs="2">
                            <Col >Comments Written:</Col>
                            <Col >{this.state.commentsWritten}</Col>
                        </Row>
                        <Row xs="2">
                            <Col >Recieving Users:</Col>
                            <Col >{this.state.recievingUsers}</Col>
                        </Row>
                        <Row xs="2">
                            <Col >Comments Recieved:</Col>
                            <Col >{this.state.commentsRecieved}</Col>
                        </Row>
                        <Row xs="2">
                            <Col >Users Replied:</Col>
                            <Col >{this.state.repliedUsers}</Col>
                        </Row>
                        <Row xs="2">
                            <Col >Words Written:</Col>
                            <Col >{this.state.wordsWritten}</Col>
                        </Row>
                    </Container>
                </CardBody>
                {/* <CardFooter>
                    <div className="stats">
                        <i className="now-ui-icons ui-2_time-alarm" /> Last 7 days
                  </div>
                </CardFooter> */}
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser,
        userType: state.userType
    };
};

export default connect(mapStateToProps)(UserStats);