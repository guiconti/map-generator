const fs = require('fs');
const Jimp = require('jimp');
const prettier = require('prettier');
const MAP_PATH = `${process.cwd()}/maps/`;
const DATA_PATH = `${process.cwd()}/datas/`;
const dataTemplate = require('./dataTemplate');
const DATA_OPERATION = 'data';
const IMAGE_OPERATION = 'image';
const RESIZE_IMAGE_OPERATION = 'resizeImage';
const IMAGE_SIZE = 200;
const TILE_COLORS = {
  858993663: 'G',
  3355443: 'G',
  '#333333': 'G',
  '#333333FF': 'G',
  2576980479: 'W',
  10066329: 'W',
  1717987071: 'W',
  6710886: 'W',
  '#999999': 'W',
  '#999999FF': 'W',
  '#666666': 'W',
  '#666666FF': 'W',
  4278190335: 'P',
  16711680: 'P',
  '#FF0000': 'P',
  '#FF0000FF': 'P',
};

if (process.argv.length < 3) {
  console.error(
    'Please send the type of operation as a command-line parameter. Ex: npm run generate map_name'
  );
  process.exit();
}

if (process.argv[2] === DATA_OPERATION) {
  if (process.argv.length < 4) {
    console.error(
      'Please send the image file name as a command-line parameter. Ex: npm run generateData image_file_name'
    );
    process.exit();
  }
  Jimp.read(MAP_PATH + process.argv[3], (err, image) => {
    if (err) {
      console.error(
        'The image name sent was not found. Please double check and make sure you are sending the correct name'
      );
      process.exit();
    }
    if (image.bitmap.width !== image.bitmap.height) {
      console.error('The image sent must be a square (width equals to height)');
    }
    if (image.bitmap.width % IMAGE_SIZE !== 0 && IMAGE_SIZE % image.bitmap.width !== 0) {
      console.error(`The image width and height must be divisible or a divisor of ${IMAGE_SIZE}`);
      process.exit();
    }
    let result = [];
    for (let i = 0; i < image.bitmap.width; i++) {
      result[i] = '';
      for (let j = 0; j < image.bitmap.height; j++) {
        if (!TILE_COLORS[image.getPixelColor(j, i)]) {
          console.error(`Pixel at position (${i}, ${j}) is outside the pixel range`);
        }
        result[i] += TILE_COLORS[image.getPixelColor(j, i)];
      }
    }
    result = result.join("','");
    const data = prettier.format(dataTemplate(`'${result}'`), { parser: 'babel' });
    let fileName = `${new Date().toISOString()}.js`;
    if (process.argv.length >= 5) {
      fileName = `${process.argv[4]}.js`;
    }
    fs.writeFileSync(DATA_PATH + fileName, data);
  });
}

if (process.argv[2] === IMAGE_OPERATION) {
  if (process.argv.length < 4) {
    console.error(
      'Please send the javascript file name containing the data as a command-line parameter. Ex: npm run generateImage data_file_name'
    );
    process.exit();
  }
}

if (process.argv[2] === RESIZE_IMAGE_OPERATION) {
  if (process.argv.length < 4) {
    console.error(
      'Please send the image file name as a command-line parameter. Ex: npm run generateData image_file_name'
    );
    process.exit();
  }
  if (process.argv.length < 5) {
    console.error('Please send new size image');
    process.exit();
  }
  if (process.argv.length < 6) {
    console.error('Please send the new file name');
    process.exit();
  }
  Jimp.read(MAP_PATH + process.argv[3], (err, image) => {
    if (err) {
      console.error(
        'The image name sent was not found. Please double check and make sure you are sending the correct name'
      );
      process.exit();
    }
    if (image.bitmap.width !== image.bitmap.height) {
      console.error('The image sent must be a square (width equals to height)');
    }
    const size = parseInt(process.argv[4]);
    const fileName = process.argv[5];
    image.scaleToFit(size, size).write(fileName);
  });
}
