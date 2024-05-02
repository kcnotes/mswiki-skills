const fs = require("fs");
const SaxonJS = require("saxon-js");
const cliProgress = require('cli-progress');
const { categoryTransforms } = require("./transforms");
const { xml2json } = require('xml-js');

const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

/**
 * Converts a category of XML files to JSON.
 * @param {string} category The category to convert.
 * @param {object} opts The options object.
 * @param {string} opts.folder The folder to read XML files from.
 */
const convert = (category, opts) => {
  if (!categoryTransforms[category]) {
    console.log(`Category ${category} not found.`);
    return;
  }

  // Make output file
  if (!fs.existsSync(opts.output)) {
    fs.mkdirSync(opts.output, { recursive: true });
  }

  // Run transforms for the given category
  for (const transform of categoryTransforms[category]) {
    switch(transform.type) {
      case 'xslt':
        transformXslt(category, transform, opts);
        break;
      case 'xslt-bulk':
        transformXsltBulk(category, transform, opts);
        break;
      case 'merge':
        mergeJson(category, transform, opts);
        break;
    }
  }
  console.log(`[${category}] Done. The final JSON file is available at ${opts.output}/${categoryTransforms[category].at(-1).outJson}`);
};

const transformXslt = (category, transform, opts) => {
  let source = `${opts.folder}/${transform.xml}`;
  let outXml = `${opts.output}/${transform.outXml}`;
  let outJson = `${opts.output}/${transform.outJson}`;
  
  // Check if source exists
  if (!fs.existsSync(source)) {
    console.log(`[${category}] [${transform.xform}]: Source file not found`);
    return;
  }

  console.log(`[${category}] [${transform.xform}]: Running XML transform`);
  const xml = runTransformFile(source, null, transform.out, transform.xform);
  fs.writeFileSync(outXml, xml);

  console.log(`[${category}] [${transform.xform}]: Running XML to JSON`);
  var json = xml2json(xml, {
    compact: true,
  });
  fs.writeFileSync(outJson, json);
}

const transformXsltBulk = (category, transform, opts) => {
  let xmlFolder = `${opts.folder}/${transform.xmlFolder}`;
  let outXmlFolder = `${opts.output}/${transform.outXmlFolder}`;
  let outJson = `${opts.output}/${transform.outJson}`;
  
  // Check if source exists
  if (!fs.existsSync(xmlFolder)) {
    console.log(`[${category}] [${transform.xform}]: Source folder not found`);
    return;
  }

  // Make output folder (debugging)
  // if (!fs.existsSync(outXmlFolder)) {
  //   fs.mkdirSync(outXmlFolder, { recursive: true });
  // }

  // xml files
  const files = fs.readdirSync(xmlFolder).filter(file => file.endsWith('.xml'));
  const output = {};
  
  // Run transforms for each file in the folder
  console.log(`[${category}] [${transform.xform}]: Running XML transforms on ${files.length} files`);
  progress.start(files.length, 0);
  for (const file of files) {
    let source = `${xmlFolder}/${file}`;
    let outXml = `${outXmlFolder}/${file}`;
    
    const xml = runTransformFile(source, null, transform.out, transform.xform);
    // Write to XML when debugging
    // fs.writeFileSync(outXml, xml);

    var json = xml2json(xml, {
      compact: true,
    });
    var processedJson = JSON.parse(json);
    delete processedJson._declaration;
    output[file.split('.')[0]] = processedJson;
    progress.increment();
  }
  progress.stop();

  fs.writeFileSync(outJson, JSON.stringify(output));
}

const mergeJson = (category, transform, opts) => {
  let base = `${opts.output}/${transform.base}`;
  let withFile = `${opts.output}/${transform.with}`;
  let outJson = `${opts.output}/${transform.outJson}`;

  if (!fs.existsSync(base)) {
    console.log(`[${category}] [${transform.base}]: Base file not found`);
    return;
  }

  // If no with file, just transform the base JSON
  if (transform.with == null) {
    console.log(`[${category}] [${transform.base}]: Transforming JSON`);
    const json = transform.mergeFn(JSON.parse(fs.readFileSync(base)));
    fs.writeFileSync(outJson, JSON.stringify(json));
    return;
  }

  if (!fs.existsSync(withFile)) {
    console.log(`[${category}] [${transform.with}]: With file not found`);
    return;
  }

  const baseJson = JSON.parse(fs.readFileSync(base));
  const withJson = JSON.parse(fs.readFileSync(withFile));

  console.log(`[${category}] [${transform.base}] [${transform.with}]: Merging JSON`);
  const mergedJson = transform.mergeFn(baseJson, withJson);
  
  fs.writeFileSync(outJson, JSON.stringify(mergedJson));
}

/**
 * Runs a XSLT transform on a file.
 * @param {string} source The source file path.
 * @param {string|null} destination The destination folder to write the output to.
 * @param {string} filename The output filename.
 * @param {string} transform The XSLT transform file.
 */
const runTransformFile = (source, destination, filename, transform) => {
  try {
    let output = SaxonJS.transform(
      {
        stylesheetFileName: transform,
        sourceLocation: source,
        destination: "serialized",
      },
      "sync"
    );
    if (destination) {
      fs.writeFileSync(`${destination}/${filename}`, output.principalResult);
    }
    return output.principalResult;
  } catch (e) {
    console.log(e);
    console.log(`Error parsing ${filename}`);
  }
};

module.exports.convert = convert;
