const cliProgress = require('cli-progress');
const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const mergeCharacter = (base, withData) => {
  progress.start(Object.keys(base).length, 0);
  const strings = withData.Equips.Equip.map(e => e._attributes);
  // Merge withData into base
  for (const key of Object.keys(base)) {
    base[key] = {
      ...base[key],
      ...strings.find(string => `0${string.id}` === key),
    };
    progress.increment();
  }
  progress.stop();
  return base;
}

const createCharacterTransforms = (category, xmlFolder) => {
  return [
    {
      type: 'xslt',
      id: 'String.Eqp',
      xform: 'transforms/string.eqp.sef.json',
      xml: 'String/Eqp.img.xml',
      outXml: 'String.Eqp.img.xml',
      outJson: 'String.Eqp.json'
    },
    {
      type: 'xslt-bulk',
      id: category,
      xform: 'transforms/character.sef.json',
      xmlFolder,
      outXmlFolder: category,
      outJson: `${category}.json`
    },
    {
      type: 'merge',
      base: `${category}.json`,
      with: 'String.Eqp.json',
      mergeFn: mergeCharacter,
      outJson: `${category}.merged.json`,
    }
  ]
}

/**
 * outXml, outJson and outJson must be single files with no folders
 */
const categoryTransforms = {
  'Character.Accessory': createCharacterTransforms('Character.Accessory', 'Character/Accessory/'),
  'Character.Cap': createCharacterTransforms('Character.Cap', 'Character/Cap/'),
};

module.exports.categoryTransforms = categoryTransforms;
