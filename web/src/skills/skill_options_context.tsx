import { createContext } from "react";

export interface SkillOptions {
    skillClass?: string,
    version?: string,
};

export interface SkillOptionsCtx {
    options: SkillOptions,
    setOptions: (options: (prev: SkillOptions) => SkillOptions) => void,
}

export const SkillOptionsContext = createContext<SkillOptionsCtx>({
    options: {},
    setOptions: () => { /* empty */ },
});
