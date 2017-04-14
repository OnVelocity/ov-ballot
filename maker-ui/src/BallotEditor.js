import React from 'react'
import Input from './Input'
import EditableSpan from './EditableSpan'
import Question from './Question'
import { add_ballot, add_question, remove_question, add_choice, remove_choice, set_ballot_text } from './Reducers'

import './BallotEditor.css';

const BallotEditor = ({ballot, dispatch}) => {

	const handleQuestionEditFinished = (value) => {
		dispatch(() => add_question(ballot.id, value));
	};

	const handleRemoveQuestion = (questionIndex) => {
		dispatch(() => remove_question(ballot.id, questionIndex));
	};

	const handleAddChoice = (questionIndex, text) => {
		dispatch(() => add_choice(ballot.id, questionIndex, text));
	};

	const handleRemoveChoice = (questionIndex, choiceIndex) => {
		dispatch(() => remove_choice(ballot.id, questionIndex, choiceIndex));
	};

	const question = (q, i) => {
		return <Question key={i} text={q.text}
						 choices={q.choices}
						 addChoice={value => handleAddChoice(i, value)}
						 removeChoice={choiceIndex => handleRemoveChoice(i, choiceIndex)}
						 remove={() => handleRemoveQuestion(i)}/>
	};

	if (!ballot) {
		return <p>To get started <a href="#new-ballot" onClick={() => dispatch(() => add_ballot('new ballot'))}>add a ballot</a>.</p>
	}

	return (
		<div className="BallotEditor">
			<div className="BallotEditor-header">
				<h2>
					<EditableSpan value={ballot.text}
								  onUpdate={(value) => dispatch(() => set_ballot_text(ballot.id, value))}>{ballot.text}</EditableSpan>
				</h2>
			</div>
			<p className="BallotEditor-intro">
				To get started, add questions and responses.
			</p>
			<Input placeholder="Add question" onEditFinished={handleQuestionEditFinished}/>
			<div className="BallotEditor-questions">
				{ballot.questions.map(question)}
			</div>
		</div>
	);

};

export default BallotEditor;
