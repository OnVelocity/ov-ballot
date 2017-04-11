/*global describe, it, expect, beforeEach */
/**
 * Created by onvelocity on 4/11/17.
 */
import * as Reducers from './Reducers'
import deepFreeze from 'deep-freeze'
import { expect } from 'chai';

describe('Reducers', () => {
	describe('action creators', () => {
		let ballotIndex, questionIndex, choiceIndex, text;
		beforeEach(() => {
			ballotIndex = 0;
			questionIndex = 0;
			choiceIndex = 0;
			text = 'mock';
		});
		describe('add_question', () => {
			it('returns expected action object', () => {
				expect(Reducers.add_question(ballotIndex, text)).to.eql({
					type: Reducers.ADD_QUESTION,
					ballotIndex,
					text
				})
			});
		});
		describe('remove_question', () => {
			it('returns expected action object', () => {
				expect(Reducers.remove_question(ballotIndex, questionIndex)).to.eql({
					type: Reducers.REMOVE_QUESTION,
					ballotIndex,
					questionIndex
				})
			});
		});
		describe('add_choice', () => {
			it('returns expected action object', () => {
				expect(Reducers.add_choice(ballotIndex, questionIndex, text)).to.eql({
					type: Reducers.ADD_CHOICE,
					ballotIndex,
					questionIndex,
					text
				})
			});
		});
		describe('remove_choice', () => {
			it('returns expected action object', () => {
				expect(Reducers.remove_choice(ballotIndex, questionIndex, choiceIndex)).to.eql({
					type: Reducers.REMOVE_CHOICE,
					ballotIndex,
					questionIndex,
					choiceIndex
				})
			});
		});
	});
	describe('ballots(state, action)', () => {
		describe('edge cases', () => {
			it('undefined action returns state', () => {
				const beforeState = [];
				const afterState = beforeState;
				deepFreeze(beforeState);
				expect(Reducers.ballots(beforeState)).to.equal(afterState);
			});
			it('undefined action.type returns state', () => {
				const beforeState = [];
				const afterState = beforeState;
				const action = {type: null};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ballots(beforeState, action)).to.equal(afterState);
			});
			it('invalid action.ballotIndex returns state', () => {
				const beforeState = [{test: 'mock ballot'}];
				const afterState = beforeState;
				const action = {type: Reducers.REMOVE_BALLOT, ballotIndex: undefined};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ballots(beforeState, action)).to.eql(afterState);
			});
			it('ballot reducer returns state when invalid action is given', () => {
				const beforeState = [{test: 'mock ballot'}];
				const afterState = beforeState;
				const action = {type: 'test invalid type'};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ballot(beforeState, action)).to.eql(afterState);
			});
			it('question reducer returns state when invalid action is given', () => {
				const beforeState = [{test: 'mock ballot'}];
				const afterState = beforeState;
				const action = {type: 'test invalid type'};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.question(beforeState, action)).to.eql(afterState);
			});
		});
		describe('ADD_BALLOT', () => {
			it('does not modify current state', () => {
				const beforeState = [];
				const action = { type: Reducers.ADD_BALLOT, text: 'test add new ballot' };
				const afterState = [{
					text: 'test add new ballot',
					questions: []
				}];
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ballots(beforeState, action)).to.eql(afterState);
			});
		});
		describe('REMOVE_BALLOT', () => {
			it('does not modify current state', () => {
				const beforeState = [{text: 'old ballot', questions: []}];
				const action = { type: Reducers.REMOVE_BALLOT, ballotIndex: 0 };
				const afterState = [];
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				//console.log(JSON.stringify(result, null, 3));
				expect(result).to.eql(afterState);
			});
		});
		describe('ADD_QUESTION', () => {
			it('does not modify current state', () => {
				const beforeState = [{
					text: 'test old ballot',
					questions: []
				}];
				const action = { type: Reducers.ADD_QUESTION, ballotIndex: 0, text: 'add new question' };
				const afterState = [{
					text: 'test old ballot',
					questions: [{
						text: 'add new question',
						choices: []
					}]
				}];
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result).to.eql(afterState);
			});
		});
		describe('REMOVE_QUESTION', () => {
			it('does not modify current state', () => {
				const beforeState = [{text: 'old ballot', questions: [{text: 'old question', choices: []}]}];
				const action = { type: Reducers.REMOVE_QUESTION, ballotIndex: 0, questionIndex: 0 };
				const afterState = [{
					text: 'old ballot',
					questions: []
				}];
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ballots(beforeState, action)).to.eql(afterState);
			});
		});
		describe('ADD_CHOICE', () => {
			it('does not modify current state', () => {
				const beforeState = [{
					text: 'test old ballot',
					questions: [{
						text: 'old question',
						choices: []
					}]
				}];
				const action = { type: Reducers.ADD_CHOICE, ballotIndex: 0, questionIndex: 0, text: 'add new choice' };
				const afterState = [{
					text: 'test old ballot',
					questions: [{
						text: 'old question',
						choices: [{
							text: 'add new choice'
						}]
					}]
				}];
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result).to.eql(afterState);
			});
		});
		describe('REMOVE_CHOICE', () => {
			it('does not modify current state', () => {
				const beforeState = [{
					text: 'test old ballot',
					questions: [{
						text: 'old question',
						choices: [{
							text: 'old choice'
						}]
					}]
				}];
				const action = { type: Reducers.REMOVE_CHOICE, ballotIndex: 0, questionIndex: 0, choiceIndex: 0 };
				const afterState = [{
					text: 'test old ballot',
					questions: [{
						text: 'old question',
						choices: []
					}]
				}];
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result).to.eql(afterState);
			});
		});
	});
});
