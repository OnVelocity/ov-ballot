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

// action builders
export const add_ballot = (text = 'new ballot') => {
	return {
		type: ADD_BALLOT,
		text
	};
};

export const remove_ballot = (ballotId) => {
	console.log('remove_ballot', ballotId);
	return {
		type: REMOVE_BALLOT,
		ballotId
	};
};

export const add_question = (ballotId, text = 'new question') => {
	return {
		type: ADD_QUESTION,
		ballotId,
		text
	};
};

export const remove_question = (ballotId, questionIndex) => {
	return {
		type: REMOVE_QUESTION,
		ballotId,
		questionIndex
	};
};

export const add_choice = (ballotId, questionIndex, text = 'new choice') => {
	return {
		type: ADD_CHOICE,
		ballotId,
		questionIndex,
		text
	};
};

export const remove_choice = (ballotId, questionIndex, choiceIndex) => {
	return {
		type: REMOVE_CHOICE,
		ballotId,
		questionIndex,
		choiceIndex
	};
};

export const set_ballot_text = (ballotId, text) => {
	return {
		type: SET_BALLOT_TEXT,
		ballotId,
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

export const delete_ballots_status = (status, response) => {
	return {
		type: DELETE_BALLOTS_STATUS,
		status,
		response
	};
};

let ballotsApiHost = '';
export const setBallotsApiHost = (host) => ballotsApiHost = host;

export const call_api = (url, api, options, dispatch, status) => {
	dispatch(status('OPENED', {ts: Date.now()}));
	return api(ballotsApiHost + url, options).then(response => {
		if (response.ok) {
			return response.json().then(json => dispatch(status('DONE', {ts: Date.now(), json})));
		}
		throw new Error(`Unable to call api for ${url}.`);
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

export const delete_ballots = (ballotIds = [], api = fetch, options = {
	method: 'DELETE',
	accept: 'application/json'
}) => {
	return (dispatch) => {
		options.headers = new Headers({
			'Content-Type': 'application/json'
		});
		console.log('delete', ballotIds);
		options.body = JSON.stringify(ballotIds);
		call_api('/prod/myBallots', api, options, dispatch, (status, data) => {
			switch (status) {
				case 'DONE':
					console.log('delete success');
					// todo refactor to have ui call remove_ballot not the api action delete_ballots
					// move the call to delete_ballots up to where the store is created
					ballotIds.forEach((id) => dispatch(remove_ballot(id)));
					break;
				case 'ERROR':
					console.log('delete failed');
					break;
				default:
			}
			return delete_ballots_status(status, data);
		});
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
				id: action.id,
				text: action.text,
				choices: []
			};
		case ADD_CHOICE:
			const newId = md5(JSON.stringify({question: question.id, ts: Date.now(), idx: state.choices.length}));
			return {
				...state,
				choices: state.choices.concat({
					id: newId,
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
				id: action.id,
				text: action.text,
				questions: []
			};
		case ADD_QUESTION:
			const newId = md5(JSON.stringify({ballot: state.id, ts: Date.now(), idx: state.questions.length}));
			return {
				...state,
				questions: [
					...state.questions,
					question(undefined, {...action, id: newId})
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
			const newId = md5(JSON.stringify({
				user: 'me',
				rnd: Math.random(),
				ts: Date.now(),
				idx: state.length
			}));
			return [
				...state,
				ballot(undefined, {...action, id: newId})
			];
		case REMOVE_BALLOT:
			return state.filter((b) => action.ballotId !==b.id);
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
		case UPSERT_BALLOTS_STATUS:
			switch (action.status) {
				case 'DONE':
					return state;
				default:
					return state;
			}
		default:
			return state;
	}
};

// TRANSIENT UI DATA REDUCERS

export const SET_BALLOT_TO_EDIT = 'SET_BALLOT_TO_EDIT';
export const set_ballot_to_edit = (ballotToEditId) => {
	return {
		type: SET_BALLOT_TO_EDIT,
		ballotToEditId
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
export const ui = (state = {}, action = {}) => {
	switch (action.type) {
		case SET_BALLOT_TO_EDIT:
			const ballotToEditId = action.ballotToEditId;
			return {
				...state,
				ballotToEditId
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
