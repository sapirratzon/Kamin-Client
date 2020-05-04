import { Component } from "react";
import React from "react";

class Input extends Component {
    state = {
        text: ""
    };

    onChange(e) {
        this.setState({ text: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSendMessage(this.state.text);
        this.setState({ text: "" });
    }

    render() {
        return (
            <div className="pt-3 row input-group mb-3 ml-4" style={{ "width": "90%" }}>
                <textarea
                    className="text-box col-12 " rows="5" onChange={e => this.onChange(e)} type="text" style={{ "maxHeight": "20%" }}
                    placeholder={this.props.placeHolder} value={this.state.text} autoFocus={true} />
                <div>
                    <button
                        type="button" className="btn btn-outline-primary waves-effect btn-sm"
                        onClick={this.onSubmit.bind(this)} >Send
                    </button >
                </div>
            </div >

        );
    }
}

export default Input;
