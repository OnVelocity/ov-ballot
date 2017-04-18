/*global Headers*/
/**
 * Created by onvelocity on 4/10/17.
 */

import fetch from 'isomorphic-fetch'
import md5 from 'js-md5'

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
export const DELETE_BALLOTS_STATUS = 'DELETE_BALLOTS_STATUS';

/**
 * helper function that generates a pseudo random token.
 *
 * this function is not pure.
 *
 * @returns {{ts: number, random: number}}
 */
export const random = () => {return {ts: Date.now(), random: Math.random()}};

/**
 * helper function that:
 * generates a deterministic id given a key and an index.
 * generates a non-deterministic id when makeUnique is truthy.
 *
 * @param key
 * @param index
 * @param makeUnique
 */
export const createId = (key, index, makeUnique = false) => {
	const identity = {key, index};
	if (makeUnique) {
		identity.unique = random();
	}
	return md5(JSON.stringify(identity));
};

//
// action builders
//

/**
 * generate a redux action.
 *
 * @param text
 * @returns {{type: string, ballotId, text: string}}
 */
export const add_ballot = (text = 'new ballot') => {
	const unique = true;
	const key = {user: 'me'};
	const ballotId = createId(key, text, unique);
	return {
		type: ADD_BALLOT,
		ballotId,
		text
	};
};

/**
 * generate a redux action.
 *
 * @param ballot
 * @returns {{type: string, ballot: *}}
 */
export const restore_ballot_object = (ballot = null) => {
	return {
		type: ADD_BALLOT,
		ballot
	}
};

/**
 * generate a redux action.
 *
 * @param ballotId
 * @returns {{type: string, ballotId: *}}
 */
export const remove_ballot = (ballotId) => {
	return {
		type: REMOVE_BALLOT,
		ballotId
	};
};

/**
 * generate a redux action.
 *
 * @param ballotId
 * @param text
 * @returns {{type: string, ballotId: *, questionId, text: string}}
 */
export const add_question = (ballotId, text = 'new question') => {
	const key = {ballot: ballotId};
	const questionId = createId({key, index: text});
	return {
		type: ADD_QUESTION,
		ballotId,
		questionId,
		text
	};
};

/**
 * generate a redux action.
 *
 * @param ballotId
 * @param questionId
 * @returns {{type: string, ballotId: *, questionId: *}}
 */
export const remove_question = (ballotId, questionId) => {
	return {
		type: REMOVE_QUESTION,
		ballotId,
		questionId
	};
};

/**
 * generate a redux action.
 *
 * @param ballotId
 * @param questionId
 * @param text
 * @returns {{type: string, ballotId: *, questionId: *, choiceId, text: string}}
 */
export const add_choice = (ballotId, questionId, text = 'new choice') => {
	const key = {question: questionId};
	const choiceId = createId({key, index: text});
	return {
		type: ADD_CHOICE,
		ballotId,
		questionId,
		choiceId,
		text
	};
};

/**
 * generate a redux action.
 *
 * @param ballotId
 * @param questionId
 * @param choiceId
 * @returns {{type: string, ballotId: *, questionId: *, choiceId: *}}
 */
export const remove_choice = (ballotId, questionId, choiceId) => {
	return {
		type: REMOVE_CHOICE,
		ballotId,
		questionId,
		choiceId
	};
};

/**
 * generate a redux action.
 *
 * @param ballotId
 * @param text
 * @returns {{type: string, ballotId: *, text: *}}
 */
export const set_ballot_text = (ballotId, text) => {
	return {
		type: SET_BALLOT_TEXT,
		ballotId,
		text
	};
};

/**
 * generate a redux action.
 *
 * @param status
 * @param response
 * @returns {{type: string, status: *, response: *}}
 */
export const fetch_ballots_status = (status, response) => {
	return {
		type: FETCH_BALLOTS_STATUS,
		status,
		response
	};
};

/**
 * generate a redux action.
 *
 * @param status
 * @param response
 * @returns {{type: string, status: *, response: *}}
 */
export const upsert_ballots_status = (status, response) => {
	return {
		type: UPSERT_BALLOTS_STATUS,
		status,
		response
	};
};

/**
 * generate a redux action.
 *
 * @param status
 * @param response
 * @returns {{type: string, status: *, response: *}}
 */
export const delete_ballots_status = (status, response) => {
	return {
		type: DELETE_BALLOTS_STATUS,
		status,
		response
	};
};

//
// redux-thunk actions used for chaining ui actions
//

/**
 * generate a thunk action dispatcher handler.
 *
 * @param text
 * @returns {Function}
 */
export const add_ballot_and_edit = (text) => {
	return (dispatch) => {
		// add ballot generates the new ballot's id which is
		// needed to select the new ballot for editing
		const action = add_ballot(text);
		dispatch(action);
		dispatch(set_ballot_to_edit(action.ballotId));
	};
};

//
// redux-thunk actions used for backend api related actions
//

/**
 * helper function for wrapping the fetch api.
 *
 * @param url
 * @param api
 * @param options
 * @param dispatch
 * @param status
 * @returns {Promise.<T>}
 */
export const call_api = (url, api, options, dispatch, status) => {
	dispatch(status('OPENED', {ts: Date.now()}));
	return api(url, options).then(response => {
		if (response.ok) {
			return response.json().then(json => dispatch(status('DONE', {ts: Date.now(), json})));
		}
		throw new Error(`Unable to reach api. Please try again in a few.`);
	}).catch((error) => {
		dispatch(status('ERROR', {ts: Date.now(), error}));
	});
};

/**
 * generate a thunk action dispatch handler.
 *
 * @param url
 * @param api
 * @param options
 * @returns {Function}
 */
export const fetch_ballots = (url, api = fetch, options = {accept: 'application/json'}) => {
	return (dispatch) => {
		call_api(url, api, options, dispatch, fetch_ballots_status);
	};
};

/**
 * generate a thunk action dispatch handler.
 *
 * @param url
 * @param ballots
 * @param api
 * @param options
 * @returns {Function}
 */
export const upsert_ballots = (url, ballots = [], api = fetch, options = {
	method: 'PUT',
	accept: 'application/json'
}) => {
	return (dispatch) => {
		options.headers = new Headers({
			'Content-Type': 'application/json'
		});
		options.body = JSON.stringify(ballots);
		call_api(url, api, options, dispatch, upsert_ballots_status);
	};
};

/**
 * generate a thunk action dispatch handler.
 *
 * @param url
 * @param ballots
 * @param api
 * @param options
 * @returns {Function}
 */
export const delete_ballots = (url, ballots = [], api = fetch, options = {
	method: 'DELETE',
	accept: 'application/json'
}) => {
	return (dispatch) => {
		options.headers = new Headers({
			'Content-Type': 'application/json'
		});
		options.body = JSON.stringify(ballots.map((b) => b.id));
		call_api(url, api, options, dispatch, (status, data) => {
			switch (status) {
				case 'ERROR':
					// todo restore state using redux undo/redo action
					ballots.forEach((b) => dispatch(restore_ballot_object(b)));
					break;
				default:
			}
			return delete_ballots_status(status, data);
		});
	};
};

//
// reducers - using the reducer composition pattern
// https://egghead.io/lessons/javascript-redux-reducer-composition-with-objects
//
// note: reducers should be "pure" deterministic functions
//

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
				id: action.questionId,
				text: action.text,
				choices: []
			};
		case ADD_CHOICE:
			return {
				...state,
				choices: state.choices.concat({
					id: action.choiceId,
					text: action.text
				})
			};
		case REMOVE_CHOICE:
			return {
				...state,
				choices: state.choices.filter((c) => c.id !== action.choiceId)
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
			if (action.ballot) {
				return {
					...action.ballot
				};
			}
			return {
				id: action.ballotId,
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
				questions: state.questions.filter((q) => q.id !== action.questionId)
			};
		case ADD_CHOICE:
		case REMOVE_CHOICE:
			return {
				...state,
				questions: state.questions.map((q) => q.id === action.questionId ? question(q, action) : q)
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
			if (action.ballot) {
				return [
					...state,
					ballot(undefined, action)
				];
			}
			return [
				...state,
				ballot(undefined, action)
			];
		case REMOVE_BALLOT:
			return state.filter((b) => action.ballotId !== b.id);
		case ADD_QUESTION:
		case REMOVE_QUESTION:
		case ADD_CHOICE:
		case REMOVE_CHOICE:
		case SET_BALLOT_TEXT:
			return state.map((b) => b.id === action.ballotId ? ballot(b, action) : b);
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

/**
 * action type
 *
 * @type {string}
 */
export const SET_BALLOT_TO_EDIT = 'SET_BALLOT_TO_EDIT';

/**
 * generates a redux action.
 *
 * @param ballotToEditId
 * @returns {{type: string, ballotToEditId: *}}
 */
export const set_ballot_to_edit = (ballotToEditId) => {
	return {
		type: SET_BALLOT_TO_EDIT,
		ballotToEditId
	};
};

/**
 * action type
 *
 * @type {string}
 */
export const TOGGLE_AUTO_SAVE = 'TOGGLE_AUTO_SAVE';

/**
 * generates a redux action.
 *
 * @returns {{type: string}}
 */
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
export const ui = (state = {}, action = {}) => {
	switch (action.type) {
		case SET_BALLOT_TO_EDIT:
			const ballotToEditId = action.ballotToEditId;
			return {
				...state,
				ballotToEditId
			};
		case FETCH_BALLOTS_STATUS:
		case UPSERT_BALLOTS_STATUS:
		case DELETE_BALLOTS_STATUS:
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
