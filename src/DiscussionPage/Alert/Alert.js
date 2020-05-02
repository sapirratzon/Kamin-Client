import React from "react";

const Alert = (props) => {
    const getUsernames = (alert) => {
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

    const names = getUsernames(props.alert);
    return (
        <li >
            <div id="messageCollapse" className={(props.alert.comment_type === 'alert' ? 'border-warning' : 'border-info') + " card small-font mt-2"} >
                <div className="card-header  p-1 username">
                    <i className={props.alert.comment_type === 'alert' ? 'fas fa-exclamation-triangle' : 'fas fa-user-cog'} />{" "}{getDate(props.alert.timestamp)} {props.alert.comment_type === "alert" &&
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



export default Alert;
