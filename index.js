import { getObject, updateObject } from "./s3Operations.js";
import { transformImage } from "./transformImage.js";

const s3Bucket = "your-s3-bucket";

export const handler = async (event) => {
  const request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;

  if (request.method === "PUT" || request.method === "POST") {
    const objectKey = request.uri.slice(1);

    console.log(
      `Process Image Optimization for Request Method: ${request.method}  of Image Object Key: ${objectKey}`
    );

    const originalImageBuffer = await getObject(s3Bucket, objectKey);

    const transformedImageBuffer = await transformImage(originalImageBuffer);

    const updatePathUri = objectKey.replace("original/", "optimized/");

    await updateObject(s3Bucket, updatePathUri, transformedImageBuffer);
  }

  return response;
};
