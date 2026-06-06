import fs from "fs";
import cliProgress from "cli-progress";
import path from "path";
import { convertFile, parseXml } from "../lib/xml.js";
import { runWorkerPool } from "../lib/worker_pool.js";
const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const TEMP_FOLDER = "temp";
export const convertSkills = async ({ folder, output }) => {
    const stringSkillFile = path.join(folder, "String", "Skill.img.xml");
    const skillXmlFolder = path.join(folder, "Skill");
    if (!fs.existsSync(stringSkillFile)) {
        throw new Error(`String/Skill.img.xml not found in ${folder}`);
    }
    if (!fs.existsSync(skillXmlFolder)) {
        throw new Error(`Skill folder not found in ${folder}`);
    }
    // Make the output folder
    if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true });
    }
    // Generate a temp folder, clear if it exists
    const tempFolder = `${output}/${TEMP_FOLDER}`;
    if (fs.existsSync(tempFolder)) {
        fs.rmSync(tempFolder, { recursive: true, force: true });
    }
    fs.mkdirSync(tempFolder, { recursive: true });
    // convert skill files
    console.log("Converting skill XML to JSON...");
    const files = fs.readdirSync(skillXmlFolder).filter((file) => file.endsWith(".xml"));
    progress.start(files.length, 0);
    await runWorkerPool(files, async (file) => {
        await convertFile(path.join(skillXmlFolder, file), skillXmlFolder, tempFolder);
        progress.increment();
    });
    progress.stop();
    const strings = await parseXml(stringSkillFile);
    console.log(strings.length);
    // Delete the temp folder
    // fs.rmSync(tempFolder, { recursive: true, force: true });
};
//# sourceMappingURL=skills.js.map