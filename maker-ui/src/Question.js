/**
 * Created by onvelocity on 4/8/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import Choice from './Choice'
import Input from './Input'

const question = ({text, choices, addChoice, removeChoice, remove}) => {
	return (
		<section>
			<h1>{text}</h1>
			<button onClick={() => remove()}>x</button>
			<ol>
				{choices.map((choice, i) => (
					<Choice key={i} text={choice.text} removeChoice={() => removeChoice(i)} />
				))}
			</ol>
			<Input placeholder="Add response" onEditFinished={value => addChoice(value)} />
		</section>
	);
};

question.defaultProps = {
	question: '',
	choices: []
};

question.propTypes = {
	text: PropTypes.string,
	choices: PropTypes.array,
	addChoice: PropTypes.func,
	removeChoice: PropTypes.func,
	removeQuestion: PropTypes.func
};

export default question;
