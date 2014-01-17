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

  dtsess.interpret(); // TODO: do this automatically somehow, probably in the tokenizer

  //rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on('close', function() {
  console.log('Kthxbye!');
  process.exit(0);
});

console.log(prefix + 'Welcome');
rl.setPrompt(prefix, prefix.length);
rl.prompt();

