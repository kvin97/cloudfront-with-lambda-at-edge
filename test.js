import { handler } from "./index.js";

const testRes = async () => {
  await handler({
    Records: [
      {
        cf: {
          request: {
            method: "PUT",
            uri: "/original/image-123456.jpeg"
          }
        }
      }
    ]
  });
};

testRes();
