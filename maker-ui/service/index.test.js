/**
 * Created by onvelocity on 4/13/17.
 */

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const service = require('./index');

chai.use(sinonChai);

describe('BallotMakerMicroservice', () => {

	let dynamoMock, handler, event, context, callback;

	beforeEach(() => {
		event = {httpMethod: 'GET'};
		context = {};
		callback = sinon.stub();
		dynamoMock = {
			scan: sinon.stub(),
			putItem: sinon.stub(),
			deleteItem: sinon.stub()
		};
		handler = service.buildHandler(dynamoMock, service.callbackWrapper);
	});

	it('exists', () => {
		expect(handler).to.exist;
	});

	describe('GET', () => {
		it('calls dynamo.scan', () => {
			handler(event);
			expect(dynamoMock.scan).to.have.been.calledWith({'TableName': 'Ballots'});
		});
		it('sets error.message return context on dynamo.scan error', () => {
			dynamoMock.scan = (item, done) => {
				const error = {message: 'test error'};
				done(error, {})
			};
			handler(event, context, callback);
			expect(callback).to.have.been.calledWith(null, {
				statusCode: '400',
				body: 'test error',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		});
		it('sets JSON return context on dynamo.scan success ', () => {
			dynamoMock.scan = (item, done) => {
				const error = false;
				done(error, {Items: {test: 'mock data'}})
			};
			handler(event, context, callback);
			expect(callback).to.have.been.calledWith(null, {
				statusCode: '200',
				body: JSON.stringify({test: 'mock data'}),
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		});
	});

	describe('PUT', () => {
		beforeEach(() => {
			event.httpMethod = 'PUT';
			event.body = "{\"test\":\"mock data\"}";
		});
		it('calls dynamo.putItem', () => {
			handler(event);
			expect(dynamoMock.putItem).to.have.been.called;
		});
		it('sets error.message return context on dynamo.putItem error', () => {
			dynamoMock.putItem = (item, done) => {
				const error = {message: 'test error'};
				done(error, {})
			};
			handler(event, context, callback);
			expect(callback).to.have.been.calledWith(null, {
				statusCode: '400',
				body: 'test error',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		});
		it('sets JSON return context on dynamo.putItem success ', () => {
			dynamoMock.putItem = (item, done) => {
				const error = false;
				done(error, {Items: {test: 'mock data'}})
			};
			handler(event, context, callback);
			expect(callback).to.have.been.calledWith(null, {
				statusCode: '200',
				body: JSON.stringify({test: 'mock data'}),
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		});
	});

	describe('POST', () => {
		beforeEach(() => {
			event.httpMethod = 'POST';
			event.body = "{\"test\":\"mock data\"}";
		});
		it('calls dynamo.putItem', () => {
			handler(event);
			expect(dynamoMock.putItem).to.have.been.called;
		});
		it('sets error.message return context on dynamo.putItem error', () => {
			dynamoMock.putItem = (item, done) => {
				const error = {message: 'test error'};
				done(error, {})
			};
			handler(event, context, callback);
			expect(callback).to.have.been.calledWith(null, {
				statusCode: '400',
				body: 'test error',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		});
		it('sets JSON return context on dynamo.putItem success ', () => {
			dynamoMock.putItem = (item, done) => {
				const error = false;
				done(error, {Items: {test: 'mock data'}})
			};
			handler(event, context, callback);
			expect(callback).to.have.been.calledWith(null, {
				statusCode: '200',
				body: JSON.stringify({test: 'mock data'}),
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		});
	});

	describe('DELETE', () => {
		beforeEach(() => {
			event.httpMethod = 'DELETE';
			event.body = "{\"test\":\"mock data\"}";
		});
		it('calls dynamo.deleteItem', () => {
			handler(event);
			expect(dynamoMock.deleteItem).to.have.been.called;
		});
		it('sets error.message return context on dynamo.deleteItem error', () => {
			dynamoMock.deleteItem = (item, done) => {
				const error = {message: 'test error'};
				done(error, {})
			};
			handler(event, context, callback);
			expect(callback).to.have.been.calledWith(null, {
				statusCode: '400',
				body: 'test error',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		});
		it('sets JSON return context on dynamo.deleteItem success ', () => {
			dynamoMock.deleteItem = (item, done) => {
				const error = false;
				done(error, {Items: {test: 'mock data'}})
			};
			handler(event, context, callback);
			expect(callback).to.have.been.calledWith(null, {
				statusCode: '200',
				body: JSON.stringify({test: 'mock data'}),
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				}
			});
		});
	});

});
