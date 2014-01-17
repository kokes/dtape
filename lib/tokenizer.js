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
        '{' : 'SQUIGGLY_OPEN', // TODO: name?
        '}' : 'SQUIGGLY_CLOSE'
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
