import React from 'react';
import Alert from "./Alert";
import "./Alerts.css";

const AlertList = (props) => {
    return (
        <ul id="alerts-list" className="mt-2">
            {props.alerts.map((a, i) => <Alert key={i} text={a.text}/>)}
        </ul>
    );
};

export default AlertList;