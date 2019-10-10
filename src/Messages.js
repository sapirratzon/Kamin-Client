import {Component} from "react";
import React from "react";

class Messages extends Component {
  render() {
    const {messages} = this.props;
    return (
      <ul className="Messages-list">
        {messages.map(m => Messages.renderMessage(m))}
      </ul>

    );
  }

  static renderMessage(message) {
    const {member, text} = message;
    return (
      <li className="Messages-message">
      <span
        className="avatar"
        style={{backgroundColor: member.color}}
      />
        <div className="Message-content">
          <div className="username">
            {member.username}
          </div>
          <div className="text">{text}</div>
        </div>
      </li>
    );
  }
}

export default Messages;
