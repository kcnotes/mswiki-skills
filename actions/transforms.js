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

const mergeSkill = (base, withData) => {
  progress.start(Object.keys(base).length, 0);
  const merged = {};

  // Merge withData into base
  for (const baseId of Object.keys(base)) {
    let skills = base[baseId].Skills.Skill;
    if (skills == null) {
      continue;
    }
    if (!Array.isArray(skills)) {
      skills = [skills];
    }
    merged[baseId] = {
      skills: {
        skill: skills.map(s => ({
          ...s,
          id: s._attributes.id,
          strings: {
            ...withData.Skills[`s_${s._attributes.id}`]?._attributes,
          }
        }))
      }
    }
    progress.increment();
  }
  progress.stop();
  merged['formatversion'] = '2';
  return merged;
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

const createSkillTransform = () => {
  return [
    {
      type: 'xslt',
      id: 'String.Skill',
      xform: 'transforms/string.skill.sef.json',
      xml: 'String/Skill.img.xml',
      outXml: 'String.Skill.img.xml',
      outJson: 'String.Skill.json'
    },
    {
      type: 'xslt-bulk',
      id: 'Skill',
      xform: 'transforms/skill.sef.json',
      xmlFolder: 'Skill',
      outXmlFolder: 'Skill',
      outJson: 'Skill.json'
    },
    {
      type: 'merge',
      base: `Skill.json`,
      with: 'String.Skill.json',
      mergeFn: mergeSkill,
      outJson: `Skill.merged.json`,
    }
  ]
};

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
  'Skill': createSkillTransform(),
  'Etc.AuctionData': createAuctionDataTransform(),
};

module.exports.categoryTransforms = categoryTransforms;
