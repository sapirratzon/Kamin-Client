import React, { Component } from 'react';
import Modal from 'react-bootstrap4-modal';

class ModeratorManagementModal extends Component {
    constructor() {
        super();
        this.socket = io(process.env.REACT_APP_API);
    }

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
                               placeholder="Enter Title"/>
                        <p className="description">Description:</p>
                        <textarea className="description-input" name="description" placeholder={"Write Something"}/>
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

export default ModeratorManagementModal;
