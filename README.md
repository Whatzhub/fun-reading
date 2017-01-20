# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* FunReading.io
* A multiplayer read aloud game
* Version 1.0

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Tools used

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
