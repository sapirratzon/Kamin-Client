import React from "react";
import Message from './Message';


const Messages = (props) => {
    return (
        <ul className="Messages-list">
            {props.messages.map((m, i) => <React.Fragment>
                <Message key={i} username={m.author} color={m.color} text={m.text} timestamp={m.timestamp}
                         depth={m.depth} id={m.id} isSimulation={props.isSimulation}
                         newMessageHandler={props.newMessageHandler} newAlertHandler={props.newAlertHandler}/></React.Fragment>)}
        </ul>
    );
}

export default Messages;
