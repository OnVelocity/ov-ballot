import React, { Component } from 'react'
import Input from './Input'
import Question from './Question'

import logo from './logo.svg';
import './App.css';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			questions: [{
				text: 'Do you like ice cream?',
				choices: [{text: 'Yes'}, {text: 'No'}]
			}]
		};
		this.handleQuestionChanged = this.handleQuestionChanged.bind(this);
		this.handleQuestionEditFinished = this.handleQuestionEditFinished.bind(this);
		this.handleAddChoice = this.handleAddChoice.bind(this);
		this.handleRemoveChoice = this.handleRemoveChoice.bind(this);
		this.handleRemoveQuestion = this.handleRemoveQuestion.bind(this);
	}

	handleQuestionChanged(value) {
		this.setState({value: value});
	}

	handleQuestionEditFinished(value) {
		if (!value || typeof value !== 'string') {
			return;
		}
		this.setState({questions: this.state.questions.concat({text: value, choices: []})});
	}

	handleAddChoice(questionIndex, choice) {
		const questions = this.state.questions.map((question, i) => {
			if (i === questionIndex) {
				return Object.assign({}, question, {choices: question.choices.concat({text: choice})});
			}
			return question;
		});
		this.setState({questions: questions});
	}

	handleRemoveChoice(questionIndex, choiceIndex) {
		const questions = this.state.questions.map((question, i) => {
			if (i === questionIndex) {
				return Object.assign({}, question, {choices: question.choices.filter((choice, j) => (j !== choiceIndex))});
			}
			return question;
		});
		this.setState({questions: questions});
	}

	handleRemoveQuestion(questionIndex) {
		this.setState({questions: this.state.questions.filter((question, i) => i !== questionIndex)});
	}

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h2>Ballot Maker</h2>
				</div>
				<p className="App-intro">
					To get started, add questions and responses.
				</p>
				<Input placeholder="Add question" onEditFinished={this.handleQuestionEditFinished} />
				<div className="App-questions">
					{this.state.questions.map((q, i) => <Question key={i} text={q.text}
																  choices={q.choices}
																  addChoice={value => this.handleAddChoice(i, value)}
																  removeChoice={choiceIndex => this.handleRemoveChoice(i, choiceIndex)}
																  remove={() => this.handleRemoveQuestion(i)} />)}
				</div>
			</div>
		);
	}
}

export default App;
