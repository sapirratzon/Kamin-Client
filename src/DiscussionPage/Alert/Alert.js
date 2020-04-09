import React from "react";
import {Card,CardHeader,CardBody,CardTitle} from "reactstrap"

const Alert = (props) => {
    return (
        // <li id="alert">
        //     <p><i className="fas fa-exclamation-triangle"/>{props.text}</p>
        // </li>
        <Card className="card-stats" style={{ border: '3px solid #4285f4' }}>
            <CardHeader className="p-1">
                <CardTitle tag="h4">Moderation Alerts</CardTitle>
            </CardHeader>
            <CardBody className="p-1">
                <li id="alert">
                    <p><i className="fas fa-exclamation-triangle" />{props.text}</p>
                </li>

            </CardBody>
            {/* <CardFooter>
                    <div className="stats">
                        <i className="now-ui-icons ui-2_time-alarm" /> Last 7 days
                  </div>
                </CardFooter> */}
        </Card>
    );
}

export default Alert;
