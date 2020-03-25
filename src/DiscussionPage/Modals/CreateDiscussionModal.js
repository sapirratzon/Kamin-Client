import React, { Component } from 'react';
import { connect } from 'react-redux'
import Modal from 'react-bootstrap4-modal';
import "./CreateDiscussionModal.css"
import io from "socket.io-client";

class CreateDiscussionModal extends Component {
    constructor() {
        super();
        this.socket = io('http://localhost:5000/');
    }

    createDiscussion = (event) => {
        event.preventDefault();
        let title = event.target.title.value;
        let description = event.target.description.value;
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            let discussion_id = JSON.parse(xhr.responseText)["discussion"];
            this.addMessage(discussion_id, 0, this.props.currentUser, description, 0);
        });
        xhr.open('POST', 'http://localhost:5000/api/createDiscussion');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ title: title, categories: [] }));
        this.updateVisibility(false);
    };


    addMessage = (discussionId, targetId, author, message, depth) => {
        const comment = JSON.stringify({
            "author": author,
            "text": message,
            "parentId": targetId,
            "discussionId": discussionId,
            "extra_data": null,
            "time_stamp": 0,
            "depth": depth
        });
        this.socket.emit('add comment', comment)
    };

    updateVisibility = (isOpen) => {
        this.props.updateVisibility(isOpen);
    };

    render() {
        return (
            <form onSubmit={this.createDiscussion}>
                <Modal visible={this.props.isOpen} onClickBackdrop={this.modalBackdropClicked}>
                    <div className="modal-header">
                        <h5 className="modal-title">Create New Discussion</h5>
                    </div>
                    <div className="modal-body">
                        <p className="title">Title:</p>
                        <input type="text" className="title-input" name="title"
                            placeholder="Enter Title" />
                        <p className="description">Description:</p>
                        <textarea className="description-input" name="description" placeholder={"Write Something"} />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-grey"
                            onClick={() => this.updateVisibility(false)}>Cancel
                        </button>
                        <button className="btn btn-info">Create</button>
                    </div>
                </Modal>
            </form>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser
    };
};

export default connect(mapStateToProps)(CreateDiscussionModal);