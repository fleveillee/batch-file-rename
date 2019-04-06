const fs = require('fs');
const path = require('path');
const Confirm = require('prompt-confirm');

const monthNames = new Map([
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

function renameFiles(filenamesMap, filesPath = '') {
  filenamesMap.forEach((newFilename, filename) => {
    fs.rename(filesPath + filename, filesPath + newFilename, (err) => {
      if (err) console.log(`ERROR: ${err}`);
    });
  });
}

fs.readdir(dirname, (err, files) => {
  if (err) {
    console.error('Could not access the directory.', err);
    process.exit(1);
  }

  const fileRenamingMap = new Map();
  console.log(`Found ${files.length} files in folder`);
  files.forEach((filename) => {
    // console.log(filename);

    let newFilename = filename;

    monthNames.forEach((number, month) => {
      if (newFilename.includes(month)) {
        newFilename = newFilename.replace(month, number);
      }
    });

    if (filename !== newFilename) {
      fileRenamingMap.set(filename, newFilename);
    }
  });

  if (fileRenamingMap.size) {
    console.log(`Found ${fileRenamingMap.size} files to be renamed:`);
    fileRenamingMap.forEach(
      (newFilename, filename) => console.log(`${filename} => ${newFilename}`),
    );

    new Confirm('Proceed?').ask((answer) => {
      if (answer) {
        let filesPath = dirname;
        if (dirname.slice(-1) !== path.sep) {
          filesPath += path.sep;
        }
        renameFiles(fileRenamingMap, filesPath);
      }
    });
  } else {
    console.log('No files found matching rename criterias');
  }
});
