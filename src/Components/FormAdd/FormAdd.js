import React from 'react';
import {
  FormControl,
  InputLabel,
  Input,
  Divider,
  Button,
} from '@material-ui/core';

class FormAdd extends React.Component {
  state = {
    id: 0,
    name: '',
    value: '',
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitFormAdd = (e) => {
    e.preventDefault();
    fetch('http://172.19.52.75:9000/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        value: this.state.value,
      }),
    })
      .then((res) => res.json())
      .then((item) => {
        this.props.addItemToState(item);
        this.props.toggle();
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    if (this.props.item) {
      const { id, name, value } = this.props.item;
      this.setState({ id, name, value });
    }
  }

  render() {
    return (
      <div>
        <FormControl>
          <InputLabel htmlFor="name"></InputLabel>
          <Input
            type="text"
            name="name"
            id="name"
            onChange={this.onChange}
            value={this.state.name === null ? '' : this.state.name}
          />
        </FormControl>
        <Divider orientation="vertical" flexItem />
        <FormControl>
          <InputLabel htmlFor="value"></InputLabel>
          <Input
            placeholder="value"
            type="text"
            name="value"
            id="value"
            onChange={this.onChange}
            value={this.state.value === null ? '' : this.state.value}
          />
          <Button
            style={{ padding: '20px' }}
            color="primary"
            onClick={this.submitFormAdd}
          >
            Submit
          </Button>
        </FormControl>
      </div>
    );
  }
}

export default FormAdd;
