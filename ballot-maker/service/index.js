'use strict';

/**
 * Created by onvelocity on 4/13/17.
 */

const crypto = require('crypto');

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const DELETE = 'DELETE';

const putItem = (dynamo, ballot, done) => {
	setIdValues(ballot);
	const item = {
		TableName: "Ballots",
		Item: ballot
	};
	dynamo.putItem(item, done);
};

const deleteItem = (dynamo, ballot, done) => {
	const id = (ballot && ballot.id) || ballot;
	const item = {
		Key: {id: id},
		TableName: 'Ballots'
	};
	dynamo.deleteItem(item, done);
};

const setIdValues = (item) => {
	if (!item) {
		return;
	}
	if (!item.id) {
		item.id = crypto.createHash('md5').update(JSON.stringify(item)).digest("hex");
	}
	if (item.questions) {
		item.questions.forEach(question => {
			if (!question.id) {
				question.id = crypto.createHash('md5').update(JSON.stringify(question) + item.id).digest("hex");
			}
			if (question.choices) {
				question.choices.forEach(choice => {
					choice.id = crypto.createHash('md5').update(JSON.stringify(choice) + question.id).digest("hex");
				});
			}
		});
	}
};

const handleGet = (dynamo, event, context, done) => {
	dynamo.scan({ TableName: "Ballots" }, done);
};

const handlePutOrPost = (dynamo, event, context, done) => {
	const input = JSON.parse(event.body);
	const ballots = input instanceof Array ? input : [input];
	ballots.forEach((ballot) => putItem(dynamo, ballot, done));
};

const handleDelete = (dynamo, event, context, done) => {
	const input = JSON.parse(event.body);
	const ballots = input instanceof Array ? input : [input];
	ballots.forEach((ballot) => deleteItem(dynamo, ballot, done));
};

const callbackWrapper = callback => (err, res) => callback(null, {
	statusCode: err ? '400' : '200',
	body: err ? err.message : JSON.stringify((res.Items ? res.Items : res)),
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	}
});

const buildHandler = (dynamo, callbackWrapper) => (event, context, callback) => {

	// callbackWrapper is injected so we can test the callback
	const done = callbackWrapper(callback);

	switch (event.httpMethod) {
		case GET:
			handleGet(dynamo, event, context, done);
			break;
		case PUT:
		case POST:
			handlePutOrPost(dynamo, event, context, done);
			break;
		case DELETE:
			handleDelete(dynamo, event, context, done);
			break;
		default:
			done(new Error(`Unsupported method "${event.httpMethod}"`));
	}

};

exports.get = handleGet;
exports.put = handlePutOrPost;
exports.post = handlePutOrPost;
exports.delete = handleDelete;
exports.buildHandler = buildHandler;
exports.callbackWrapper = callbackWrapper;
exports.putItem = putItem;
exports.deleteItem = deleteItem;
exports.setIdValues = setIdValues;

// to install this lib on AWS Lambda...
//exports.handler = buildHandler(new require('dynamodb-doc').DynamoDB(), callbackWrapper);

/**
 * AWS Lambda GET, POST, PUT and DELETE tests - run these in test runner and confirm dynamodb table updated accordingly

 {
  "httpMethod": "PUT",
  "body": "{\"text\":\"Model Survey\",\"questions\":[{\"text\":\"Do you like ice cream?\",\"choices\":[{\"text\":\"Yes\"},{\"text\":\"No\"}]}]}"
}
 {
  "httpMethod": "POST",
  "body": "{\"text\":\"Model Survey\",\"questions\":[{\"text\":\"Do you like ice cream?\",\"choices\":[{\"text\":\"Yes\"},{\"text\":\"No\"}]}]}"
}
 {
  "httpMethod": "GET"
}
 {
  "httpMethod": "DELETE",
  "body": "[\"6d054ce9992098b0a94f910096f668c8\"]"
}

*/