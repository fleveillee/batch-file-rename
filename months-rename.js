const fs = require('fs');
const Confirm = require('prompt-confirm');

let monthNames = new Map([
  ['Jan', '.01.'],
  ['Feb', '.02.'],
  ['Mar', '.03.'],
  ['Apr', '.04.'],
  ['May', '.05.'],
  ['Jun', '.06.'],
  ['Jul', '.07.'],
  ['Aug', '.08.'],
  ['Sep', '.09.'],
  ['Oct', '.10.'],
  ['Nov', '.11.'],
  ['Dec', '.12.'],
]);

const dirname = process.argv[2] || process.cwd();

fs.readdir(dirname, (err, files) => {
  if (err) {
    console.error('Could not access the directory.', err);
    process.exit(1);
  }

  let fileRenamingMap = new Map();

  files.forEach((filename, index) => {
    //console.log(filename);

    let newFilename = filename;

    for (var key of monthNames.keys()) {
      if (newFilename.includes(key)) {
        newFilename = newFilename.replace(key, monthNames.get(key));
      }
    }

    if (filename !== newFilename) {
      fileRenamingMap.set(filename, newFilename);
    }
  });

  if (fileRenamingMap.size) {
    console.log('The following files will be renamed:');
    for (let [filename, newFilename] of fileRenamingMap.entries()) {
      console.log(`${filename} => ${newFilename}`);
    }

    let confirm = new Confirm('Proceed?').run().then(function(proceed) {
      if (proceed) {
        renameFiles(fileRenamingMap);
      }
    });
  } else {
    console.log('No files found matching rename criterias');
  }
});

function renameFiles(filenamesMap) {
  for (let [filename, newFilename] of filenamesMap.entries()) {
    fs.rename(filename, newFilename, err => {
      if (err) console.log('ERROR: ' + err);
    });
  }
}
