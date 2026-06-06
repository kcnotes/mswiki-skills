import type { SkillInput } from "./types/skill_input.js";
import type { SkillStringInput } from "./types/skill_string_input.js";
export type Skill = {
    common: Record<string, string>;
    info: Record<string, string>;
    req: Record<string, string>;
    base: Record<string, string>;
    strings: Record<string, string>;
};
/**
 * Transforms skill string data into a record of skill IDs to their string values
 * @param json - The skill string input data
 * @returns A record of skill IDs to their string values
 */
export declare const transformSkillStrings: (json: SkillStringInput) => Record<string, Record<string, string>>;
/**
 * Transforms skill data into a record of skill IDs to their structured data
 */
export declare const transformSkills: (strings: Record<string, Record<string, string>>) => (json: SkillInput) => Record<string, Skill>;
//# sourceMappingURL=transforms.d.ts.map