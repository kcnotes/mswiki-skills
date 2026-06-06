import { createContext } from "react";

export interface ImportedSkill {
    common: Record<string, string>;
    info: Record<string, string>;
    req: Record<string, string>;
    base: Record<string, string>;
    strings: Record<string, string>;
};

export interface SkillGroup {
    groupId: string;
    strings: Record<string, string>;
    skills: Record<string, ImportedSkill>;
}

export type SkillImport = Record<string, SkillGroup>;

export interface SkillImportState {
    skillImport?: SkillImport | null;
    setSkillImport: (skillImport: SkillImport | null) => void;
}

export const SkillImportContext = createContext<SkillImportState>(null);
