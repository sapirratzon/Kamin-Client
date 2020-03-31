import React, { Component } from 'react';
import { connect } from 'react-redux'
import Modal from 'react-bootstrap4-modal';
import "./CreateDiscussionModal.css"

class CreateDiscussionModal extends Component {
    constructor(props) {
        super(props);
    }

    changePath = (path) => {
        this.props.path.push(path);
    };

    createDiscussion = (event) => {
        event.preventDefault();
        let title = event.target.title.value;
        let description = event.target.description.value;
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            let discussion_id = JSON.parse(xhr.responseText)["discussion_id"];
            console.log("Created Discussion: " + discussion_id);
            if (discussion_id != null) {
                this.changePath('/Discussion/false/' + discussion_id);
                this.updateVisibility(false);
            }else{
                alert("Wrong Input")
            }
        });
        xhr.open('POST', process.env.REACT_APP_API + '/api/createDiscussion');
        xhr.setRequestHeader("Authorization", "Basic " + btoa(this.props.token + ":"));
        xhr.setRequestHeader("Content-Type", "application/json");
        console.log(Date.now());
        const comment = JSON.stringify({
            "author": this.props.currentUser,
            "text": description,
            "parentId": null,
            "discussionId": "",
            "extra_data": null,
            "timestamp": null,
            "depth": 0
        });
        xhr.send(JSON.stringify({ title: title, categories: [], root_comment_dict: comment }));
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
        currentUser: state.currentUser,
        token: state.token
    };
};

export default connect(mapStateToProps)(CreateDiscussionModal);
