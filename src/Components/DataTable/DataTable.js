import _ from "lodash";
import React from "react";
import { withStyles, Button } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ModalForm from "../ModalForm/ModalForm";

const theme = createMuiTheme();

const styles = {
  table: {
    minWidth: 650,
  },
};

class DataTable extends React.Component {
  state = { editable: false };

  deleteItem = (id) => {
    let confirmDelete = window.confirm("Are you sure?");
    if (confirmDelete) {
      fetch(`http://172.19.52.75:9000/${id}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      })
        .then((res) => res.json())
        .then((item) => {
          this.props.deleteItemFromState(id);
        })
        .catch((e) => console.log(e));
    }
  };

  render() {
    const classes = this.props;
    return (
      <TableContainer component={Paper}>
        <ThemeProvider theme={theme}>
          <Table
            className={classes.table}
            size="small"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.items.map((item) => (
                <TableRow key={_.uniqueId()}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    <div style={{ width: "110px" }}>
                      <ModalForm
                        buttonLabel="Edit"
                        item={item}
                        updateState={this.props.updateState}
                      />{" "}
                      <Button
                        color="secondary"
                        onClick={() => this.deleteItem(item.id)}
                      >
                        Del
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ThemeProvider>
      </TableContainer>
    );
  }
}

export default withStyles(styles)(DataTable);
