DTape.prototype.interpret = function() {
	var ln = this.tokens.length;
	var ip = this.interpret;

	if (ln == 1) {
		ip.oneToken();

		return true;
	}

	// simple assignment of numbers or strings, just to test out the syntax
	if (ln > 2 && this.tokens[0].type == 'STRING_LITERAL'
			&& this.tokens[1].type == 'SYMBOL_ASSIGNMENT') {
		
		ip.assignment();

		return true;
	}

	this.error("tooo complicated at this point");
	
	return true; // or what?
}

// if one token passed
DTape.prototype.interpret.oneToken = function() {
	var token = that.tokens[0];
	var variable = that.variables.global[token.value]; // TODO: update for non-'globals'

	// TODO: DEBUG ONLY, dummy out
	if (token.value == '#') {
		console.log(that.tokens);
		console.log(that.variables);
		return;
	}
	
	switch (token.type) {
		case 'STRING_LITERAL':
			if (variable !== undefined)
				that.display(variable); // TODO: display some sugar around it?, maybe have .display() handle it all?
			else
				that.error('Variable "' + token.value + '" does not exist.')
			return;
			break;

		case 'NUMBER':
		case 'STRING':
			that.display({value: token.value, type: token.type});
			return;
			break;

		// TODO: add support for hashbang (call last command)

		default:

		that.error('Command "' + token.value + '" unrecognized')
	}
}

// 'string_literal = ' detected
// what if 'a==2' is passed? Divert it then.
DTape.prototype.interpret.assignment = function () {
	// TODO: check legality
	// TODO: SCOPE

	if (that.tokens[2].type !== 'NUMBER' && that.tokens[2].type !== 'STRING') {
		that.error('I can\'t do this assignment yet.');
	}

	that.variables.global[that.tokens[0].value] = {
		'name' : that.tokens[0].value,
		'value' : that.tokens[2].value,
		'type' : that.tokens[2].type
	}
}
