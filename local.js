require("dotenv").config();

const { handler } = require("./src/handler");

(async () => {
  const mockEvent = {
    to: "luizresplandeoliveira@gmail.com",
    subject: "Teste Local",
    type: "success", // ou "error"
    username: "Luiz",
    filename: "video.mp4"
  };

  const response = await handler(mockEvent);

  console.log("Lambda response:");
  console.log(response);
})();
