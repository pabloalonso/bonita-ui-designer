var through = require('through2');
var os = require('os');
var path = require('path');
var gutil = require('gulp-util');


function prepare() {
  return through.obj(function (file, enc, cb) {
    var normalizedPath = path.relative(path.resolve(__dirname, '../../..'), file.path);
    var widget;

    try {
      widget = JSON.parse(file.contents.toString());
    } catch(err) {
      cb(err, file);
      return;
    }
    var newfile = [
      '{',
      '  "__file" : "' + escape(normalizedPath) +'",',
      '  "__data" : ' + file.contents.toString(),
      '}',
    ];

    file.contents = new Buffer( newfile.join(os.EOL) );
    cb(undefined, file);
  });

}

function extract() {
  return through.obj(function (file, enc, cb) {

    var i18n = {};
    var widgets;
    var lines = file.contents.toString().split(os.EOL);
    var lineNumber = 0;

    /**
     * parse line by line to find the matched pattern
     * @param  {Array} lines    chunck of lines to parse
     * @param  {String} pattern string to match
     * @return {int}            lineNumber
     */
    function getLine(lines, pattern) {
      var pos = 0;
      lines.some(function(line, index){
        if (new RegExp(pattern).test(line)) {
          pos = index;
          return true;
        }
        return false;
      });
      return pos;
    }
    /**
     * Return comment information for a given key
     * @param  {String} key  the pattern to find
     * @param  {String} path the current filename
     * @return {String}      a gettext comment about the key to translate
     */
    function getInfo(key, path) {
      var start = getLine(lines.slice(lineNumber), key);
      lineNumber = start + 1;
      return '#: '+ unescape(path )+':' + lineNumber;
    }

    /**
     * Transform an object containing gettext info into a pot output
     * @param  {Object} data list of key to translate
     * @return String}       a pot string
     */
    function transform(data) {
      return Object.keys(data).map(function(key){
        return data[key]
          .concat('msgid  "'+key+'"')
          .concat('msgstr ""')
          .concat('')
          .join(os.EOL);
      })
      .join(os.EOL);
    }


    try {
      widgets = JSON.parse('[' + file.contents.toString()+ ']');
    } catch(err) {
      cb(err, file);
      return;
    }

    widgets.forEach(function(widget){
      var fileName = widget.__file;
      var properties = widget.__data.properties;
      i18n = properties.reduce(function(acc, property){
        var value;
        if(property.hasOwnProperty('label')) {
          value = property.label;
          acc[value] = (acc[value] || []).concat( getInfo('label',fileName ));
        }

        if(property.hasOwnProperty('help')) {
          value = property.help;
          acc[value] = (acc[value] || []).concat( getInfo('help', fileName ));
        }
        if(property.hasOwnProperty('defaultValue')) {
          if ( !isNaN(property.defaultValue)) {
            return acc;
          }
          value = property.defaultValue;
          acc[value] = (acc[value] || []).concat( getInfo('defaultValue', fileName ));
        }
        if(property.hasOwnProperty('choiceValues')) {
          value = property.choiceValues;
          acc = value.reduce(function(dict, choice) {
            dict[choice] = (acc[choice] || []).concat( '#: '+ unescape(fileName) +':' + lineNumber );
            return dict;
          }, acc);
        }

        return acc;
      }, i18n);
    });

    file.path = gutil.replaceExtension(file.path, '.pot');
    file.contents = new Buffer( transform(i18n) );

    cb(undefined, file);

  });
};

module.exports = {
  extract: extract,
  prepare: prepare
}
