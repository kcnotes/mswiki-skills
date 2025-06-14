const { Command } = require('commander');
const { convert } = require('./actions/convert');
const { categoryTransforms } = require("./actions/transforms");

const program = new Command();

program
  .name('npm run start_v2 --')
  .description('Converts MapleStory XML files to JSON');

program
  .command('convert')
  .description('Converts a category of XML files to JSON. Data is expected to be in folders within ./data, e.g. ./data/String, ./data/Skill. All categories require ./data/String to be available.')
  .argument('<category>', 'A category, such as Character.Accessory')
  .option('-f, --folder <folder>', 'The folder to read XML files from.', './xml')
  .option('-o, --output <output>', 'The folder to write JSON files to.', './out')
  .action((category, options) => convert(category, options));

program
  .command('list-categories')
  .description('Lists all available categories.')
  .action(() => {
    console.log('Categories:');
    for (const category in categoryTransforms) {
      console.log(`- ${category}`);
    }
  });

program.parse();
