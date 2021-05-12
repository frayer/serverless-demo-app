import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import React, { MouseEvent } from 'react';

// Demo mode, don't judge me ;-)
const API_ENDPOINT = 'https://4j25kicezg.execute-api.us-east-2.amazonaws.com/ballots';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedBallotId: null
    }
  }

  ballotSelected = async (ballotId: string) => {
    console.log(ballotId);
    this.setState({
      selectedBallotId: ballotId
    });
  }

  render() {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Ballots onBallotSelected={this.ballotSelected}></Ballots>
          </Grid>
          <Grid item xs={8}>
            <Measures ballotId={this.state.selectedBallotId}></Measures>
          </Grid>
        </Grid>
      </div>
    );
  }
}

class Ballots extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      ballots: []
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = async () => {
    const response = await fetch(API_ENDPOINT);
    const data: any = await response.json();
    console.log(data)

    this.setState({
      ballots: data.ballots
    });
  }

  ballotClicked(ballotId: string) {
    this.props.onBallotSelected(ballotId);
  }

  render() {
    const ballotList = this.state.ballots.map((ballot: any) => {
      return (
        <ListItem key={ballot.id} onClick={ () => this.ballotClicked(ballot.id) } button>
          <ListItemText primary={ballot.name} />
        </ListItem>
      )
    });
    return (
      <List component="nav" aria-label="main mailbox folders">
        <Button color="primary" variant="contained" onClick={this.refresh}>Refresh Surveys</Button>
        {ballotList}
      </List>
    )
  }
}

class Measures extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      ballot: { measures: [] },
      waiting: false
    }
  }

  componentDidUpdate = async (prevProps: any) => {
    if (prevProps.ballotId != this.props.ballotId) {
      const response = await fetch(`${API_ENDPOINT}/${this.props.ballotId}`);
      const data: any = await response.json();
      console.log(data)
      this.setState({
        ballot: data
      })
    }
  }

  refresh = async () => {
    if (this.props.ballotId != null) {
      this.setState({ waiting: true })
      const response = await fetch(`${API_ENDPOINT}/${this.props.ballotId}`);
      const data: any = await response.json();
      console.log(data)
      this.setState({
        ballot: data
      });
      setTimeout(() => {
        this.setState({ waiting: false });
      }, 0);
    }
  }

  vote = async (measureId: string) => {
    if (this.state.ballot?.id != null) {
      this.setState({ waiting: true })
      const response = await fetch(`${API_ENDPOINT}/${this.state.ballot.id}/measures/${measureId}`, {
        method: 'PATCH'
      });
      setTimeout(() => {
        this.setState({ waiting: false });
      }, 0);
    }
  }

  render() {
    const measuresList = this.state.ballot.measures.map((measure: any) => {
      return (
        <ListItem key={measure.id} button>
          <Button color="primary" variant="contained" onClick={() => { this.vote(measure.id) } } disabled={this.state.waiting}>Vote: {measure.votes}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <ListItemText primary={measure.name} />
        </ListItem>
      )
    });
    return (
      <List component="nav" aria-label="main mailbox folders">
        <Button color="primary" variant="contained" onClick={this.refresh} disabled={this.state.waiting}>Refresh Options</Button>
        {measuresList}
      </List>
    )
  }
}

export default App;
