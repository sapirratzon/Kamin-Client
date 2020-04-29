import React from "react";

const Alert = (props) => {
    return (
        <li id={ props.key } >
            <p ><i className="fas fa-exclamation-triangle" />{ props.text }</p >
        </li >
    );
};

export default Alert;
