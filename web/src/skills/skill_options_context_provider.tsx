
import { useState } from "react";
import { SkillOptionsContext, type SkillOptions } from "./skill_options_context";

export const SkillOptionsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [options, setOptions] = useState<SkillOptions>({});
    return (
        <SkillOptionsContext.Provider value={{ options, setOptions }}>
            {children}
        </SkillOptionsContext.Provider>
    );
};
