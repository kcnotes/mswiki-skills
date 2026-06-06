import { program } from "commander";
import { convertSkills } from "./skills/convert.js";
program
    .name("npm run convert --")
    .description("Converts MapleStory XML files to JSON");
program
    .command("skills")
    .description("Converts skill XML files to JSON")
    .option("-f, --folder <path>", "The folder to read XML files from.", "./xml")
    .option("-o, --output <path>", "The folder to write JSON files to.", "./out")
    .action((options) => {
    convertSkills(options);
});
program.parse();
//# sourceMappingURL=index.js.map