var BasicCard = require('./BasicCard.js');
var basic = require('./basic.json');
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
}

run();


// console.log(basic)
var askCounter = 0;
var correct = 0;
var wrong = 0;
var ask = function() {
	if (askCounter >= basic.length) {
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
		console.log(basic[askCounter].front);
		inquirer.prompt({
			name: 'attempt',
			type: 'input',
			message: 'Answer:'
		}).then(function(answer){
			console.log(answer.attempt);
			if (answer.attempt.toLowerCase() === basic[askCounter].back.toLowerCase()) {
				console.log("Correct!");
				correct ++;
			} else {
				console.log("Incorrect. The answer is " + basic[askCounter].back + ".");
				wrong ++;
			}
			askCounter ++;
			ask();
		});
	}
};
// ask();
	// console.log(i["front"])

var create = function() {
	inquirer.prompt([
		{
			name: 'question',
			type: 'input',
			message: 'Create a question:'
		},
		{
			name: 'answer',
			type: 'input',
			message: 'Correct answer is: '
		}
	]).then(function(entry) {
		var newBasicCard = new BasicCard(entry.question,entry.answer);
		console.log(newBasicCard);
		fs.readFile('basic.json', 'utf-8', function(err, data){
			if (err) throw err;
			// Write in json format
			var data = data.substring(1, data.length - 1)
			if (data.length > 0) data += ', '
			fs.writeFile('basic.json', '[' + data + JSON.stringify(newBasicCard) + ']', function(err){
				if (err) throw err;
				console.log("Question added.")
			})
		})
	})
}


// var beginTest = function() {
// 	fs.readFile('basic.json', 'utf-8', function(err, data) {
// 		if (err) throw err;
// 		var data = JSON.parse(data)
// 		var promptCounter = 0;
// 		// Make prompt recursive
// 		var promptQ = function() {
// 		if (promptCounter >= data.length) return;
// 		console.log(data[promptCounter].front)
// 		inquirer.prompt({
// 			name: 'attempt',
// 			type: 'input',
// 			message: 'Answer:'
// 		}).then(function(answer){
// 			if (answer.attempt.toLowerCase() === data[promptCounter].back.toLowerCase()) {
// 				console.log("Correct!");
// 			} else {
// 				console.log("Incorrect. The answer is " + data[promptCounter].back + ".");
// 			}
// 			promptCounter ++;
// 			promptQ();
// 		});
// 	}
// 		promptQ();
// 	});
// }



// //test 
// create();


// inquirer.prompt([
// 	{
// 		name: 'front',
// 		type: 'input',
// 		message: 
// 	}
// ])
