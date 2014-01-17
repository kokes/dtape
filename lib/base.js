var DTape = function () { that = this; }

DTape.prototype={that:this};

DTape.prototype = {
  tokens : [],
  variables : { global : {} }, // not really globals, just in the general scope; TODO: refactor
  functions : {}
}


DTape.prototype.error = function(e) {
  console.log(e); // TODO: well, add functionality
  // TODO: log it
}

// repl function to display values to the output
DTape.prototype.display = function(s) {
// TODO: check instanceof to display variables, function definitions
// TODO: when someone only types 'sum', print documentation, error as well
	switch (typeof s) {
		case 'object':
			console.log(s);
			break;
		case 'string':
			console.log('"' + s + '"');
			break;
		case 'number':
			console.log(s);
			break;

		default:
			console.log("Can't recognize command", s);	
	}

}

// TODOs:
// delete unused variables on the way
// make the tokenizer less hard coded

// ternary ?:
// brackets
// booleans
// everything else :)
// multiline comments

// handle scope

// IMPLEMENT
// Precedence climbing method

// resolve transposition sign (') versus 'quotations'

// easy:
// string escaping not supported


// reading
// http://en.wikipedia.org/wiki/Shunting_yard_algorithm
// http://en.wikipedia.org/wiki/Reverse_Polish_notation


// add line/position to tokens for easier troubleshooting
// add <> operator
