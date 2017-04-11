/**
 * Created by onvelocity on 4/10/17.
 */

// action types
export const ADD_BALLOT = 'ADD_BALLOT';
export const REMOVE_BALLOT = 'REMOVE_BALLOT';
export const ADD_QUESTION = 'ADD_QUESTION';
export const REMOVE_QUESTION = 'REMOVE_QUESTION';
export const ADD_CHOICE = 'ADD_CHOICE';
export const REMOVE_CHOICE = 'REMOVE_CHOICE';

// action builders
export const add_question = (ballotIndex, text) => {
	return {
		type: ADD_QUESTION,
		ballotIndex,
		text
	};
};

export const remove_question = (ballotIndex, questionIndex) => {
	return {
		type: REMOVE_QUESTION,
		ballotIndex,
		questionIndex
	};
};

export const add_choice = (ballotIndex, questionIndex, text) => {
	return {
		type: ADD_CHOICE,
		ballotIndex,
		questionIndex,
		text
	};
};

export const remove_choice = (ballotIndex, questionIndex, choiceIndex) => {
	return {
		type: REMOVE_CHOICE,
		ballotIndex,
		questionIndex,
		choiceIndex
	};
};

// reducers - using the reducer composition pattern
// https://egghead.io/lessons/javascript-redux-reducer-composition-with-objects

/**
 * Define state changes in response to given action.
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const question = (state = {}, action = {}) => {
	switch (action.type) {
		case ADD_QUESTION:
			return {
				text: action.text,
				choices: []
			};
		case ADD_CHOICE:
			return {
				...state,
				choices: state.choices.concat({
					text: action.text
				})
			};
		case REMOVE_CHOICE:
			return {
				...state,
				choices: state.choices.filter((c, i) => i !== action.choiceIndex)
			};
		default:
			return state;
	}
};

/**
 * Define state changes in response to given action.
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const ballot = (state = {}, action = {}) => {
	switch (action.type) {
		case ADD_BALLOT:
			return {
				text: action.text,
				questions: []
			};
		case ADD_QUESTION:
			return {
				...state,
				questions: [
					...state.questions,
					question(undefined, action)
				]
			};
		case REMOVE_QUESTION:
			return {
				...state,
				questions: state.questions.filter((q, i) => i !== action.questionIndex)
			};
		case ADD_CHOICE:
		case REMOVE_CHOICE:
			return {
				...state,
				questions: state.questions.map((q, i) => i === action.questionIndex ? question(q, action) : q)
			};
		default:
			return state;
	}
};

/**
 * Define state changes in response to given action.
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const ballots = (state = [], action = {}) => {
	switch (action.type) {
		case ADD_BALLOT:
			return [
				...state,
				ballot(undefined, action)
			];
		case REMOVE_BALLOT:
			return state.filter((b, i) => i !== action.ballotIndex);
		case ADD_QUESTION:
		case REMOVE_QUESTION:
		case ADD_CHOICE:
		case REMOVE_CHOICE:
			return state.map((b, i) => i === action.ballotIndex ? ballot(b, action) : b);
		default:
			return state;
	}
};

/**
 * The top level reducer for ballots.
 */
export default ballots;
