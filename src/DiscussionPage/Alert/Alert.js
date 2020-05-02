import React from "react";

const Alert = (props) => {
    const names = getUsernames(props.alert);
    return (
        <li >
            <div id="messageCollapse" className="card border-warning small-font mt-2" >
                <div className="card-header  p-1 username">
                    <i className="fas fa-exclamation-triangle" />{" "}{getDate(props.alert.timestamp)} {props.alert.comment_type === "alert" &&
                        ` | Sent to: ${getUsernames(props.alert)} `
                    }
                </div >
                <div className="text  ml-2" >
                    {props.alert.text}
                </div >
            </div >
        </li >


    );
};

const getUsernames = (alert) => {
    // if (commentNode["node"]["extra_data"]["recipients_type"] === 'all' ||
    // this.props.currentUser in commentNode["node"]["extra_data"]["users_list"] ||
    let usernames = ""
    if (alert["extra_data"]["recipients_type"] === 'all') {
        return " All Participants";
    }
    let index = 0;
    let users = alert["extra_data"]["users_list"];
    const size = Object.keys(users).length;
    for (const name of Object.keys(users)) {
        usernames += name;
        index += 1;
        if (index < size) {
            usernames += ", "
        }
    }
    return usernames;
}

const getDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
};

export default Alert;
