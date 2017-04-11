import React, { Component } from 'react'
import Input from './Input'
import Question from './Question'
import ballots, { add_question, remove_question, add_choice, remove_choice } from './Reducers'

import logo from './logo.svg';
import './App.css';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ballots: [{
				questions: [{
					text: 'Do you like ice cream?',
					choices: [{text: 'Yes'}, {text: 'No'}]
				}]
			}],
			editingBallotIndex: 0
		};
		this.handleQuestionEditFinished = this.handleQuestionEditFinished.bind(this);
		this.handleAddChoice = this.handleAddChoice.bind(this);
		this.handleRemoveChoice = this.handleRemoveChoice.bind(this);
		this.handleRemoveQuestion = this.handleRemoveQuestion.bind(this);
	}

	handleQuestionEditFinished(value) {
		if (!value || typeof value !== 'string') {
			return;
		}
		const ballotIndex = this.state.editingBallotIndex;
		this.setState({ballots: ballots(this.state.ballots, add_question(ballotIndex, value))});
	}

	handleRemoveQuestion(questionIndex) {
		const ballotIndex = this.state.editingBallotIndex;
		this.setState({ballots: ballots(this.state.ballots, remove_question(ballotIndex, questionIndex))});
	}

	handleAddChoice(questionIndex, text) {
		const ballotIndex = this.state.editingBallotIndex;
		this.setState({ballots: ballots(this.state.ballots, add_choice(ballotIndex, questionIndex, text))});
	}

	handleRemoveChoice(questionIndex, choiceIndex) {
		const ballotIndex = this.state.editingBallotIndex;
		this.setState({ballots: ballots(this.state.ballots, remove_choice(ballotIndex, questionIndex, choiceIndex))});
	}

	render() {
		const editingBallot = this.state.ballots[this.state.editingBallotIndex];
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h2>Ballot Maker</h2>
				</div>
				<p className="App-intro">
					To get started, add questions and responses.
				</p>
				<Input placeholder="Add question" onEditFinished={this.handleQuestionEditFinished}/>
				<div className="App-questions">
					{editingBallot.questions.map((q, i) => <Question key={i} text={q.text}
																	 choices={q.choices}
																	 addChoice={value => this.handleAddChoice(i, value)}
																	 removeChoice={choiceIndex => this.handleRemoveChoice(i, choiceIndex)}
																	 remove={() => this.handleRemoveQuestion(i)}/>)}
				</div>
			</div>
		);
	}
}

export default App;
