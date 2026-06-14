import { Box, Group, Input } from "@mantine/core";
import { VersionSelector } from "./version_selector";
import { SkillOptionsContext } from "./skill_options_context";
import { useContext } from "react";

export const SkillsHeader = () => {
    const { options, setOptions } = useContext(SkillOptionsContext);
    const setSkillClass = (skillClass: string) => {
        setOptions((prev) => ({ ...prev, skillClass }));
    };
    const setVersion = (version: string) => {
        setOptions((prev) => ({ ...prev, version }));
    };

    return (
        <Box>
            <Group gap="xs">
                <VersionSelector />
                <Input size="xs" placeholder="GMS v268" value={options.version ?? ""} onChange={(e) => { setVersion(e.target.value); }} />
                <Input size="xs" placeholder="[[Hero/Skills#Warrior Basics|Swordman [Hero]]]" onChange={(e) => { setSkillClass(e.target.value); }} />
            </Group>
        </Box>
    );
};
