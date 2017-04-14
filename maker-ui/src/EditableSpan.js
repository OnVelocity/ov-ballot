/**
 * Created by onvelocity on 4/11/17.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './EditableSpan'

class EditableSpan extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			isEditing: false
		};
		this.handleEditStarted = this.handleEditStarted.bind(this);
		this.handleValueChanged = this.handleValueChanged.bind(this);
		this.handleEditFinished = this.handleEditFinished.bind(this);
	}

	handleEditStarted() {
		this.setState({isEditing: true, value: this.props.value});
	}

	handleValueChanged(value) {
		this.setState({value: value});
	}

	handleEditFinished(value) {
		this.setState({isEditing: false, value: ''});
		this.props.onUpdate(value);
	}

	render() {
		if (this.state.isEditing) {
			return <input className="EditableSpan" type="text" autoFocus value={this.state.value}
						  onKeyUp={(e) => e.which === 13 && this.handleEditFinished(e.target.value)}
						  onChange={(e) => this.handleValueChanged(e.target.value)}
						  onBlur={(e) => this.handleEditFinished(e.target.value)}/>
		}
		return (
			<span onClick={() => this.handleEditStarted()}>{this.props.children} &#9998;</span>
		);
	}

}

EditableSpan.propTypes = {
	value: PropTypes.string,
	isEditing: PropTypes.bool,
	onUpdate: PropTypes.func.isRequired
};

EditableSpan.defaultProps = {
	value: '',
	isEditing: false
};

export default EditableSpan;
