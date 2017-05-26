var fs = require('fs');
var babel = require('babel-core');
var examplePlugin = require('./example-plugin');

var dir = process.argv[2];

var walkSync = function(dir, filelist) {
  var fs = fs || require('fs'), files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    } else {
      analyzeFile(dir, file);
    }
  });
};

walkSync(dir);

function analyzeFile(dir, file) {
  if (file.match(/\.js$/)) {
    var out = babel.transformFile(
      dir + file,
      {
        plugins: [examplePlugin, 'syntax-flow', 'transform-decorators-legacy'],
        presets: ['stage-0'],
      },
      function(err, result) {
        result; // => { code, map, ast }
      }
    );
    // fs.readFile(dir + file, function(err, data) {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   var src = data.toString();
    //
    //   // use our plugin to transform the source
    //
    //   console.log(out);
    // });
  }
}
