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
//# sourceMappingURL=skill_string_transform.js.map