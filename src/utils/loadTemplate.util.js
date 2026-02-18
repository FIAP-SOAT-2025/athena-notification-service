const fs = require("fs");
const path = require("path");

function loadTemplate(templateName) {
  const templatePath = path.join(
    __dirname,
    "../templates",
    templateName
  );

  return fs.readFileSync(templatePath, "utf-8");
}

module.exports = { loadTemplate };
