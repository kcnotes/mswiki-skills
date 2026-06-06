
import { useState } from "react";
import { SkillImportContext } from "./skill_context";
import type { SkillImportState } from "./skill_context";

export const SkillImportContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [skillImport, setSkillImport] = useState<SkillImportState["skillImport"]>(null);
    return (
        <SkillImportContext.Provider value={{ skillImport, setSkillImport }}>
            {children}
        </SkillImportContext.Provider>
    );
};
