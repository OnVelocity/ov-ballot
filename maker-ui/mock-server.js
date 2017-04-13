var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

// store data in memory
const state = {
	ballots: [{"id":"6d054ce9992098b0a94f910096f668c8","questions":[{"id":"7f5dd8c2910b59f9ae3a8e931b3d71d4","text":"Do you like ice cream?","choices":[{"id":"268179462ac4eef9cfdbd293f069d70b","text":"Yes"},{"id":"a618db4d07fa083489b22fa2e103b047","text":"No"}]}],"text":"Model Survey (Mock Server)"}]
};

const crypto = require('crypto');

function setIdValues(item) {
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
}

app.get('/prod/myBallots', function (req, res) {
	console.log('serving ballots');
	res.json(state.ballots);
});

app.put('/prod/myBallots', bodyParser.json(), (req, res) => {
	const upsertBallotsById = req.body.map((b) => {
		const ballot = Object.assign({}, b);
		setIdValues(ballot);
		return ballot;
	}).reduce((map, b) => {
		map[b.id] = b;
		return map;
	}, {});
	state.ballots = state.ballots.reduce((list, ballot) => {
		list.push(upsertBallotsById[ballot.id] || ballot);
		return list;
	}, []);
	res.json({ok: 'Got a PUT request at /prod/myBallots'});
});

app.listen(8033, function () {
	console.log('mock server listening on port http://localhost:8033!');
});
