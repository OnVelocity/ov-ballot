/**
 * Created by onvelocity on 4/10/17.
 */

import fetch from 'isomorphic-fetch'

// action types
export const ADD_BALLOT = 'ADD_BALLOT';
export const REMOVE_BALLOT = 'REMOVE_BALLOT';
export const ADD_QUESTION = 'ADD_QUESTION';
export const REMOVE_QUESTION = 'REMOVE_QUESTION';
export const ADD_CHOICE = 'ADD_CHOICE';
export const REMOVE_CHOICE = 'REMOVE_CHOICE';
export const SET_BALLOT_TEXT = 'SET_BALLOT_TEXT';
export const FETCH_BALLOTS_STATUS = 'FETCH_BALLOTS_STATUS';
export const UPSERT_BALLOTS_STATUS = 'UPSERT_BALLOTS_STATUS';

// action builders
export const add_ballot = (text = 'new ballot') => {
	return {
		type: ADD_BALLOT,
		text
	};
};

export const remove_ballot = (ballotIndex) => {
	return {
		type: REMOVE_BALLOT,
		ballotIndex
	};
};

export const add_question = (ballotIndex, text = 'new question') => {
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

export const add_choice = (ballotIndex, questionIndex, text = 'new choice') => {
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

export const set_ballot_text = (ballotIndex, text) => {
	return {
		type: SET_BALLOT_TEXT,
		ballotIndex,
		text
	};
};

export const fetch_ballots_status = (status, response) => {
	return {
		type: FETCH_BALLOTS_STATUS,
		status,
		response
	};
};

export const upsert_ballots_status = (status, response) => {
	return {
		type: UPSERT_BALLOTS_STATUS,
		status,
		response
	};
};

export const call_api = (url, api, options, dispatch, status) => {
	dispatch(status('OPENED', {ts: Date.now()}));
	return api(url, options).then(response => {
		if (response.ok) {
			return response.json().then(json => dispatch(status('DONE', {ts: Date.now(), json})));
		}
		throw new Error(`Unable to load ${url}.`);
	}).catch((error) => {
		dispatch(status('ERROR', {ts: Date.now(), error}));
	});
};

export const fetch_ballots = (url, api = fetch, options = {accept: 'application/json'}) => {
	return (dispatch) => {
		call_api(url, api, options, dispatch, fetch_ballots_status);
	};
};

export const upsert_ballots = (url, ballots = [], api = fetch, options = {
	method: 'PUT',
	accept: 'application/json'}) => {
	return (dispatch) => {
		options.headers = new Headers({
			"Content-Type": "application/json"
		});
		options.body = JSON.stringify(ballots);
		call_api(url, api, options, dispatch, upsert_ballots_status);
	};
};

// reducers - using the reducer composition pattern
// https://egghead.io/lessons/javascript-redux-reducer-composition-with-objects

/**
 * Define data state changes in response to given action.
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
 * Define data state changes in response to given action.
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
		case SET_BALLOT_TEXT:
			if (state.text === action.text) {
				return state;
			}
			return {
				...state,
				text: action.text
			};
		default:
			return state;
	}
};

/**
 * Define data state changes in response to given action.
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
		case SET_BALLOT_TEXT:
			return state.map((b, i) => i === action.ballotIndex ? ballot(b, action) : b);
		case FETCH_BALLOTS_STATUS:
			switch (action.status) {
				case 'DONE':
					return [...action.response.json];
				default:
					return state;
			}
		default:
			return state;
	}
};

// TRANSIENT UI DATA REDUCERS

export const SET_BALLOT_TO_EDIT = 'SET_BALLOT_TO_EDIT';
export const set_ballot_to_edit = (ballotToEditIndex) => {
	return {
		type: SET_BALLOT_TO_EDIT,
		ballotToEditIndex
	};
};

export const TOGGLE_AUTO_SAVE = 'TOGGLE_AUTO_SAVE';
export const toggle_auto_save = () => {
	return {
		type: TOGGLE_AUTO_SAVE
	};
};

/**
 * Define ui state changes in response to given action.
 *
 * @param state
 * @param action
 * @returns {*}
 */
export const ui = (state = {ballotToEditIndex: 0}, action = {}) => {
	switch (action.type) {
		case SET_BALLOT_TO_EDIT:
			const ballotToEditIndex = action.ballotToEditIndex;
			return {
				...state,
				ballotToEditIndex
			};
		case FETCH_BALLOTS_STATUS:
			switch (action.status) {
				case 'OPENED':
					return {
						...state,
						isLoadingBallots: true
					};
				case 'DONE':
					return {
						...state,
						isLoadingBallots: false
					};
				case 'ERROR':
					return {
						...state,
						isLoadingBallots: false,
						errorMessage: action.response.error.message
					};
				default:
					return state;
			}
		case TOGGLE_AUTO_SAVE:
			return {
				...state,
				disableAutoSave: !state.disableAutoSave
			};
		default:
			return state;
	}
};
