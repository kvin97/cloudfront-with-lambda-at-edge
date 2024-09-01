import { transformImage } from "./transformImage.js";

export const handler = async (event) => {
  const request = event.Records[0].cf.request;

  if (request.method === "PUT" || request.method === "POST") {
    const requestBody = request.body.data;

    const inputBufferContent = Buffer.from(requestBody, "base64");

    const transformedImageBuffer = await transformImage(inputBufferContent);

    request.body.action = "replace";
    request.body.data = transformedImageBuffer.toString("base64");
  }

  return request;
};
