let gen = {};

gen.getAttributes = (skill) => {
    let attributes = {};
    for (const type of Object.keys(skill.attr)) {
        if (type === 'vector') {
            continue;
        }
        const skillAttrs = skill.attr[type];
        if (Array.isArray(skillAttrs)) {
            const subAttributes = skillAttrs.reduce((obj, item) => {
				// Converts millisecond cooldowns to seconds
				if (item._attributes.name == "cooltimeMS") {
					obj[item._attributes.name] = "(".concat(item._attributes.value).concat(")*0.001");
				}
				else {
					obj[item._attributes.name] = item._attributes.value;
				}
                return obj;
            }, {});
            attributes = { ...attributes, ...subAttributes };
        } else if (skillAttrs._attributes) {
            attributes = { ...attributes, [skillAttrs._attributes.name]: skillAttrs._attributes.value };
        }
    }
    return attributes;
};

gen.getStrings = (skill) => {
    let attributes = {};
    for (const type of Object.keys(skill.strings)) {
        const skillAttrs = skill.strings[type];
        if (Array.isArray(skillAttrs)) {
            const subAttributes = skillAttrs.reduce((obj, item) => {
                obj[item._attributes.name] = item._attributes.value;
                return obj;
            }, {});
            attributes = { ...attributes, ...subAttributes };
        } else if (skillAttrs._attributes) {
            attributes = { ...attributes, [skillAttrs._attributes.name]: skillAttrs._attributes.value };
        }
    }
    return attributes;
};

gen.getInfo = (skill) => {
    let attributes = {};
    for (const type of Object.keys(skill.info)) {
        if (type === 'vector') {
            continue;
        }
        const skillAttrs = skill.info[type];
        if (Array.isArray(skillAttrs)) {
            const subAttributes = skillAttrs.reduce((obj, item) => {
                obj[item._attributes.name] = item._attributes.value;
                return obj;
            }, {});
            attributes = { ...attributes, ...subAttributes };
        } else if (skillAttrs._attributes) {
            attributes = { ...attributes, [skillAttrs._attributes.name]: skillAttrs._attributes.value };
        }
    }
    for (const type of Object.keys(skill)) {
        if (!['int', 'int32', 'int64', 'string'].includes(type)) {
            continue;
        }
        const skillAttrs = skill[type];
        if (Array.isArray(skillAttrs)) {
            const subAttributes = skillAttrs.reduce((obj, item) => {
                obj[item._attributes.name] = item._attributes.value;
                return obj;
            }, {});
            attributes = { ...attributes, ...subAttributes };
        } else if (skillAttrs._attributes) {
            attributes = { ...attributes, [skillAttrs._attributes.name]: skillAttrs._attributes.value };
        }
    }
    return attributes;
};

gen.getId = (skill) => {
    return skill.id._text || skill.id;
};

gen.parseStrings = (attributes, strings) => {
    let newStrings = Object.assign({}, strings);
    let formulah = strings.h || strings.h1;
    if (!strings.h && !strings.h1) {
        return null;
    }
    Object.entries(attributes).sort().reverse().forEach((item) => {
        const key = item[0];
        const value = item[1];
        if ((/^\d+$/g).test(value)) {
            formulah = formulah.replace(new RegExp(`#${key}`, 'g'), `${value}`);
        } else {
            formulah = formulah.replace(new RegExp(`#${key}`, 'g'), `{#expr:${value}}`);
            formulah = formulah.replace(/u\(/g, 'ceil(');
            formulah = formulah.replace(/d\(/g, 'floor(');
        }
    });

    Object.keys(attributes).sort().reverse().forEach((key) => {
        if (newStrings.h)
            newStrings.h = newStrings.h.replace(new RegExp(`#${key}`, 'g'), `#|${key}`);
    });

    Object.keys(newStrings).forEach(id => {
        newStrings[id] = newStrings[id].replace(/\\r\\n/g, '<br /><br />');
        newStrings[id] = newStrings[id].replace(/\\n/g, '<br />');
        // Run font colour change twice due to extra catches
        newStrings[id] = newStrings[id].replace(/#c(.*?)(?:#([^a-zA-Z0-9\\\|])|(?:#)?$)/g, '<span class="darkorange-text">$1</span>$2');
        newStrings[id] = newStrings[id].replace(/#c(.*?)(?:#([^a-zA-Z0-9\\\|])|(?:#)?$)/g, '<span class="darkorange-text">$1</span>$2');
        newStrings[id] = newStrings[id].replace(/-{/g, '&#45;{');
        newStrings[id] = newStrings[id].replace(/#\|/g, '#');
        newStrings[id] = newStrings[id].replace(/#$/g, '');
    })
    formulah = formulah.replace(/\\r\\n/g, '<br /><br />');
    formulah = formulah.replace(/\\n/g, '<br />');
    // Run font colour change twice due to extra catches
    formulah = formulah.replace(/#c(.*?)(?:#([^a-zA-Z0-9\\\|])|(?:#)?$)/g, '<span class="darkorange-text">$1</span>$2');
    formulah = formulah.replace(/#c(.*?)(?:#([^a-zA-Z0-9\\\|])|(?:#)?$)/g, '<span class="darkorange-text">$1</span>$2');
    formulah = formulah.replace(/-{/g, '&#45;{');
    formulah = formulah.replace(/#\|/g, '#');
    formulah = formulah.replace(/#$/g, '');

    return {
        ...newStrings, formulah
    };
};

gen.getElemAttrMap = (elemAttr) => {
    switch (elemAttr) {
        case 'i': return 'Ice';
        case 'f': return 'Fire';
        case 'd': return 'Dark';
        case 'l': return 'Lightning';
        case 's': return 'Poison';
        case 'h': return 'Holy';
        default: return '';
    }
}

gen.getTable = (id, attributes, strings, info, injectedSkillClass) => {
    if (!strings) return '';
    var reformattedIconName = `${strings.name}`;
    var isHexaBoost = id.startsWith('50000');
    reformattedIconName = reformattedIconName.replaceAll("[", "(").replaceAll("]", ")");
    if (isHexaBoost)
        reformattedIconName = reformattedIconName.replace(" Boost", "");
    return `<!--${Number(id).toString()}-->
{{SkillTable
|skillName=[[File:Skill ${reformattedIconName}.png]] '''${strings.name}'''
|skillClass=${injectedSkillClass || ''}
|skillType=${(Number(id).toString().slice(-4, -3) == '0') ? 'Passive' : 'Active'}
|elementAttribute=${gen.getElemAttrMap(info?.elemAttr)}
|levelRequirement=${info.reqLev || ''}
|maxLevel=${attributes.maxLevel}
|combatOrders=${info.combatOrders || ''}
|vSkill=${info.vSkill || ''}
|bgm=${info?.bgm?.replace(/^.*\//g, '') || ''}
|description=${strings.desc}
|readout=${strings.h}
|formula=${strings.formulah}
}}`;
};

gen.getSkillbox = (id, attributes, strings, info, injectedSkillClass) => {
    if (!strings) return '';
    var isHexaBoost = id.startsWith('50000');
    var reformattedIconName = `${strings.name}`.replaceAll("[", "(").replaceAll("]", ")");
    var reformattedUrlName = `${strings.name}`.replaceAll("[", "(").replaceAll("]", ")");
    if (isHexaBoost) {
        reformattedIconName = reformattedIconName.replace(" Boost", "");
        reformattedUrlName = reformattedUrlName.replace(" Boost", `6th Job Enhancement|${strings.name}`);
    }
	// Note: This is a naive check that will put IDs into 4th job Dual Blade skills
    var shouldShowID = (info.vSkill != null) || isHexaBoost || (Number(id[id.length - 5]) > 3);
    var idLine = '';
    if (shouldShowID) {
        idLine = `{{{${isHexaBoost ? 'SkillBoxSixthJob' : 'SkillBox'}
|id=${Number(id).toString()}`;
    }
    else {
        idLine = `<!--${Number(id).toString()}-->
{{{${isHexaBoost ? 'SkillBoxSixthJob' : 'SkillBox'}`;
    }
    return `${idLine}
|skillName=[[File:Skill ${reformattedIconName}.png]] ${reformattedUrlName}
|skillType=${isHexaBoost ? 'Passive' : (Number(id).toString().slice(-4, -3) == '0') ? 'Passive' : 'Active'}
|reqLv=${info.reqLev || ''}
|masterLevel=${attributes.maxLevel}
|combatOrders=${info.combatOrders || ''}
|vSkill=${info.vSkill || ''}
|description=${strings.desc}
|formula=${strings.formulah}
}}`;
};

gen.findSkillById = (data, skillId) => {
    const keys = Object.keys(data);
    const groups = [skillId.slice(0, 3), skillId.slice(0, 4), skillId.slice(0, 5)];
    for (const group of groups) {
        if (keys.includes(group)) {
            let found = data[group].skills.skill.filter(skill => skill.id._text == skillId);
            if (found.length > 0) {
                return found[0];
            }
        }
    }
    return null;
};

gen.getSkillGroups = (data) => {
    return Object.keys(data).filter(d => d !== 'formatversion');
};

gen.getSkillsForGroup = (data, group) => {
    return data[group].skills.skill;
};

gen.getAll = (skill, injectedSkillClass, formatversion) => {
    const attributes = gen.getAttributes(skill);
    const info = gen.getInfo(skill);
    const id = gen.getId(skill);
    const strings = formatversion === '2' ? skill.strings : gen.getStrings(skill);
    const parsedStrings = gen.parseStrings(attributes, strings);
    return {
        attributes,
        info,
        id,
        strings,
        parsedStrings,
        wikitable: gen.getTable(id, attributes, parsedStrings, info, injectedSkillClass),
		skillbox: gen.getSkillbox(id, attributes, parsedStrings, info, injectedSkillClass),
    };
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = gen;
  }
} else {
  window['gen'] = gen;
}
