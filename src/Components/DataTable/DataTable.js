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

export default class FormEdit extends React.Component {
  state = {
    editableRows: {},
  };

  onToggleEditMode = (row) => {
    const { editableRows } = this.state;
    if (editableRows[row.id]) {
      const tempObj = { ...editableRows };

      delete tempObj[row.id];

      this.setState({ editableRows: tempObj });
    } else {
      const tempObj = { ...editableRows };

      tempObj[row.id] = {
        id: row.id,
        oldName: row.name,
        oldValue: row.value,
        name: row.name,
        value: row.value,
      };

      this.setState({ editableRows: tempObj });
    }
  };

  onChange = (e, id) => {
    let { name, value } = e.target;
    const { editableRows } = this.state;
    const tempObj = editableRows[id];
    tempObj[name] = value;
    this.setState({ editableRows: { ...editableRows, [id]: tempObj } });
  };

  onRevert = (row) => {
    const { editableRows } = this.state;
    if (editableRows[row.id]) {
      const tempObj = { ...editableRows };

      delete tempObj[row.id];

      this.setState({ editableRows: tempObj });
    }
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
        .then(() => {
          this.props.deleteItemFromState(id);
        })
        .catch((e) => console.log(e));
    }
  };

  submitFormEdit = (e, row) => {
    e.preventDefault();
    fetch(`http://172.19.52.75:9000/`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: row.id,
        name: row.name,
        value: row.value,
      }),
    })
      .then(() => {
        this.props.updateState({
          id: row.id,
          name: row.name,
          value: row.value,
        });
      })
      .catch((e) => console.log(e));
  };

  renderCell = ({ row, name }) => {
    const { editableRows } = this.state;
    const curRow = editableRows[row.id];
    if (!curRow || name === 'id') {
      return <TableCell align="left">{row[name]}</TableCell>;
    }

    return (
      <TableCell align="left">
        <Input
          type="text"
          autoFocus
          value={curRow[name]}
          name={name}
          onChange={(e) => this.onChange(e, row.id)}
        />
      </TableCell>
    );
  };

  render() {
    console.log(this.state);
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
            {this.props.items.map((row) => (
              <TableRow key={_.uniqueId()}>
                {this.renderCell({ ...{ row, name: 'id' } })}
                {this.renderCell({ ...{ row, name: 'name' } })}
                {this.renderCell({ ...{ row, name: 'value' } })}
                <TableCell>
                  {this.state.editableRows[row.id] ? (
                    <>
                      <IconButton
                        aria-label="done"
                        onClick={(e) => {
                          this.onToggleEditMode(row);
                          this.submitFormEdit(
                            e,
                            this.state.editableRows[row.id]
                          );
                        }}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        aria-label="revert"
                        onClick={() => this.onRevert(row)}
                      >
                        <RevertIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        aria-label="edit"
                        onClick={() => this.onToggleEditMode(row)}
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
