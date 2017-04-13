import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { ui, ballots, fetch_ballots, upsert_ballots } from './Reducers'

import App from './App';
import './index.css';

const store = createStore(combineReducers({ui, ballots}),
	applyMiddleware(thunk, logger));

store.dispatch(fetch_ballots('/prod/myBallots'));

const autoSave = () => {
	console.warn('AUTOSAVE....');
	store.dispatch(upsert_ballots('/prod/myBallots', store.getState().ballots));
};

const render = () => {
	const state = store.getState();
	const ballots = state.ballots;
	const editingBallotIndex = state.ui.ballotToEditIndex;
	ReactDOM.render(
		<App ballots={ballots} ballot={ballots[editingBallotIndex]} dispatch={action => store.dispatch(action(editingBallotIndex))} />,
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
	const changed = previousValue.reduce((result, ballot, i) => {
		return result || ballot !== currentValue[i];
	}, previousValue.length !== currentValue.length);
	if (changed) {
		autoSave();
		console.log('Some deep nested property changed from', previousValue, 'to', currentValue)
	}
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
