#!/bin/bash
cat lib/base.js lib/tokenizer.js lib/interpreter.js repl.js > dtape.js
uglifyjs dtape.js > dtape.min.js