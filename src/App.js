import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import ModalForm from './Components/ModalForm/ModalForm';
import DataTable from './Components/DataTable/DataTable';

export default class App extends Component {
  state = {
    items: [],
  };

  getItems() {
    fetch('http://172.19.52.75:9000/')
      .then((res) => res.json())
      .then((items) => this.setState({ items }))
      .catch((e) => console.log(e));
  }

  addItemToState = (item) => {
    this.setState((prevState) => ({
      items: [...prevState.items, item],
    }));
  };

  updateState = (item) => {
    const itemIndex = this.state.items.findIndex((data) => data.id === item.id);
    const newArray = [
      ...this.state.items.slice(0, itemIndex),
      item,
      ...this.state.items.slice(itemIndex + 1),
    ];
    this.setState({ items: newArray });
  };

  deleteItemFromState = (currentId) => {
    const updatedItems = this.state.items.filter(
      (item) => item.id !== currentId
    );
    this.setState({ items: updatedItems });
  };

  componentDidMount() {
    this.getItems();
  }

  render() {
    return (
      <Container className="App">
        <h1 style={{ margin: '20px 0' }}>React Data Grid</h1>
        <ModalForm
          buttonLabel="Add Item"
          addItemToState={this.addItemToState}
          onClick={this.props.toggle}
        />
        <DataTable
          items={this.state.items}
          updateState={this.updateState}
          deleteItemFromState={this.deleteItemFromState}
        />
      </Container>
    );
  }
}
