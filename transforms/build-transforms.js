// Script to run xslt3 on all .xslt files in this folder.

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// node_modules/.bin/xslt3 -xsl:transforms/string.eqp.xslt -export:transforms/string.eqp.sef.json -t -nogo

const xslt3 = "node_modules/.bin/xslt3";
const xslt3Args = "-t -nogo";

const xsltFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith(".xslt"));

for (const xsltFile of xsltFiles) {
  const xsltPath = path.resolve(__dirname, xsltFile);
  const sefPath = path.resolve(__dirname, xsltFile.replace(".xslt", ".sef.json"));
  const cmd = `${xslt3} -xsl:${xsltPath} -export:${sefPath} ${xslt3Args}`;
  console.log(cmd);
  execSync(cmd);
}

console.log("All transforms complete");
