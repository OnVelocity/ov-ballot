/**
 * Created by onvelocity on 4/8/17.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Input.css'

/**
 * Create an HTML INPUT element that notifies when editing is done.
 *
 * @param value
 * @param placeholder
 * @param onValueChanged
 * @param onEditFinished
 * @returns {XML}
 */
class Input extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: props.value
		};
		this.handleEditStarted = this.handleEditStarted.bind(this);
		this.handleValueChanged = this.handleValueChanged.bind(this);
		this.handleEditFinished = this.handleEditFinished.bind(this);
	}

	handleValueChanged(value) {
		this.setState({value: value});
		if (this.props.onValueChanged) {
			this.props.onValueChanged(value);
		}
	}

	handleEditFinished(value) {
		this.setState({value: ''});
		if (value.trim() && this.props.onEditFinished) {
			this.props.onEditFinished(value);
		}
	}

	handleOnKeyUp(whichKey, value) {
		if (whichKey === 13) {
			this.handleEditFinished(value)
		} else if (whichKey === 8) {
			this.handleValueChanged(value);
		}
	}

	handleEditStarted(value) {
		if (this.props.onEditStarted) {
			this.props.onEditStarted(value);
		}
	}

	render() {
		return (
			<div className="Input">
				<textarea type="text"
						  wrap="soft"
						  spellCheck="true"
						  value={this.state.value}
						  placeholder={this.props.placeholder}
						  onChange={e => this.handleValueChanged(e.target.value)}
						  onBlur={e => this.handleEditFinished(e.target.value)}
						  onKeyUp={e => this.handleOnKeyUp(e.which, e.target.value)}
						  onFocus={e => this.handleEditStarted(e.target.value)}
				/>
			</div>
		);
	}

}

Input.defaultProps = {
	value: '',
	placeholder: ''
};

Input.propTypes = {
	value: PropTypes.string,
	placeholder: PropTypes.string,
	onValueChanged: PropTypes.func,
	onEditFinished: PropTypes.func,
	onEditStarted: PropTypes.func
};

export default Input;
