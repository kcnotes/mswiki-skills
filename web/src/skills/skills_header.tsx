import { Box, Group, Input } from "@mantine/core";
import { VersionSelector } from "./version_selector";
import { SkillOptionsContext } from "./skill_options_context";
import { useCallback, useContext } from "react";
import { SkillImportContext } from "./skill_context";
import type { SkillImport } from "./skill_context";

export const SkillsHeader = () => {
    const { setSkillImport } = useContext(SkillImportContext);
    const { options, setOptions } = useContext(SkillOptionsContext);

    const handleImportLoad = useCallback((skillImport: SkillImport, tabberVersion: string) => {
        setSkillImport(skillImport);
        setOptions((prev) => ({ ...prev, version: tabberVersion }));
    }, [setSkillImport, setOptions]);

    const setSkillClass = (skillClass: string) => {
        setOptions((prev) => ({ ...prev, skillClass }));
    };
    const setVersion = (version: string) => {
        setOptions((prev) => ({ ...prev, version }));
    };

    return (
        <Box>
            <Group gap="xs">
                <VersionSelector onImportLoad={handleImportLoad} onFileLoad={setSkillImport} />
                <Input size="xs" placeholder="GMS v268" value={options.version ?? ""} onChange={(e) => { setVersion(e.target.value); }} />
                <Input size="xs" placeholder="[[Hero/Skills#Warrior Basics|Swordman [Hero]]]" onChange={(e) => { setSkillClass(e.target.value); }} />
            </Group>
        </Box>
    );
};
