import React, { Component } from 'react'
import BallotEditor from './BallotEditor'
import MyBallots from './MyBallots'
import { upsert_ballots } from './Reducers'

import logo from './logo.svg';
import './App.css';

class App extends Component {

	render() {

		let ballotToEdit = this.props.ballots[this.props.ballotToEditId] || this.props.ballots[0];

		const disableAutoSave = this.props.disableAutoSave;

		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h1>Ballot Maker</h1>
				</div>
				<button style={{display: disableAutoSave ? '' : 'none'}} onClick={() => this.props.dispatch(() => upsert_ballots('/prod/myBallots', this.props.ballots))}>Save</button>
				<MyBallots ballots={this.props.ballots} dispatch={this.props.dispatch} />
				<BallotEditor ballot={ballotToEdit} dispatch={this.props.dispatch} />
			</div>
		);

	}

}

export default App;
