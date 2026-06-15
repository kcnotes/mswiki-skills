import { getSkillString, parseFormula, parseReadout } from "../../string/string_skill";
import type { ImportedSkill } from "../skill_context";

export interface SkillProps {
    id: string;
    name: string;
    templateName: string;
    templateNameWithLink: string;
    link: string;
    type: string;
    class?: string;
    elementAttribute?: string;
    levelRequirement?: string;
    maxLevel?: string;
    combatOrders?: string;
    isHexaBoost: boolean;
    vSkill?: string;
    bgm?: string;
    description: string;
    readout: string;
    formula: string;
};

export const getGroupId = (id: string) => {
    return id.slice(0, -4);
};

export const getTableTemplate = ({
    id,
    name,
    class: skillClass,
    type,
    elementAttribute,
    levelRequirement,
    maxLevel,
    combatOrders,
    bgm,
    description,
    readout,
    formula,
}: SkillProps, version?: string) => `<!--${Number(id).toString()}-->
<tabber>
|-|${version ?? 'GMS'}=
{{SkillTable
|skillName=[[File:Skill ${name}.png]] '''${name}'''
|skillClass=${skillClass ?? ''}
|skillType=${type}
|elementAttribute=${elementAttribute ?? ''}
|levelRequirement=${levelRequirement ?? ''}
|maxLevel=${maxLevel ?? ''}
|combatOrders=${combatOrders ?? ''}
|bgm=${bgm ?? ''}
|description=${description}
|readout=${readout}
|formula=${formula}
}}`;

export const getBoxTemplate = ({
    id,
    templateNameWithLink,
    type,
    levelRequirement,
    maxLevel,
    combatOrders,
    isHexaBoost,
    vSkill,
    description,
    formula,
}: SkillProps) => {
    // Note: This is a naive check that will put IDs into 4th job Dual Blade skills
    const shouldShowID = (vSkill != null) || isHexaBoost || (Number(id[id.length - 5]) > 3);
    return `<!--${Number(id).toString()}-->
{{${isHexaBoost ? 'SkillBoxSixthJob' : 'SkillBox'}${shouldShowID ? '\n|id=' + id : ''}
|skillName=${templateNameWithLink}
|skillType=${isHexaBoost ? 'Passive' : type}
|reqLv=${levelRequirement ?? ''}
|masterLevel=${maxLevel ?? ''}
|combatOrders=${combatOrders ?? ''}
|description=${description}
|formula=${formula}
}}`;
};

export const getElementAttribute = (elemAttr?: string) => {
    switch (elemAttr) {
        case 'i': return 'Ice';
        case 'f': return 'Fire';
        case 'd': return 'Dark';
        case 'l': return 'Lightning';
        case 's': return 'Poison';
        case 'h': return 'Holy';
        default: return undefined;
    }
};

export const getSkillProps = (id: string, skill: ImportedSkill, getSkill: (id: string) => ImportedSkill | undefined, options?: { skillClass?: string }): SkillProps => {
    const name = skill.strings.name ?? '';
    const iconName = name.replaceAll("[", "(").replaceAll("]", ")");
    const parameters = {
        ...skill.base,
        ...skill.common,
        // Converts millisecond cooldowns to seconds
        ...{
            cooltimeMS: skill.common.cooltimeMS != null
                ? (Number(skill.common.cooltimeMS) * 0.001).toString()
                : undefined,
        },
    } as Record<string, string>;
    const isHexaBoost = id.startsWith('50000');

    return {
        id,
        name,
        templateName: isHexaBoost
            ? `[[File: Skill ${iconName.replace(' Boost', '')}.png]] {{!}} [[${name}]]`
            : `[[File: Skill ${iconName}.png]] {{!}} ${name}`,
        templateNameWithLink: isHexaBoost
            ? `[[File: Skill ${iconName.replace(' Boost', '')}.png]] [[${name.replace(' Boost', '#6th Job Enhancement')}|${name}]]`
            : `[[File: Skill ${iconName}.png]] [[${name}]]`,
        link: isHexaBoost
            ? `https://maplestorywiki.net/w/${name.replace(' ', '_').replace(' Boost', '')}?action=edit`
            : `https://maplestorywiki.net/w/${name.replace(' ', '_')}?action=edit`,
        type: (id.slice(-4, -3) == '0') ? 'Passive' : 'Active',
        class: options?.skillClass,
        elementAttribute: getElementAttribute(skill.info.elemAttr),
        levelRequirement: skill.base.reqLev,
        maxLevel: skill.common.maxLevel,
        combatOrders: skill.info.combatOrders,
        isHexaBoost,
        vSkill: skill.info.vSkill,
        bgm: skill.info.bgm?.replace(/^.*\//g, ''),
        description: getSkillString(skill.strings.desc ?? '', parameters, parseFormula) + getReqs(skill, getSkill),
        readout: getSkillString(skill.strings.h ?? '', parameters, parseReadout),
        formula: getSkillString(skill.strings.h ?? '', parameters, parseFormula),
    };
};

const getReqs = (skill: ImportedSkill, getSkill: (id: string) => ImportedSkill | undefined) => {
    const reqs = Object.entries(skill.req).map(([key, value]) => {
        const reqSkill = getSkill(key);
        if (!reqSkill?.strings.name) {
            return null;
        }
        return `${reqSkill.strings.name} Lv. ${value}+`;
    }).filter(Boolean);

    if (reqs.length === 0) {
        return '';
    }
    return `<br />Required Skill: <span class="darkorange-text">${reqs.join(', ')}</span>`;
};
