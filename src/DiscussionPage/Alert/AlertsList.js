import React from 'react';
import Alert from "./Alert";
import "./Alerts.css";
import { Card, CardBody, CardTitle, CardHeader, Container } from 'reactstrap';

const AlertList = (props) => {
    return (
        <Card className="card-stats alerts-window" >
            <CardHeader className="p-1" >
                <CardTitle tag="h4" >
                    {props.allowHide && <a href="#presentAlerts" data-toggle="collapse" onClick={props.handleHide}><i className="fa fa-angle-down" /></a>}
                    Moderation Alerts
                    </CardTitle >
            </CardHeader >
            <CardBody className="p-1" >
                <Container >
                    <ul id="alerts-list" >
                        {props.alerts.map((a) => <Alert key={a.id} alert={a} directionClass={props.directionClass} onClick={() => props.handleClick(a.parentId)}/>)}
                    </ul >
                </Container >
            </CardBody >
        </Card >
    );
};

export default AlertList;
