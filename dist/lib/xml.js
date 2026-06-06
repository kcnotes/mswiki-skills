import fs from "fs/promises";
import path from "path";
import { XMLParser } from "fast-xml-parser";
// Skip heavy nodes that don't ever need parsing
const SKIP_NODES = new Set(["png"]);
// Generates temporary artifacts for debugging purposes
const GENERATE_ARTIFACTS = false;
const parser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: true,
    attributeNamePrefix: '_',
    parseTagValue: false,
    parseAttributeValue: false,
    isArray: (_name, jpath, _isLeafNode, isAttribute) => {
        return !isAttribute && jpath.toString().indexOf('.') !== -1;
    },
    updateTag(tagName) {
        if (SKIP_NODES.has(tagName)) {
            return false;
        }
        return tagName;
    },
});
/**
 * Converts an XML file within an input folder, and writes to the output folder
 */
export async function convertFile(xmlPath, opts) {
    const { inputFolder, outputFolder, normalize } = opts;
    const relativePath = path.relative(inputFolder, xmlPath);
    const jsonPath = path.join(outputFolder, relativePath.replace(/\.xml$/, ".json"));
    await fs.mkdir(path.dirname(jsonPath), { recursive: true });
    const data = await parseXml(xmlPath, normalize);
    if (GENERATE_ARTIFACTS) {
        await fs.writeFile(jsonPath, JSON.stringify(data), "utf8");
    }
    return data;
}
/**
 * Parses an XML file into a JS object
 */
export async function parseXml(xmlPath, normalize) {
    const xml = await fs.readFile(xmlPath, "utf8");
    const json = parser.parse(xml);
    return normalize?.(json) ?? json;
}
//# sourceMappingURL=xml.js.map