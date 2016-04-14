Autolinter
=
This is a node script meant to be run from the command line that will automatically

* run the `gulp lint` command
* read the results from `jshint-output.log`
* start a dialogue with the user where is shows them the linting errors one at a time
    and prompts them to fix it
* most importantly: just by pressing Enter, mvim is opened to the file with the error on the correct line and column so you can fix it and immediately return to the dialogue to fix the next one 
