/*global describe, it, expect, beforeEach */
/**
 * Created by onvelocity on 4/11/17.
 */
import * as Reducers from './Reducers'
import deepFreeze from 'deep-freeze'
import chai, { expect } from 'chai';
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.use(sinonChai);

describe('Reducers', () => {
	describe('action creators', () => {
		let ballotIndex, questionIndex, choiceIndex, text;
		beforeEach(() => {
			ballotIndex = 0;
			questionIndex = 0;
			choiceIndex = 0;
			text = 'mock';
		});
		describe('add_ballot', () => {
			it('returns expected action object', () => {
				expect(Reducers.add_ballot(text)).to.eql({
					type: Reducers.ADD_BALLOT,
					text
				});
			});
			it('sets default text', () => {
				expect(Reducers.add_ballot()).to.eql({
					type: Reducers.ADD_BALLOT,
					text: 'new ballot'
				});
			});
		});
		describe('remove_ballot', () => {
			it('returns expected action object', () => {
				expect(Reducers.remove_ballot(ballotIndex)).to.eql({
					type: Reducers.REMOVE_BALLOT,
					ballotIndex
				});
			});
		});
		describe('add_question', () => {
			it('returns expected action object', () => {
				expect(Reducers.add_question(ballotIndex, text)).to.eql({
					type: Reducers.ADD_QUESTION,
					ballotIndex,
					text
				});
			});
			it('sets default text', () => {
				expect(Reducers.add_question(ballotIndex)).to.eql({
					type: Reducers.ADD_QUESTION,
					ballotIndex,
					text: 'new question'
				});
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
			it('sets default text', () => {
				expect(Reducers.add_choice(ballotIndex, questionIndex)).to.eql({
					type: Reducers.ADD_CHOICE,
					ballotIndex,
					questionIndex,
					text: 'new choice'
				});
			});
		});
		describe('remove_choice', () => {
			it('returns expected action object', () => {
				expect(Reducers.remove_choice(ballotIndex, questionIndex, choiceIndex)).to.eql({
					type: Reducers.REMOVE_CHOICE,
					ballotIndex,
					questionIndex,
					choiceIndex
				});
			});
		});
		describe('set_ballot_text', () => {
			it('returns expected action object', () => {
				expect(Reducers.set_ballot_text(ballotIndex, text)).to.eql({
					type: Reducers.SET_BALLOT_TEXT,
					ballotIndex,
					text
				});
			});
		});
		describe('set_ballot_to_edit', () => {
			it('returns expected action object', () => {
				expect(Reducers.set_ballot_to_edit(ballotIndex)).to.eql({
					type: Reducers.SET_BALLOT_TO_EDIT,
					ballotToEditIndex: ballotIndex
				});
			});
		});
		describe('fetch_ballots_status', () => {
			it('returns expected action object', () => {
				const status = {status: 'test'};
				const response = {response: 'mock'};
				deepFreeze(status);
				deepFreeze(response);
				expect(Reducers.fetch_ballots_status(status, response)).to.eql({
					type: Reducers.FETCH_BALLOTS_STATUS,
					status,
					response
				});
			});
		});
		describe('fetch_ballots(url, [fetch])', () => {
			it('returns expected action object', () => {
				const status = {status: 'test'};
				const response = {response: 'mock'};
				deepFreeze(status);
				deepFreeze(response);
				expect(Reducers.fetch_ballots('mock url')).to.be.a('function');
			});
		});
		describe('call_api(url, api, options, dispatch, status)', () => {
			let url, api, options, dispatch, status, promise;
			beforeEach(() => {
				promise = new Promise(
					(resolve) => {
						resolve({
							ok: true,
							json() {
								return new Promise((resolve) => resolve({test: 'mock json'}));
							}
						})
					});
				url = 'test url';
				api = sinon.stub().returns(promise);
				options = {test: 'mock'};
				dispatch = sinon.spy();
				status = sinon.stub().returns({test: 'mock action status'});
			});
			describe('fetch_ballots', () => {
				it('invokes call_api', (done) => {
					Reducers.fetch_ballots(url, api, options)(dispatch);
					setTimeout(() => {
						expect(dispatch).to.have.been.calledTwice;
						done();
					}, 100);
				});
			});
			describe('upsert_ballots', () => {
				it('invokes call_api', (done) => {
					Reducers.upsert_ballots(url, [{test: 'mock ballots'}], api, options)(dispatch);
					setTimeout(() => {
						expect(dispatch).to.have.been.calledTwice;
						done();
					}, 100);
				});
			});
			it('it calls status for OPENED and ERROR when response is not OK', (done) => {
				promise = new Promise(
					(resolve) => {
						resolve({
							ok: false,
							json() {
								return new Promise((resolve) => resolve({test: 'mock json'}));
							}
						})
					});
				api = sinon.stub().returns(promise);
				Reducers.call_api(url, api, options, dispatch, status).then(() => {
					expect(status).to.have.been.calledTwice;
					expect(status).to.have.been.calledWith('OPENED', sinon.match.any);
					expect(status).to.have.been.calledWith('ERROR', sinon.match.any);
					done();
				});
			});
			it('it calls status for OPENED and DONE', (done) => {
				Reducers.call_api(url, api, options, dispatch, status).then(() => {
					expect(status).to.have.been.calledTwice;
					expect(status).to.have.been.calledWith('OPENED', sinon.match.any);
					expect(status).to.have.been.calledWith('DONE', sinon.match.any);
					done();
				});
			});
			it('it calls api with url and options', (done) => {
				Reducers.call_api(url, api, options, dispatch, status);
				expect(api).to.have.been.calledWith(url, options);
				done();

			});
			it('it calls dispatcher before calling api', (done) => {
				api = () => {
					expect(dispatch).to.have.been.calledOnce;
					done();
				};
				Reducers.call_api(url, api, options, dispatch, status);
			});
			it('it calls dispatcher before calling api with OPENED status action', (done) => {
				api = () => {
					expect(dispatch).to.have.been.calledWith({test: 'mock opened status action'});
					done();
				};
				status = () => {
					return {test: 'mock opened status action'};
				};
				Reducers.call_api(url, api, options, dispatch, status);
			});
		});
	});
	describe('ui(state, action)', () => {
		describe('SET_BALLOT_TO_EDIT', () => {
			it('does not modify current state', () => {
				const beforeState = [];
				const action = {type: Reducers.SET_BALLOT_TO_EDIT, ballotToEditIndex: 0};
				const afterState = {ballotToEditIndex: 0};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ui(beforeState, action)).to.eql(afterState);
			});
		});
		describe('FETCH_BALLOTS_STATUS', () => {
			it('does not modify current state', () => {
				const beforeState = [];
				const action = {type: Reducers.FETCH_BALLOTS_STATUS, status: 'OPENED'};
				const afterState = {isLoadingBallots: true};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ui(beforeState, action)).to.eql(afterState);
			});
			it('handles status OPENED', () => {
				const beforeState = [];
				const action = {type: Reducers.FETCH_BALLOTS_STATUS, status: 'OPENED'};
				const afterState = {isLoadingBallots: true};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ui(beforeState, action)).to.eql(afterState);
			});
			it('handles status DONE', () => {
				const beforeState = [];
				const action = {type: Reducers.FETCH_BALLOTS_STATUS, status: 'DONE'};
				const afterState = {isLoadingBallots: false};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ui(beforeState, action)).to.eql(afterState);
			});
			it('handles status ERROR', () => {
				const beforeState = [];
				const action = {type: Reducers.FETCH_BALLOTS_STATUS, status: 'ERROR', response: {error: {message: 'test'}}};
				const afterState = {isLoadingBallots: false, errorMessage: 'test'};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ui(beforeState, action)).to.eql(afterState);
			});
			it('handles unknown status', () => {
				const beforeState = {};
				const action = {type: Reducers.FETCH_BALLOTS_STATUS, status: null, response: 'mock'};
				const afterState = {};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ui(beforeState, action)).to.eql(afterState);
			});
			it('handles undefined state', () => {
				const beforeState = undefined;
				const action = {type: Reducers.FETCH_BALLOTS_STATUS, status: 'OPENED', response: 'mock'};
				const afterState = {ballotToEditIndex: 0, isLoadingBallots: true};
				//deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ui(beforeState, action)).to.eql(afterState);
			});
		});
		it('handles undefined action', () => {
			const beforeState = {};
			const action = undefined;
			const afterState = {};
			deepFreeze(beforeState);
			//deepFreeze(action);
			expect(Reducers.ui(beforeState, action)).to.eql(afterState);
		});
	});
	describe('ballots(state, action)', () => {
		describe('edge cases', () => {
			it('undefined state returns default initial state', () => {
				const beforeState = undefined;
				const afterState = [];
				//deepFreeze(beforeState);
				expect(Reducers.ballots(beforeState)).to.eql(afterState);
			});
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
				const action = {type: Reducers.ADD_BALLOT, text: 'test add new ballot'};
				const afterState = [{
					text: 'test add new ballot',
					questions: []
				}];
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ballots(beforeState, action)).to.eql(afterState);
			});
		});
		describe('SET_BALLOT_TEXT', () => {
			it('does not modify current state', () => {
				const beforeState = [{text: 'old ballot'}];
				const action = {type: Reducers.SET_BALLOT_TEXT, ballotIndex: 0, text: 'test set ballot text value'};
				const afterState = [{
					text: 'test set ballot text value'
				}];
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ballots(beforeState, action)).to.eql(afterState);
			});
			it('does not modify current state when text does not change', () => {
				const beforeState = [{text: 'old ballot'}];
				const action = {type: Reducers.SET_BALLOT_TEXT, ballotIndex: 0, text: 'old ballot'};
				const afterState = beforeState;
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ballots(beforeState, action)).to.eql(afterState);
			});
		});
		describe('REMOVE_BALLOT', () => {
			it('does not modify current state', () => {
				const beforeState = [{text: 'old ballot', questions: []}];
				const action = {type: Reducers.REMOVE_BALLOT, ballotIndex: 0};
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
				const action = {type: Reducers.ADD_QUESTION, ballotIndex: 0, text: 'add new question'};
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
				const action = {type: Reducers.REMOVE_QUESTION, ballotIndex: 0, questionIndex: 0};
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
				const beforeState = [
					{
						text: 'test old ballot 1',
						questions: [
							{
								text: 'old question 1',
								choices: []
							},
							{
								text: 'old question 2',
								choices: []
							}
						]
					},
					{
						text: 'old ballot 2'
					}
				];
				const action = {type: Reducers.ADD_CHOICE, ballotIndex: 0, questionIndex: 0, text: 'add new choice'};
				const afterState = [
					{
						text: 'test old ballot 1',
						questions: [
							{
								text: 'old question 1',
								choices: [{
									text: 'add new choice'
								}]
							},
							{
								text: 'old question 2',
								choices: []
							}
						]
					},
					{
						text: 'old ballot 2'
					}
				];
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
						choices: [
							{
								text: 'old choice 1'
							},
							{
								text: 'old choice 2'
							}
						]
					}]
				}];
				const action = {type: Reducers.REMOVE_CHOICE, ballotIndex: 0, questionIndex: 0, choiceIndex: 0};
				const afterState = [{
					text: 'test old ballot',
					questions: [{
						text: 'old question',
						choices: [{
							text: 'old choice 2'
						}]
					}]
				}];
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result).to.eql(afterState);
			});
		});
		describe('FETCH_BALLOTS_STATUS', () => {
			it('does not modify current state', () => {
				const beforeState = [{
					text: 'mock'
				}];
				const afterState = [{
					text: 'mock'
				}];
				const action = {type: Reducers.FETCH_BALLOTS_STATUS, status: 'DONE', response: {json: afterState}};
				deepFreeze(beforeState);
				deepFreeze(afterState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result).to.eql(afterState);
			});
			it('handles status DONE', () => {
				const beforeState = [{
					text: 'mock'
				}];
				const afterState = [{
					text: 'test new ballot'
				}];
				const action = {type: Reducers.FETCH_BALLOTS_STATUS, status: 'DONE', response: {json: afterState}};
				deepFreeze(beforeState);
				deepFreeze(afterState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result).to.eql(afterState);
			});
			it('handles status OPENED', () => {
				const beforeState = [{
					text: 'mock'
				}];
				const afterState = [{
					text: 'mock'
				}];
				const action = {type: Reducers.FETCH_BALLOTS_STATUS, status: 'OPENED', response: {ts: afterState}};
				deepFreeze(beforeState);
				deepFreeze(afterState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result).to.eql(afterState);
			});
		});
	});
});
