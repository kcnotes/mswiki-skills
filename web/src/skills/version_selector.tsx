import { Button, Menu } from "@mantine/core";
import { versions } from "../data/skills/versions.json";
import { useContext } from "react";
import { SkillImportContext, type SkillImport } from "./skill_context";

export const VersionSelector = () => {
    const { setSkillImport } = useContext(SkillImportContext);

    const getImport = async (version: string) => {
        try {
            const importResult = (await import(`../data/skills/${version}.json`)) as { default: SkillImport };
            setSkillImport(importResult.default);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Menu shadow="md" position="bottom-start">
            <Menu.Target>
                <Button variant="outline" size="xs">Select version</Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item key="upload">Upload local file</Menu.Item>
                <Menu.Divider />
                {Object.keys(versions).map((version) => (
                    <Menu.Item key={version} onClick={() => void getImport(version)}>{version}</Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};
