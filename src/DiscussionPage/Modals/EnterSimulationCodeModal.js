import React, {Component} from 'react';
import Modal from 'react-bootstrap4-modal';
import "./EnterSimulationCodeModal.css"
import io from "socket.io-client";

class EnterSimulationCodeModal extends Component {
    constructor() {
        super();
        this.socket = io('http://localhost:5000/');
    }

    simulationHandler = (event) => {
        event.preventDefault();
        let uniqueCode = event.target.unique.value;
        let path = `Discussion/true/` + uniqueCode;
        this.updateVisibility(false);
        this.props.updateHistoryPath(path);
    };

    updateVisibility = (isOpen) => {
        this.props.updateVisibility(isOpen);
    };

    render() {
        return (
            <form onSubmit={this.simulationHandler}>
                <Modal visible={this.props.isOpen} onClickBackdrop={this.modalBackdropClicked}>
                    <div className="modal-header">
                        <h5 className="modal-title">Start Simulation</h5>
                    </div>
                    <div className="modal-body">
                        <p>Please Enter Discussion code:
                        <input type="text" className="unique-code" name="unique"
                               placeholder="Enter code"/></p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-grey"
                                onClick={() => this.updateVisibility(false)}>Cancel
                        </button>
                        <button className="btn btn-info">Connect</button>
                    </div>
                </Modal>
            </form>
        );
    }
}

export default EnterSimulationCodeModal;
