const SaxonJS = require('saxon-js');
const fs = require('fs');
const cliProgress = require('cli-progress');
var convert = require('xml-js');

const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const SKILL_WZ_FOLDER = './Skill.wz';
const TEMP_XML_FOLDER = 'tempxml';
const FINAL_XML_FOLDER = 'finalxml';

let singleRun = false;
let singleRunItem = '';

if (process.argv.length > 2) {
    if (['1', '2', '3'].includes(process.argv[2])) {
        singleRun = true;
        singleRunItem = process.argv[2];
    }
}

if (!singleRun || singleRunItem === '1') {
    let skillFiles = fs.readdirSync(SKILL_WZ_FOLDER);
    skillFiles = skillFiles.filter(file => file.endsWith('.img.xml'));
    if (!fs.existsSync(TEMP_XML_FOLDER)) {
        fs.mkdirSync(TEMP_XML_FOLDER);
    }

    // Reduce file sizes by stripping canvas and vectors
    console.log('1/3: Reducing XML sizes');
    progress.start(skillFiles.length, 0);

    skillFiles.forEach(filename => {
        let fileContents = fs.readFileSync(`${SKILL_WZ_FOLDER}/${filename}`, { encoding: 'utf8' });
        fileContents = fileContents.replace(/<canvas.*?><\/canvas>/g, '');
        fileContents = fileContents.replace(/<canvas.*?>/g, '');
        fileContents = fileContents.replace(/<\/canvas>/g, '');

        try {
            let output = SaxonJS.transform({
                stylesheetFileName: "transforms/skill-big-to-small.sef.json",
                sourceText: fileContents,
                destination: "serialized"
            }, "sync");
            fs.writeFileSync(`${TEMP_XML_FOLDER}/${filename}`, output.principalResult);
        }
        catch (e) {
            console.log(`Error parsing ${filename}`);
            return;
        }
        progress.increment();
    });
    progress.stop();
}

if (!singleRun || singleRunItem === '2') {
    // Join XML with skill strings
    let reducedFiles = fs.readdirSync(TEMP_XML_FOLDER);
    reducedFiles = reducedFiles.filter(file => file.endsWith('.img.xml'));
    if (!fs.existsSync(FINAL_XML_FOLDER)) {
        fs.mkdirSync(FINAL_XML_FOLDER);
    }

    console.log('2/3: Adding skill strings (5-10 mins)');
    progress.start(reducedFiles.length, 0);
    reducedFiles.forEach(filename => {
        let fileContents = fs.readFileSync(`${TEMP_XML_FOLDER}/${filename}`, { encoding: 'utf8' });

        try {
            let output = SaxonJS.transform({
                stylesheetFileName: "transforms/skill-mixed-to-final.sef.json",
                sourceText: fileContents,
                destination: "serialized"
            }, "sync");
            fs.writeFileSync(`${FINAL_XML_FOLDER}/${filename}`, output.principalResult);
        }
        catch (e) {
            console.log(`Error parsing ${filename}`);
            return;
        }
        progress.increment();
    });
    progress.stop();
}

if (!singleRun || singleRunItem === '3') {
    console.log('3/3: Generating JSON skill details from XML');

    // Generate JSON files
    let finalFiles = fs.readdirSync(FINAL_XML_FOLDER);
    finalFiles = finalFiles.filter(file => file.endsWith('.img.xml'));
    progress.start(finalFiles.length, 0);

    let jsonBlob = {};

    finalFiles.forEach(filename => {
        let xml = fs.readFileSync(`${FINAL_XML_FOLDER}/${filename}`, {
            encoding: 'utf8'
        });
        var json = convert.xml2json(xml, {
            compact: true
        });
        jsonBlob[filename.split('.')[0]] = JSON.parse(json);
        progress.increment();
    });

    fs.writeFileSync(`all.json`, JSON.stringify(jsonBlob));

    progress.stop();
}