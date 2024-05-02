// Script to run xslt3 on all .xslt files in this folder.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// node_modules/.bin/xslt3 -xsl:transforms/string.eqp.xslt -export:transforms/string.eqp.sef.json -t -nogo
const xslt3Args = "-t -nogo";

// Acccept a single argument specifying the single file to transform
const xsltFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith(".xslt"))
  .filter((file) => process.argv.length === 3 ? file === process.argv[2] : true);

for (const xsltFile of xsltFiles) {
  const xsltPath = path.resolve(__dirname, xsltFile);
  const sefPath = path.resolve(__dirname, xsltFile.replace(".xslt", ".sef.json"));
  
  const xslPath = path.resolve(__dirname, xsltPath);
  const exportPath = path.resolve(__dirname, sefPath);
  const cmd = `xslt3 -xsl:${xslPath} -export:"${exportPath}" ${xslt3Args}`;
  console.log(cmd);
  execSync(cmd, {
    cwd: './node_modules/.bin'
  });
}

console.log("All transforms complete");
