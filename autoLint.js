var exec = require('child_process').exec;
var fs = require('fs');
var colors = require('colors');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// will call cb with the processed list of errors obtained from ./jshint-output.log
function buildErrorsList(cb) {
  var file;
  var list = [];
  var lineReader = readline.createInterface({
    input: fs.createReadStream(process.cwd() + '/jshint-output.log')
  });

  lineReader.on('line', function(line) {
    if (/^[0-9]\s*/.test(line)) {
      // it's a line announcing which file the lines after it are in
      file = line.substring(23, line.length);
    } else {
      // it's a line with an error or a blank line
      if (line.length > 0) {
        list.push({
          file: file,
          message: line,
          line: line.match(/\[(\d+),/)[1],
          column: line.match(/\[\d+,(\d+)/)[1]
        });
      }
    }
  });

  lineReader.on('close', function() {
    cb(list);
  });
}

// open vim to the specified file and line number
function openVim(fileName, lineNumber, columnNumber, cb) {
  var command = 'mvim "+call cursor(' + lineNumber + ', ' + columnNumber + ')" ' + fileName;
  exec(command, cb);
}

function queryUser(errorList) {
  if (errorList.length === 0) {
    console.log('Linting is complete!');
  } else {
    var error = errorList[errorList.length - 1];
    console.log('');
    console.log(error.file.underline.yellow + ':');
    console.log(error.message.red);

    const question = 'What would you like to do? (press enter to edit)\n' +
      '  (e) Edit file in vim\n' +
      '  (s) Skip fixing this error for now\n' +
      '  (q) Quit this utility\n';

    rl.question(question, function(res) {
      if (res === 'e' || res === '') {
        openVim(error.file, error.line, error.column, function() {
          errorList.pop();
          queryUser(errorList);
        });
      } else if (res === 's') {
        errorList.pop();
        queryUser(errorList);
      } else {
        rl.close();
      }

    });
  }
}

exec('gulp lint-ui > /dev/null', function(err, stdout, stderr) {
  if (err) {
    console.error(err);
  } else {
    buildErrorsList(queryUser);
  }
});
