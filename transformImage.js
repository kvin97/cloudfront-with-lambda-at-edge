import sharp from "sharp";

/*
  Transform the images (.jpeg and .png) to a reduced file size
  Sharp will attempt to minimize the file size managing the quality at 80
  
  If not possible to keep the quality at 80 and reduce the file size to minimum acceptable given - MIN_SIZE,
  Then iteratively reduce the file size till change in file size becomes less than MIN_FILE_CHANGE_PERCENTAGE
*/

const MIN_SIZE = process.env.MIN_SIZE; // minimum file size acceptable
const MIN_FILE_CHANGE_PERCENTAGE = process.env.MIN_FILE_CHANGE_PERCENTAGE; // if image file size percentage change is less than this then break the loop and return the buffer content

export const transformImage = async (buffer) => {
  let inputBuffer = buffer;
  let outputBuffer = buffer;

  let metadata;
  let change = MIN_FILE_CHANGE_PERCENTAGE;
  let prevSize;
  let size = MIN_SIZE;

  /* 
    iterate until image is resized to less than MIN_SIZE 
    or change of file size to less than MIN_FILE_CHANGE_PERCENTAGE
  */
  while (size >= MIN_SIZE && change >= MIN_FILE_CHANGE_PERCENTAGE) {
    metadata = await sharp(inputBuffer).metadata();
    size = metadata.size / (1024 * 1024);

    if (prevSize) change = ((prevSize - size) * 100) / prevSize;

    if (metadata.format === "jpeg") {
      outputBuffer = sharp(inputBuffer)
        .jpeg({
          quality: 80,
          mozjpeg: true
        })
        .toBuffer();
    } else if (metadata.format === "png") {
      outputBuffer = sharp(inputBuffer)
        .png({
          quality: 80
        })
        .toBuffer();
    }

    prevSize = size;

    inputBuffer = await outputBuffer;
  }

  return outputBuffer;
};
