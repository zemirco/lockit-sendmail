
var fs = require('fs');
var juice = require('juice');

juice('./templates/base-boxed-basic-query/original.html', function(err, html) {
  if (err) console.log(err);

  fs.writeFile('./templates/base-boxed-basic-query/original-inline-styles.html', html, function(err) {
    if (err) console.log(err);
    console.log('It\'s saved!');
  });

});