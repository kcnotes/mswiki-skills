import fs from "fs";
import cliProgress from "cli-progress";
import path from "path";
import { convertFile, parseXml } from "../lib/xml.js";
import { runWorkerPool } from "../lib/worker_pool.js";
import { transformSkills, transformSkillStrings } from "./transforms.js";
import type { Skill } from "./transforms.js";

type SkillGroup = {
  groupId: string;
  strings: Record<string, string>;
  skills: Record<string, Skill>;
}

const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const TEMP_FOLDER = "temp";

export const convertSkills = async ({ folder, output }: { folder: string; output: string }) => {
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
  const cache: Record<string, SkillGroup> = {};

  const strings = await convertFile(stringSkillFile, {
    inputFolder: path.join(folder, "String"),
    outputFolder: tempFolder,
    normalize: transformSkillStrings,
  });
  const files = fs.readdirSync(skillXmlFolder).filter((file) => file.endsWith(".xml"));

  progress.start(files.length, 0);
  const startTime = Date.now();
  await runWorkerPool(files, async (file) => {
    const groupId = file.replace('.img.xml', '');
    const skills = await convertFile(path.join(skillXmlFolder, file), {
      inputFolder: skillXmlFolder,
      outputFolder: tempFolder,
      normalize: transformSkills(strings),
    });
    cache[groupId] = { groupId, strings: strings[groupId] || {}, skills };
    progress.increment();
  });
  progress.stop();

  await fs.promises.writeFile(path.join(output, "skills.json"), JSON.stringify(cache));

  console.log(`Done in ${(Date.now() - startTime) / 1000}s. Output saved to ${path.join(output, "skills.json")}`);
}
