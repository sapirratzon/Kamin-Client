import React from "react";


const Alert = (props) => {
    return (
        <li id="alert">
            <p><i class="fas fa-exclamation-triangle"></i>{props.text}</p>
        </li>
    );
}

export default Alert;
