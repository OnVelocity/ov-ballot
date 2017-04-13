import React, { Component } from 'react'
import BallotEditor from './BallotEditor'
import MyBallots from './MyBallots'
import { upsert_ballots } from './Reducers'

import logo from './logo.svg';
import './App.css';

class App extends Component {

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h1>Ballot Maker</h1>
				</div>
				<button onClick={() => this.props.dispatch(() => upsert_ballots('/prod/myBallots', this.props.ballots))}>Save</button>
				<MyBallots ballots={this.props.ballots} dispatch={this.props.dispatch} />
				<BallotEditor ballot={this.props.ballot} dispatch={this.props.dispatch} />
			</div>
		);
	}
}

export default App;
