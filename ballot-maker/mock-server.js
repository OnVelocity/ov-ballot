var express = require('express');
var bodyParser = require('body-parser');
const service = require('./service');
const mockDynamoDB = require('../mock-dynamodb.js').mockDynamoDB;
var app = express();

app.use(bodyParser.json());

// store data in memory
const state = {
	Ballots: [{"id":"6d054ce9992098b0a94f910096f668c8","questions":[{"id":"7f5dd8c2910b59f9ae3a8e931b3d71d4","text":"Do you like ice cream?","choices":[{"id":"268179462ac4eef9cfdbd293f069d70b","text":"Yes"},{"id":"a618db4d07fa083489b22fa2e103b047","text":"No"}]}],"text":"Model Survey (Mock Server)"}]
};

const callbackWrapper = callback => (err, res) => callback(null, {
	body: err ? err.message : res.Items ? res.Items : res
});

const handler = service.buildHandler(mockDynamoDB(state), callbackWrapper);

app.get('/prod/myBallots', function (httpRequest, httpResponse) {
	console.log('serving ballots');
	handler({httpMethod: 'GET'}, null, (err, results) => {
		httpResponse.json(results.body);
	});
});

app.put('/prod/myBallots', bodyParser.json(), (httpRequest, httpResponse) => {
	console.log('saving ballot');
	handler({httpMethod: 'PUT', body: JSON.stringify(httpRequest.body)}, null, (err, results) => {
		httpResponse.json(results.body);
	});
});

app.delete('/prod/myBallots', bodyParser.json(), (httpRequest, httpResponse) => {
	console.log('deleting ballot', JSON.stringify(httpRequest.body));
	handler({httpMethod: 'DELETE', body: JSON.stringify(httpRequest.body)}, null, (err, results) => {
		httpResponse.json(results.body);
	});
});

app.listen(8033, function () {
	console.log('mock server listening on port http://localhost:8033!');
});
