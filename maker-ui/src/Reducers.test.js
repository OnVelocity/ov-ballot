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
		let ballotId, questionIndex, choiceIndex, text;
		beforeEach(() => {
			ballotId = 0;
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
				expect(Reducers.remove_ballot(ballotId)).to.eql({
					type: Reducers.REMOVE_BALLOT,
					ballotId
				});
			});
		});
		describe('add_question', () => {
			it('returns expected action object', () => {
				expect(Reducers.add_question(ballotId, text)).to.eql({
					type: Reducers.ADD_QUESTION,
					ballotId,
					text
				});
			});
			it('sets default text', () => {
				expect(Reducers.add_question(ballotId)).to.eql({
					type: Reducers.ADD_QUESTION,
					ballotId,
					text: 'new question'
				});
			});
		});
		describe('remove_question', () => {
			it('returns expected action object', () => {
				expect(Reducers.remove_question(ballotId, questionIndex)).to.eql({
					type: Reducers.REMOVE_QUESTION,
					ballotId,
					questionIndex
				})
			});
		});
		describe('add_choice', () => {
			it('returns expected action object', () => {
				expect(Reducers.add_choice(ballotId, questionIndex, text)).to.eql({
					type: Reducers.ADD_CHOICE,
					ballotId,
					questionIndex,
					text
				})
			});
			it('sets default text', () => {
				expect(Reducers.add_choice(ballotId, questionIndex)).to.eql({
					type: Reducers.ADD_CHOICE,
					ballotId,
					questionIndex,
					text: 'new choice'
				});
			});
		});
		describe('remove_choice', () => {
			it('returns expected action object', () => {
				expect(Reducers.remove_choice(ballotId, questionIndex, choiceIndex)).to.eql({
					type: Reducers.REMOVE_CHOICE,
					ballotId,
					questionIndex,
					choiceIndex
				});
			});
		});
		describe('set_ballot_text', () => {
			it('returns expected action object', () => {
				expect(Reducers.set_ballot_text(ballotId, text)).to.eql({
					type: Reducers.SET_BALLOT_TEXT,
					ballotId,
					text
				});
			});
		});
		describe('set_ballot_to_edit', () => {
			it('returns expected action object', () => {
				expect(Reducers.set_ballot_to_edit(ballotId)).to.eql({
					type: Reducers.SET_BALLOT_TO_EDIT,
					ballotToEditId: ballotId
				});
			});
		});
		describe('delete_ballots_status', () => {
			it('returns expected action object', () => {
				const status = {status: 'test'};
				const response = {response: 'mock'};
				deepFreeze(status);
				deepFreeze(response);
				expect(Reducers.delete_ballots_status(status, response)).to.eql({
					type: Reducers.DELETE_BALLOTS_STATUS,
					status,
					response
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
		describe('delete_ballots(ballotIds, [fetch])', () => {
			it('returns expected action object', () => {
				const status = {status: 'test'};
				const response = {response: 'mock'};
				deepFreeze(status);
				deepFreeze(response);
				expect(Reducers.delete_ballots(['test id'])).to.be.a('function');
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
			describe('delete_ballots', () => {
				it('invokes call_api success', () => {
					Reducers.delete_ballots(url, [{id: 'test id'}], api, options)(dispatch);
					expect(dispatch).to.have.been.called;
				});
				it('invokes call_api fail', () => {
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
					Reducers.delete_ballots(url, [{id: 'test id'}], api, options)(dispatch);
					expect(dispatch).to.have.been.called;
				});
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
				expect(() => Reducers.ui(beforeState, action)).to.not.throw();
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
				const afterState = {isLoadingBallots: true};
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
			it('invalid action.ballotId returns state', () => {
				const beforeState = [{id: 1, test: 'mock ballot'}];
				const afterState = beforeState;
				const action = {type: Reducers.REMOVE_BALLOT, ballotId: undefined};
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
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(() => Reducers.ballots(beforeState, action)).to.not.throw();
			});
			it('adds new ballot given action.text', () => {
				const beforeState = [];
				const action = {type: Reducers.ADD_BALLOT, text: 'test add new ballot'};
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result[0].text).to.eql('test add new ballot');
			});
			it('adds new ballot given action.ballot', () => {
				const beforeState = [];
				const action = {type: Reducers.ADD_BALLOT, ballot: {id: 'test add new ballot'}};
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result).to.eql([{id: 'test add new ballot'}]);
			});
		});
		describe('SET_BALLOT_TEXT', () => {
			it('does not modify current state', () => {
				const beforeState = [{text: 'old ballot'}];
				const action = {type: Reducers.SET_BALLOT_TEXT, ballotId: 0, text: 'test set ballot text value'};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(() => Reducers.ballots(beforeState, action)).to.not.throw();
			});
			it('sets the ballot text value', () => {
				const beforeState = [{id: 0, text: 'old ballot'}];
				const action = {type: Reducers.SET_BALLOT_TEXT, ballotId: 0, text: 'test set ballot text value'};
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result[0].text).to.eql('test set ballot text value');
			});
			it('does not set ballot text if text is same', () => {
				const beforeState = [{id: 0, text: 'old ballot'}];
				const action = {type: Reducers.SET_BALLOT_TEXT, ballotId: 0, text: 'old ballot'};
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result).to.eql(beforeState);
			});
			it('does not modify current state when text does not change', () => {
				const beforeState = [{text: 'old ballot'}];
				const action = {type: Reducers.SET_BALLOT_TEXT, ballotId: 0, text: 'old ballot'};
				const afterState = beforeState;
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(Reducers.ballots(beforeState, action)).to.eql(afterState);
			});
		});
		describe('REMOVE_BALLOT', () => {
			it('does not modify current state', () => {
				const beforeState = [{text: 'old ballot', questions: []}];
				const action = {type: Reducers.REMOVE_BALLOT, ballotId: 0};
				const afterState = [];
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(() => Reducers.ballots(beforeState, action)).to.not.throw();
			});
		});
		describe('ADD_QUESTION', () => {
			it('does not modify current state', () => {
				const beforeState = [{
					text: 'test old ballot',
					questions: []
				}];
				const action = {type: Reducers.ADD_QUESTION, ballotId: 0, text: 'add new question'};
				const afterState = [{
					text: 'test old ballot',
					questions: [{
						text: 'add new question',
						choices: []
					}]
				}];
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(() => Reducers.ballots(beforeState, action)).to.not.throw();
			});
			it('adds question to ballot', () => {
				const beforeState = [{
					id: 0,
					text: 'test old ballot',
					questions: []
				}];
				const action = {type: Reducers.ADD_QUESTION, ballotId: 0, text: 'add new question'};
				deepFreeze(beforeState);
				deepFreeze(action);
				const result = Reducers.ballots(beforeState, action);
				expect(result[0].questions[0].text).to.eql('add new question');
			});
		});
		describe('REMOVE_QUESTION', () => {
			it('does not modify current state', () => {
				const beforeState = [{text: 'old ballot', questions: [{text: 'old question', choices: []}]}];
				const action = {type: Reducers.REMOVE_QUESTION, ballotId: 0, questionIndex: 0};
				deepFreeze(beforeState);
				deepFreeze(action);
				expect(() => Reducers.ballots(beforeState, action)).to.not.throw();
			});
			it('removes question from ballot', () => {
				const beforeState = [{id: 0, text: 'old ballot', questions: [{text: 'old question', choices: []}]}];
				const action = {type: Reducers.REMOVE_QUESTION, ballotId: 0, questionIndex: 0};
				deepFreeze(beforeState);
				deepFreeze(action);
				const results = Reducers.ballots(beforeState, action);
				expect(results[0].questions.length).to.eql(0);
			});
		});
		describe('ADD_CHOICE', () => {
			it('does not modify current state', () => {
				const beforeState = [
					{
						id: 0,
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
						id: 1,
						text: 'old ballot 2'
					}
				];
				const action = {type: Reducers.ADD_CHOICE, ballotId: 0, questionIndex: 0, text: 'add new choice'};
				deepFreeze(beforeState);
				deepFreeze(action);
				const test = () => Reducers.ballots(beforeState, action);
				expect(test).to.not.throw();
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
				const action = {type: Reducers.REMOVE_CHOICE, a: 0, questionIndex: 0, choiceIndex: 0};
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
