const gen = require('./gen.js');

let skillData = require('./all.json');
if (skillData) {
    let skill = gen.findSkillById(skillData, '11120009');
    const attributes = gen.getAttributes(skill);
    const info = gen.getInfo(skill);
    const id = gen.getId(skill);
    const strings = gen.getStrings(skill);
    const parsedStrings = gen.parseStrings(attributes, strings);
    console.log(attributes, info, id, strings, parsedStrings);
    console.log(gen.getTable(id, attributes, parsedStrings, info));
}