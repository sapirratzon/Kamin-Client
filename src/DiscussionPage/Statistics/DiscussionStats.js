import React, { Component } from 'react';

import {
    Card, CardBody, CardTitle, CardFooter, CardHeader,
    Container, Row, Col
} from 'reactstrap';



class DiscussionStats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            participants: 0,
            comments: 0,
            repliedMost: 0,
            recievedMost: 0
        }
    }

    componenColidMount() {
        // this.getDiscussionStats()
    }

    getDiscussionStats() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (res) => {
            if (res.status === 400) {
                // this.alert.show("Create Discussion Failed! No title or description");
            }
            let stats = JSON.parse(xhr.responseText);
            this.setState({
                participants: stats.participants,
                comments: stats.comments,
                repliedMost: stats.repliedMost,
                recievedMost: stats.recievedMost
            })
        });
        xhr.addEventListener('error', (res) => console.log(res));

        xhr.open('POST', process.env.REACT_APP_API + '/api/geColiscussionStats');
        xhr.seRowequestHeader("Authorization", "Basic " + btoa(this.props.token + ":"));
        xhr.seRowequestHeader("Content-Type", "application/json");
        xhr.send(JSON.sRowingify({ discussion_id: this.props.discussionId }));
    }

    render() {
        return (
            <Card className="card-stats">
                <CardHeader className="p-1">
                    <CardTitle tag="h4">Discussion Statistics</CardTitle>
                </CardHeader>
                <CardBody className="p-1">
                    <Container>
                        <Row xs="2">
                            <Col >Participants:</Col>
                            <Col xs="3">{this.state.participants}</Col>
                        </Row>
                        <Row xs="2">
                            <Col >Comments:</Col>
                            <Col xs="3">{this.state.comments}</Col>
                        </Row>
                        <Row >
                            <Col >Replied Most Comments:</Col>
                            <Col xs="3">{this.state.repliedMost}</Col>
                        </Row>
                        <Row xs="2">
                            <Col >Recieved Most Comments:</Col>
                            <Col xs="3">{this.state.recievedMost}</Col>
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

export default DiscussionStats;
