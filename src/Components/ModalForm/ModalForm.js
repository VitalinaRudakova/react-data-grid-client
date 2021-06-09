import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormAdd from "../FormAdd/FormAdd";
import { DialogActions } from "@material-ui/core";

export default class ModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  render() {
    const closeBtn = <button className="close" onClick={this.toggle}></button>;

    const label = this.props.buttonLabel;

    let button = "";
    let title = "";

    if (label === "Edit") {
      button = (
        <Button
          color="primary"
          onClick={this.toggle}
          style={{ float: "left", marginRight: "10px" }}
        >
          {label}
        </Button>
      );
      title = "Edit Item";
    } else {
      button = (
        <Button
          color="primary"
          onClick={this.toggle}
          style={{ float: "left", marginRight: "10px" }}
        >
          {label}
        </Button>
      );
      title = "Add New Item";
    }

    return (
      <div>
        {button}
        <Dialog
          style={{ padding: "10px", margin: 0 }}
          open={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <DialogActions>
            <IconButton color="primary" onClick={this.toggle}>
              Close
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogTitle close={closeBtn}>{title}</DialogTitle>
          <DialogContent>
            <FormAdd
              addItemToState={this.props.addItemToState}
              updateState={this.props.updateState}
              toggle={this.toggle}
              item={this.props.item}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
