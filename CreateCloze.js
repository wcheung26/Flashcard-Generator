var ClozeCard = require('./ClozeCard.js');
var cloze = require('./cloze.json');
var inquirer = require('inquirer');
var fs = require('fs');

var run = function() {
	inquirer.prompt({
		name: 'controller',
		type: 'confirm',
		message: 'Add new flash cards?'
	}).then(function(answer) {
		if (answer.controller === true) {
			create();
		} else {
			ask();
		}
	})
};

run();

var askCounter = 0;
var correct = 0;
var wrong = 0;
var ask = function() {
	if (askCounter >= cloze.length) {
		console.log('End of cards. You got ' + correct + ' correct and ' + wrong + ' wrong.');
		inquirer.prompt({
			name: 'restart',
			type: 'confirm',
			message: 'Play again?'
		}).then(function(answer){
			if (answer.restart) run();
			askCounter = 0;
			correct = 0;
			wrong = 0;
			return;
		})
	} else {
		console.log(cloze[askCounter].partial);
		inquirer.prompt({
			name: 'attempt',
			type: 'input',
			message: 'Answer:'
		}).then(function(answer){
			console.log(answer.attempt);
			if (answer.attempt.toLowerCase() === cloze[askCounter].cloze.toLowerCase()) {
				console.log("Correct! " + cloze[askCounter].fullText);
				correct ++;
			} else {
				console.log("Incorrect. " + cloze[askCounter].fullText);
				wrong ++;
			}
			askCounter ++;
			ask();
		});
	}
};


var create = function() {
	inquirer.prompt(
		{
			name: 'question',
			type: 'input',
			message: 'Type a complete sentence (full-text): '
		}
	).then(function(entry) {
		var full = entry.question;
		inquirer.prompt({
			name: 'answer',
			type: 'input',
			message: 'Cloze out the word: ',
			validate: function(word) {
				if (full.indexOf(word) >= 0) {
					return true;
				} else {
					console.log('This word does not exist in the sentence.');
				}
			}
		}).then(function(entry) {
			var newClozeCard = new ClozeCard(full,entry.answer);
			console.log(newClozeCard);
			fs.readFile('cloze.json', 'utf-8', function(err, data){
				if (err) throw err;
				// Write in json format
				var data = data.substring(1, data.length - 1)
				if (data.length > 0) data += ', '
				fs.writeFile('cloze.json', '[' + data + JSON.stringify(newClozeCard) + ']', function(err){
					if (err) throw err;
					console.log("Question added.")
					run();
				});
			});

		});
	});
};

