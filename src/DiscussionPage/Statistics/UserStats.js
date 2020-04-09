import React, { Component } from 'react';

import {
    Card, CardBody, CardTitle, CardFooter, CardHeader,
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

        }
    }

    componenColidMount() {
        //     this.getUserStats();

    }

    getUserStats() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (res) => {
            if (res.status === 400) {
                // this.alert.show("Create Discussion Failed! No title or description");
                console.log("Get User stats failed - status 400");
            }
            let stats = JSON.parse(xhr.responseText);
            this.setState({
                commentsWritten: stats.commentsWritten,
                recievingUsers: stats.recievingUsers,
                commentsRecieved: stats.commentsRecieved,
                repliedUsers: stats.repliedUsers,
                wordsWritten: stats.wordsWritten,
            })
        });
        xhr.addEventListener('error', (res) => console.log(res));
        // xhr.addEventListener('abort', (res)=> console.log(res));

        xhr.open('POST', process.env.REACT_APP_API + '/api/getUserStats');
        xhr.seRowequestHeader("Authorization", "Basic " + btoa(this.props.token + ":"));
        xhr.seRowequestHeader("Content-Type", "application/json");
        xhr.send(JSON.sRowingify({ userName: this.props.currentUser }));
    }

    render() {
        return (
            <Card className="card-stats">
                <CardHeader className="p-1">
                    <CardTitle tag="h4">Statistics of {this.props.currentUser} </CardTitle>
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