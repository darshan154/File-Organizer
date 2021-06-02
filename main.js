let fs = require('fs');
let path = require('path');

let types = {
  media: ['mp4', 'mkv'],
  archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', 'xz'],
  documents: ['docx', 'doc', 'xlsx', 'xls', 'odt', 'odp', 'odg', 'txt', 'ps'],
  pdfs: ['pdf'],
  ppts: ['ppt', 'pptx'],
  imgs: ['png', 'jpg', 'jpeg'],
  app: ['exe', 'apk', 'dmg', 'pkg', 'deb'],
};

let inputArr = process.argv.slice(2);
console.log(inputArr);

let command = inputArr[0];
switch (command) {
  case 'tree':
    treeFn(inputArr[1]);
    break;

  case 'organize':
    organizeFn(inputArr[1]);
    break;

  case 'help':
    helpFn();
    break;

  default:
    console.log('🙏 Input Right command');
    break;
}

function treeFn(dirPath) {
  if (dirPath == undefined) {
    console.log('Kindly enter the path');
    return;
  }

  //   let destPath;
  let doesExist = fs.existsSync(dirPath);
  if (doesExist) {
    treeHelper(dirPath, '');
  } else {
    console.log('Kindly enter the valid path');
    return;
  }
}

function treeHelper(dirPath, indent) {
  let isFile = fs.lstatSync(dirPath).isFile();
  if (isFile == true) {
    let fileName = path.basename(dirPath);
    console.log(indent + '|---' + fileName);
  } else {
    let dirName = path.basename(dirPath);
    console.log(indent + '|____' + dirName);
    let childrens = fs.readdirSync(dirPath);
    for (let i = 0; i < childrens.length; i++) {
      let childPath = path.join(dirPath, childrens[i]);
      treeHelper(childPath, indent + '\t');
    }
  }
}

function organizeFn(dirPath) {
  //   console.log('organize command implemented for ', dirPath);
  if (dirPath == undefined) {
    console.log('Kindly enter the path');
    return;
  }

  let destPath;
  let doesExist = fs.existsSync(dirPath);
  if (doesExist) {
    destPath = path.join(dirPath, 'organized_files');
    if (fs.existsSync(destPath) == false) {
      fs.mkdirSync(destPath);
    }
  } else {
    console.log('Kindly enter the valid path');
    return;
  }
  organizeHelper(dirPath, destPath);
}

function organizeHelper(src, dest) {
  let childNames = fs.readdirSync(src);
  //   console.log(childNames);

  for (let i = 0; i < childNames.length; i++) {
    let childAddress = path.join(src, childNames[i]);
    let isFile = fs.lstatSync(childAddress).isFile();
    if (isFile) {
      //   console.log(childNames[i]);
      let category = getCategory(childNames[i]);
      //   console.log(childNames[i], ' ---> ', category);
      sendFiles(childAddress, dest, category);
    }
  }
}

function getCategory(name) {
  let ext = path.extname(name);
  ext = ext.slice(1);
  //   console.log(ext)

  for (let type in types) {
    let cTypeArray = types[type];
    for (let i = 0; i < cTypeArray.length; i++) {
      if (ext == cTypeArray[i]) {
        return type;
      }
    }
  }
  return 'others';
}

function sendFiles(srcFilePath, dest, category) {
  let categoryPath = path.join(dest, category);
  if (fs.existsSync(categoryPath) == false) {
    fs.mkdirSync(categoryPath);
  }

  let fileName = path.basename(srcFilePath);
  let destFilePath = path.join(categoryPath, fileName);
  fs.copyFileSync(srcFilePath, destFilePath);
  fs.unlinkSync(srcFilePath);
  console.log(fileName, 'cut to ', category);
}

function helpFn() {
  console.log(`
    List of All commands:
        -node main.js tree "directoryPath
        -node main.js organize "directoryPath
        -node main.js help
  `);
}
