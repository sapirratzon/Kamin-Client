import React from "react";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
const Alert = (props) => {
    return (
        <li id="alert">
            <p><i className="fas fa-exclamation-triangle" />{props.text}</p>
        </li>
    );
}

export default Alert;
