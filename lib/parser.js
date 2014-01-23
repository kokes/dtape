// TODO: let's build an AST (Parr)
DTape.prototype.parse = function() {
	ln = this.tokens.length;
	pr = this.parse;

	if (ln == 1) {
		pr.oneToken();

		return true;
	}

	// SHUNTING TEST

	pr.buildAST();

	return;
	// SHUNTING TEST

	// simple assignment of numbers or strings, just to test out the syntax
	if (ln > 2 && this.tokens[0].type == 'STRING_LITERAL'
			&& this.tokens[1].type == 'SYMBOL_ASSIGNMENT') {
		
		pr.assignment();

		return true;
	}

	this.error("tooo complicated at this point"); // TODO

	delete ln, pr;
	
	return true; // or what?
}

DTape.prototype.parse.addInstruction = function(name, obj) {
	// TODO: some sort of validation?
	that.bytecode[parseInt(that.bytecode.length)] = [];
	that.bytecode[parseInt(that.bytecode.length)-1][name] = obj;
}

// if one token passed
DTape.prototype.parse.oneToken = function() {
	var token = that.tokens[0];
//	var variable = that.variables.global[token.value]; // TODO: update for non-'globals'

	// TODO: DEBUG ONLY, dummy out
	if (token.value == '#') { // just to see what's up
		console.log(that.bytecode);
		return;
	}
	
	switch (token.type) {
		case 'STRING_LITERAL':
		case 'NUMBER':
		case 'STRING':
			pr.addInstruction("display", { value: token.value, type: token.type});
			return;
			break;

		// TODO: add support for hashbang (call last command), only if ENV=console

		default:
			that.error('Command "' + token.value + '" unrecognized')
	}
}

// 'string_literal = ' detected
// what if 'a==2' is passed? Divert it then.
DTape.prototype.parse.assignment = function () {
	// TODO: check legality
	// TODO: SCOPE

	if (that.tokens[2].type !== 'NUMBER' && that.tokens[2].type !== 'STRING') {
		that.error('I can\'t do this assignment yet.');
		return false;
	}

	if (ln == 3) {
		pr.addInstruction("assign", {
			'name' : that.tokens[0].value,
			'value' : that.tokens[2].value,
			'type' : that.tokens[2].type
		});
		return true;
	}

	that.error('Can\'t do this yet');
	return false;
}

DTape.prototype.parse.buildAST = function () {
	
}
