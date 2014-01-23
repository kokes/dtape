// TODO: compile all function declarations into JS?
// TODO: have an environments.js file, where you handle node/web/C/… separately
// each object will have an ‘each’ method
//	access these methods through ‘.’ or ‘$’?
var DTape = function () { that = this; }

DTape.prototype = {
  tokens : [],
  variables : { global : {} }, // not really globals, just in the general scope; TODO: refactor
  functions : {},
  bytecode : []
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
			that.error("Can't recognize command " + s);	
	}

}
// TODO: MAKE NEWLINE A TOKEN
DTape.prototype.syntax = {
  'OPERATOR' : { // nest these four groups in an object, like .syntax or something
        '+' : 'ADD',
        '-' : 'SUBTRACT',
        '*' : 'MULTIPLY',
        '/' : 'DIVIDE',
        '%' : 'MODULO'
  }, // TODO: add dot operators
  'LOGICAL' : {
        '&&' : 'AND',
        '||' : 'OR'
  }, // TODO: add XOR?
  'COMPARISON' : {
        '==' : 'EQUAL',
        '!=' : 'NOT_EQUAL',
        '<>' : 'NOT_EQUAL', // not unique, but shouldn't cause problems
        '<=' : 'LEQ',
        '>=' : 'GEQ',
        '>'  : 'GT',
        '<'  : 'LT' // TODO: add dot comparison
  },
  'BRACKET' : {
        '(' : 'ROUND_OPEN',
        ')' : 'ROUND_CLOSE',
        '[' : 'SQUARE_OPEN',
        ']' : 'SQUARE_CLOSE',
        '{' : 'CURLY_OPEN',
        '}' : 'CURLY_CLOSE'
  },
  'SYMBOL' : {
        ',' : 'COMMA',
        ';' : 'SEMICOLON',
        '$' : 'DOLLAR',
        '#' : 'HASH',
        '!' : 'BANG',
        '=' : 'ASSIGNMENT',
        '?' : 'QUESTION_MARK',
        ':' : 'COLON',
        '|' : 'PIPE'
  }
}

DTape.prototype.addToken = function(type, value) {
  this.tokens.push( { type: type, value: value } );
}

DTape.prototype.tokenize = function (s) {
  var len = s.length;
  var pos = 0;

  // TODO: maybe create an object 'p' to circumvent
  // non-existence of pass by reference (DRY in matching)

  // TODO: DEBUG, if debugging, delete existing tokens after every submitted command
  this.tokens = [];

  while (pos<len) {
    matched = false; // if 'continue' cannot be invoked, use this dummy
    ch = s.charAt(pos); // we're working with this character
    la = (pos == len-1) ? null : s.charAt(pos+1); // lookahead
    pr = (pos == 0) ? null : s.charAt(pos-1);

    if (ch == " ") {
      pos++;
      continue; // TODO: generalize to all whitespace
    }

    // MATCH STRING LITERALS
    if ( (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') ) { // start of a string literal
      rst = s.substr(pos+1).match(/^[a-zA-Z0-9_]*/); // rest of the literal
      this.addToken('STRING_LITERAL', (rst == null) ? ch : ch + rst[0])
      pos += (rst == null) ? 1 : (ch + rst[0]).length;
      delete rst;
      continue;
    }

    // MATCH NUMERICAL VALUES
    // these can start with an integer or with a period followed by an integer
    // could be '23.42e-1' for example
    // we'll let the parser to distinguish between integers, floats and whatnot
    // no support for negative values, we'll identify the '-' as an operator
      // could be ammended by ch == '-' && la != null & la >= '0' && la <= '9'
    if ( (ch >= '0' && ch <= '9') || (ch == '.' && ( la != null && la >= '0' && la <= '9') )  ) {
      rst = s.substr(pos+1).match(/^[0-9]*(\.[0-9]+)?(e-?[0-9]+)?/); // TODO: DRY
      this.addToken('NUMBER', (rst == null) ? ch : ch + rst[0])
      pos += (rst == null) ? 1 : (ch + rst[0]).length;
      delete rst;
      continue; 
    }

    // TODO
      // if previous token is ']' or string literal, then ' is transposition
    if (pr == ')' || (pr >= 0 && pr <= 9) || (pr >= 'a' && pr <= 'z')
          || (pr >= 'A' && pr <= 'Z') || pr == ']') {
      this.addToken('SYMBOL_APOSTROPHE', "'");
      pos++;
      continue;
    }

    // MATCH STRINGS
    // only allow for ' ' strings at this point
    // TODO: consider double quotes
    if (ch == "'") {
      rst = s.substr(pos+1).match(/^([^']*)'/); // TODO: DRY
      if (rst == null && la != "'") {// no string after ', but also no closing apostrophe
        this.error('Unmatched string quote'); // TODO: tidy, automate, add position
        break; // this block is almost lexing, but hey, it's useful
          // move the break into this.error
          // careful about multiline strings
      }
      this.addToken('STRING', (rst == null) ? '' : rst[1])
      pos += (rst == null) ? 1 : (ch + rst[0]).length;
      delete rst;
      continue;         
    }

    // MATCH COMMENTS
    if ( ch == '/' && la == '/' ) {
      break; // TODO: careful about multiline inputs
    }

    // MATCH OPERATORS and other stuff
    for (group in this.syntax) {
      if (!this.syntax.hasOwnProperty(group)) continue;

      if (this.syntax[group][ch+la] || this.syntax[group][ch]) { // could be a two-letter operator
        this.addToken(group + '_' + (this.syntax[group][ch+la] ? this.syntax[group][ch+la] : this.syntax[group][ch]), this.syntax[group][ch+la] ? ch+la : ch);
        matched = this.tokens[this.tokens.length-1].value.length; // have we matched one, two or three characters?
        break;
      }
    }
    if (matched) {
      pos += matched;
      continue;
    }

    that.error("Unrecognized: '" + ch + "' [" + pos + "]")
    return;
    
    pos++;
  }
  
  delete ch,la,pos,matched;

  return this.tokens;
}
// TODO: let's build an AST (Parr)
DTape.prototype.parse = function() {
	ln = this.tokens.length;
	pr = this.parse;

	if (ln == 1) {
		pr.oneToken();

		return true;
	}

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
DTape.prototype.interpret = function() {
	bc = that.bytecode;
	//console.log(bc);

	for (j in bc) {
		//
	}

	return true;
}
var readline = require('readline'),
  rl = readline.createInterface(process.stdin, process.stdout),
  prefix = '> ';

var dtsess = new DTape();

rl.on('line', function(line) {
  
  // TODO: DEBUG ONLY, dummy out
  if (line[0]== "?")
  	console.log(dtsess.tokenize(line.substr(1,line.length))); // if command starts by '?', then tokenize
  else
  	dtsess.tokenize(line); // otherwise just tokenize

  dtsess.parse(); // TODO: do this automatically somehow, probably in the tokenizer
  dtsess.interpret();

  //rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on('close', function() {
  console.log('Kthxbye!');
  process.exit(0);
});

console.log(prefix + 'Welcome');
rl.setPrompt(prefix, prefix.length);
rl.prompt();

