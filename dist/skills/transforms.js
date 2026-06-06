/**
 * Transforms skill string data into a record of skill IDs to their string values
 * @param json - The skill string input data
 * @returns A record of skill IDs to their string values
 */
export const transformSkillStrings = (json) => {
    const skills = {};
    for (const [key, skill] of Object.entries(json.dir.dir)) {
        skills[skill._name] = skill.string?.reduce((acc, curr) => {
            acc[curr._name] = curr._value;
            return acc;
        }, {}) ?? {};
    }
    return skills;
};
/**
 * Transforms skill data into a record of skill IDs to their structured data
 */
export const transformSkills = (strings) => (json) => {
    const skills = {};
    for (const [key, skillList] of Object.entries(json.dir.dir)) {
        if (skillList._name === 'skill') {
            for (const skill of skillList.dir || []) {
                var skillId = skill._name;
                if (!skills[skillId]) {
                    skills[skillId] = {
                        common: {},
                        info: {},
                        req: {},
                        base: {},
                        strings: strings[skillId] || {},
                    };
                }
                // Copy all fields from skill into the appropriate category
                for (const category of skill.dir || []) {
                    if (['common', 'info', 'req'].includes(category._name)) {
                        const fields = [...category.int ?? [], ...category.int32 ?? [], ...category.int64 ?? [], ...category.string ?? []];
                        skills[skillId][category._name] = fields.reduce((acc, curr) => {
                            acc[curr._name] = curr._value;
                            return acc;
                        }, {}) ?? {};
                    }
                }
                // Some data sits at the top 'skill' level, copy these as well
                const baseFields = [...skill.int ?? [], ...skill.int32 ?? [], ...skill.int64 ?? [], ...skill.string ?? []];
                skills[skillId].base = baseFields.reduce((acc, curr) => {
                    acc[curr._name] = curr._value;
                    return acc;
                }, {}) ?? {};
            }
        }
    }
    return skills;
};
//# sourceMappingURL=transforms.js.map