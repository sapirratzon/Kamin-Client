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

    componentDidMount() {
        this.getDiscussionStats()
    }

    getDiscussionStats() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', (res) => {
            if (res.status === 400) {
                // this.alert.show("Create Discussion Failed! No title or description");
                console.log("Get discussion stats failed - status 400");
            }
            let stats = JSON.parse(xhr.responseText);
            this.setState({
                participants: stats.num_of_participants,
                comments: stats.total_comments_num,
                repliedMost: stats.max_commented_user,
                recievedMost: stats.max_responded_user
            })
        });
        xhr.addEventListener('error', (res) => console.log(res));
        // xhr.addEventListener('abort', (res)=> console.log(res));

        xhr.open('POST', process.env.REACT_APP_API + '/api/getDiscussions/'+this.props.discussionId);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(this.props.token + ":"));
        xhr.send();
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
