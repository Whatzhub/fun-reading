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

### Who do I talk to? ###

* Daniel Chan / danielchan.yes@gmail.com
