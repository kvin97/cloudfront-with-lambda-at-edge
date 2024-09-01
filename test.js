import { handler } from "./index.js";

const testRes = handler({
  Records: [
    {
      cf: {
        request: {
          method: "GET"
        }
      }
    }
  ]
});

console.log("Test: ", testRes);
