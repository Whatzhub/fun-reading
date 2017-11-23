# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* FunReading.io
* A multiplayer read aloud game
* Version 1.0

### High level Architecture Overview

* https://docs.google.com/drawings/d/12IjVf1UdGDheY9RRvMSQBg4RH6nnkD9flk-6HFEpR7M/edit

### How do I get set up? ###

webpack -p
Note: The p flag is “production” mode and uglifies/minifies output.

webpack --watch

webpack --display-error-details

sass --watch index.scss:index.css init.scss:init.css --style compressed

uglifyjs ./dist/index.js \
         -o ./dist/index.min.js \
         -p 5 -c -m

### License

The MIT License (MIT)

Copyright (c) 2017 Daniel Chan danielchan.yes@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
