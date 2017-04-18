/**
 * Created by onvelocity on 4/8/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import './Choice.css'

const choice = ({text, removeChoice}) => {
	return (
		<li className="Choice">
			<span>{text}</span>
			<button onClick={() => removeChoice()}>&#10005;</button>
		</li>
	);
};

choice.defaultProps = {
	text: ''
};

choice.propTypes = {
	text: PropTypes.string,
	removeChoice: PropTypes.func
};

export default choice;
