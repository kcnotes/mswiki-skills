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

const mergeAuction = (base) => {
  return base.AuctionData.Type.flatMap(type => (
    type.SubType.flatMap(subtype => (
      subtype.Category?.map(category => ({
        ...category._attributes,
        begin: Number(category._attributes.begin),
        end: Number(category._attributes.end),
        subtype: subtype._attributes.type,
        type: type._attributes.type,
      })) ?? [] // SkillBook is an empty subtype
    ))
  ))
};

const createCharacterTransform = (category, xmlFolder) => {
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

const createAuctionDataTransform = () => ([
  {
    type: 'xslt',
    id: 'Etc.AuctionData',
    xform: 'transforms/etc.auctiondata.sef.json',
    xml: 'Etc/AuctionData.img.xml',
    outXml: 'Etc.AuctionData.img.xml',
    outJson: 'Etc.AuctionData.json'
  },
  {
    type: 'merge',
    base: 'Etc.AuctionData.json',
    with: null,
    mergeFn: mergeAuction,
    outJson: 'Etc.AuctionData.merged.json',
  }
]);

/**
 * outXml, outJson and outJson must be single files with no folders
 */
const categoryTransforms = {
  'Character.Accessory': createCharacterTransform('Character.Accessory', 'Character/Accessory/'),
  'Character.Cap': createCharacterTransform('Character.Cap', 'Character/Cap/'),
  'Etc.AuctionData': createAuctionDataTransform(),
};

module.exports.categoryTransforms = categoryTransforms;
