var DTape = function () { that = this; }

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
