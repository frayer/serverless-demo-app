import React, { MouseEvent } from 'react';
import './App.css';
import logo from './logo.svg';

const API_ENDPOINT = 'https://4j25kicezg.execute-api.us-east-2.amazonaws.com/ballots';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Hello></Hello>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

interface TodoProps {
  todo?: string
  status?: string
}

interface TodoState {
  ballots: any[]
}

class Hello extends React.Component<TodoProps, TodoState> {
  constructor(props: TodoProps) {
    super(props)
    this.state = {
      ballots: []
    }
  }

  click = async (event: MouseEvent) => {
    const response = await fetch(API_ENDPOINT);
    const data: any = await response.json();
    console.log(data)

    this.setState({
      ballots: data.ballots
    });
  }

  render() {
    const ballots = this.state.ballots.map((ballot) => {
      return <p key={ballot.id}>{ballot.name}</p>
    });
    return (
      <div>
        <h1 onClick={this.click}>Click Me</h1>
        {ballots}
      </div>
    )
  }
}

export default App;
