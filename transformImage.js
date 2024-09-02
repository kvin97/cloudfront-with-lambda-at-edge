import sharp from "sharp";

/*
  Transform the images (.jpeg and .png) to a reduced file size
  Sharp will attempt to minimize the file size managing the quality at 80
  
  If not possible to keep the quality at 80 and reduce the file size to minimum acceptable given - MIN_SIZE,
  Then iteratively reduce the file size till change in file size becomes less than MIN_FILE_CHANGE_PERCENTAGE
*/

const MIN_SIZE = 1; // minimum file size acceptable
const MIN_FILE_CHANGE_PERCENTAGE = 5; // if image file size percentage change is less than this then break the loop and return the buffer content

export const transformImage = async (buffer) => {
  let inputBuffer = buffer;
  let outputBuffer = buffer;

  let metadata = await sharp(inputBuffer).metadata();

  let change = MIN_FILE_CHANGE_PERCENTAGE;
  let size = metadata.size / (1024 * 1024);
  let prevSize = size;

  /* 
    iterate until image is resized to less than MIN_SIZE 
    or change of file size to less than MIN_FILE_CHANGE_PERCENTAGE
  */
  while (size >= MIN_SIZE && change >= MIN_FILE_CHANGE_PERCENTAGE) {
    if (metadata.format === "jpeg") {
      outputBuffer = await sharp(inputBuffer)
        .jpeg({
          quality: 80,
          mozjpeg: true
        })
        .toBuffer();
    } else if (metadata.format === "png") {
      outputBuffer = await sharp(inputBuffer)
        .png({
          quality: 80
        })
        .toBuffer();
    }

    metadata = await sharp(inputBuffer).metadata();

    size = metadata.size / (1024 * 1024);
    if (prevSize) change = ((prevSize - size) * 100) / prevSize;

    prevSize = size;

    inputBuffer = outputBuffer;
  }

  return outputBuffer;
};
