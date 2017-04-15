import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { ui, ballots, fetch_ballots, upsert_ballots, delete_ballots } from './Reducers'
import { difference, differenceWith } from 'lodash'

import App from './App';
import './index.css';

const store = createStore(
	combineReducers({ui, ballots}),
	applyMiddleware(thunk, logger)
);

const isHosted = !!(
	(typeof window !== 'undefined' &&
	window.document && window.document.location && /\.amazonaws\.com$/.test(window.document.location.host))
);

const ballotsApiEndPoint = `${ isHosted ? 'https://31h9l55xad.execute-api.us-east-1.amazonaws.com' : '' }/prod/myBallots`;

store.dispatch(fetch_ballots(ballotsApiEndPoint));

const autoSave = (ballot) => {
	store.dispatch(upsert_ballots(ballotsApiEndPoint, ballot));
};

const autoDelete = (ballot) => {
	store.dispatch(delete_ballots(ballotsApiEndPoint, [ballot]));
};

const render = () => {
	const state = store.getState();
	const ballots = state.ballots;
	ReactDOM.render(
		<App {...state.ui} ballots={ballots} dispatch={(action) => store.dispatch(action(state.ui.ballotToEditId))} />,
		document.getElementById('root')
	);
};

render();
store.subscribe(render);

let currentValue = null;
function autoSaveIfBallotsChanged() {
	let previousValue = currentValue;
	currentValue = store.getState().ballots || [];
	if (previousValue === null) {
		return;
	}
	const changed = difference(currentValue, previousValue);
	if (changed.length) {
		changed.forEach(autoSave);
	}
	const removed = differenceWith(previousValue, currentValue, (a, b) => a.id === b.id);
	if (removed.length) {
		removed.forEach(autoDelete);
	}
}

let autoSaveUnSubscribe = store.subscribe(autoSaveIfBallotsChanged);
store.subscribe(() => {
	const ui = store.getState().ui;
	if (ui.disableAutoSave) {
		if (typeof autoSaveUnSubscribe === 'function') {
			autoSaveUnSubscribe();
			autoSaveUnSubscribe = null;
		}
	} else {
		if (autoSaveUnSubscribe === null) {
			autoSaveUnSubscribe = store.subscribe(autoSaveIfBallotsChanged);
		}
	}
});
