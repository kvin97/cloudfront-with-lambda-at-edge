import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import streamToBuffer from "./util.js";

const s3Client = new S3Client();

export const updateObject = async (bucketName, objectKey, body) => {
  const putParams = {
    Bucket: bucketName,
    Key: objectKey,
    Body: body
  };

  const command = new PutObjectCommand(putParams);
  const response = await s3Client.send(command);

  return response;
};

export const getObject = async (bucketName, objectKey) => {
  const input = {
    Bucket: bucketName,
    Key: objectKey
  };

  const command = new GetObjectCommand(input);
  const response = await s3Client.send(command);

  return streamToBuffer(response.Body);
};
