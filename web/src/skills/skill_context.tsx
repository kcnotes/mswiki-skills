import { createContext } from "react";

export interface ImportedSkill {
    common: Record<string, string | undefined>;
    info: Record<string, string | undefined>;
    req: Record<string, string>;
    base: Record<string, string | undefined>;
    strings: Record<string, string | undefined>;
};

export interface SkillGroup {
    groupId: string;
    strings: Record<string, string>;
    skills: Record<string, ImportedSkill>;
}

export type SkillImport = Record<string, SkillGroup>;

export interface SkillImportState {
    skillImport?: SkillImport;
    setSkillImport: (skillImport?: SkillImport) => void;
}

export const SkillImportContext = createContext<SkillImportState>({
    setSkillImport: () => { /* empty */ },
});
