Autolinter
=
This is a node script meant to be run from the command line that will automatically

* run the `gulp lint` command
* read the results from `jshint-output.log`
* start a dialogue with the user where it shows them the linting errors one at a time
    and prompts them to fix it
* most importantly: just by pressing Enter, mvim is opened to the file with the error on the correct line and column so you can fix it and immediately return to the dialogue to fix the next one 

Known Issues
=
* since autolinter only runs the lint command once before taking you through the step-by-step error fixing, the line number for errors may be wrong
    if you already fixed an error in that same file previously in the autolinting "session". No practical fix for this besides altering the 
    behavior of the program to re-run lint after each step in the step-by-step dialogue. But that takes too long for long lint steps, so I won't fix in that way. Workaround
    is just deal with the cursor being set to the slightly wrong line number, or restart the autolint process if it starts happening
    too often
