import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { ui, ballots, fetch_ballots, upsert_ballots } from './Reducers'
import { difference } from 'lodash'

import App from './App';
import './index.css';

const store = createStore(
	combineReducers({ui, ballots}),
	applyMiddleware(thunk, logger)
);

store.dispatch(fetch_ballots('/prod/myBallots'));

const autoSave = (ballot) => {
	store.dispatch(upsert_ballots('/prod/myBallots', ballot));
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

let currentValue = null;
function autoSaveIfBallotsChanged() {
	let previousValue = currentValue;
	currentValue = store.getState().ballots || [];
	if (previousValue === null) {
		return;
	}
	const changed = difference(currentValue, previousValue);
	changed.forEach(autoSave);
}

store.subscribe(render);

let autoSaveUnsubscriber = store.subscribe(autoSaveIfBallotsChanged);
store.subscribe(() => {
	const ui = store.getState().ui;
	if (ui.disableAutoSave) {
		autoSaveUnsubscriber();
		autoSaveUnsubscriber = null;
	} else {
		if (autoSaveUnsubscriber === null) {
			autoSaveUnsubscriber = store.subscribe(autoSaveIfBallotsChanged);
		}
	}
});
