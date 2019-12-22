import React,{Component} from "react";
import Message from './Message';

class Messages extends Component {
    render() {
        const {messages} = this.props;
        return (
            <ul className="Messages-list">
                {messages.map((m, i) => <Message key={i} member={m.member} text={m.text} depth={m.depth}/>)}
            </ul>

        );
    }
}

export default Messages;
