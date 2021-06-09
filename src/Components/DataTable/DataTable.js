import _ from 'lodash';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import DeleteIcon from '@material-ui/icons/Delete';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
/*
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

const RenderTableCell = ({ row, name, onChange }) => {
  const { isEditMode } = row;
  return (
    <TableCell align="left">
      {isEditMode ? (
        <Input value={row[name]} name={name} onChange={onChange} />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};
*/

export default class FormEdit extends React.Component {
  state = { rows: this.props.items, previous: 0 };

  onToggleEditMode = (id) => {
    this.setState({
      rows: this.state.rows.map((row) => {
        return row.id === id ? { ...row, isEditMode: !row.isEditMode } : row;
      }),
    });
  };

  onChange = (row) => (e) => {
    console.log("it's going to be changed...");
    if (!this.state.previous[row.id]) {
      this.setState({ previous: { ...this.state, [row.id]: row } });
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = this.state.rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    this.setState({ rows: newRows });
  };

  onRevert = (id) => {
    const newRows = this.state.rows.map((row) => {
      if (row.id === id) {
        return this.state.previous[id] ? this.state.previous[id] : row;
      }
      return row;
    });
    this.setState({ rows: newRows });
    this.setState({
      previous: function () {
        delete this.state.previous[id];
        return this.state.previous;
      },
    });
    this.onToggleEditMode(id);
  };

  deleteItem = (id) => {
    let confirmDelete = window.confirm('Are you sure?');
    if (confirmDelete) {
      fetch(`http://172.19.52.75:9000/${id}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
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

  submitFormEdit = (e) => {
    e.preventDefault();
    fetch(`http://172.19.52.75:9000/`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
        value: this.state.value,
      }),
    })
      .then((response) => response.json())
      .then((item) => {
        if (Array.isArray(item)) {
          this.props.updateState(item[0]);
          this.props.toggle();
        } else {
          console.log('something was wrong in editing form');
        }
      })
      .catch((e) => console.log(e));
  };

  renderCell = ({ row, name }) => {
    const { isEditMode } = row;
    return (
      <TableCell align="left">
        {isEditMode ? (
          <Input
            value={row[name]}
            name={name}
            onChange={() => this.onChange(row)}
          />
        ) : (
          row[name]
        )}
      </TableCell>
    );
  };

  render() {
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Value</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map((row) => (
              <TableRow key={_.uniqueId()}>
                {this.renderCell({ ...{ row, name: 'id' } })}
                {this.renderCell({ ...{ row, name: 'name' } })}
                {this.renderCell({ ...{ row, name: 'value' } })}
                <TableCell>
                  {row.isEditMode ? (
                    <>
                      <IconButton
                        aria-label="done"
                        onClick={(e) => {
                          this.onToggleEditMode(row.id);
                          this.submitFormEdit(e);
                        }}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        aria-label="revert"
                        onClick={() => this.onRevert(row.id)}
                      >
                        <RevertIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        aria-label="edit"
                        onClick={() => this.onToggleEditMode(row.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => this.deleteItem(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

/*
const theme = createMuiTheme();

const styles = {
  table: {
    minWidth: 650,
  },
};

class DataTable extends React.Component {
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
*/
