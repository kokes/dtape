LIBS = lib/base.js lib/tokenizer.js lib/parser.js lib/interpreter.js repl.js

all: concat uglify todo

concat:
	cat $(LIBS) > dtape.js

uglify: dtape.js
	uglifyjs dtape.js -o dtape.min.js

todo:
	cat dtape.js | grep TODO > TODO.txt

# test: