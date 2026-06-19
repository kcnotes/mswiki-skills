import { Button, FileButton, Menu } from "@mantine/core";
import { versions, defaultVersion } from "../data/skills/versions.json";
import { useCallback, useContext, useEffect, useState } from "react";
import { SkillImportContext, type SkillImport } from "./skill_context";
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';
import { SkillOptionsContext } from "./skill_options_context";

export type Versions = keyof typeof versions | null;

export const VersionSelector = () => {
    const { setSkillImport } = useContext(SkillImportContext);
    const { setOptions } = useContext(SkillOptionsContext);
    const [version, setVersion] = useState(defaultVersion as Versions);

    const getImport = useCallback(async (version: Versions) => {
        try {
            if (!version) {
                return;
            }
            const importResult = (await import(`../data/skills/${version}.json`)) as { default: SkillImport };
            setSkillImport(importResult.default);
            setOptions((prev) => ({
                ...prev,
                version: versions[version].tabber
            }));
        } catch (error) {
            console.error(error);
        }
    }, [setSkillImport, setOptions]);

    const setFile = async (file: File | null) => {
        try {
            const contents = await file?.text();
            setSkillImport(contents ? JSON.parse(contents) as SkillImport : undefined);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        void getImport(version);
    }, [getImport, version]);

    return (
        <Menu shadow="md" position="bottom-start">
            <Menu.Target>
                <Button variant="outline" size="xs" rightSection={<CaretDownIcon size={14} />}>Select version</Button>
            </Menu.Target>
            <Menu.Dropdown>
                <FileButton onChange={(file) => void setFile(file)}>
                    {(props) => <Button variant="subtle" size="xs" onClick={props.onClick}>Upload local file</Button>}
                </FileButton>
                <Menu.Divider />
                {Object.keys(versions).map((v) => (
                    <Menu.Item
                        key={v}
                        onClick={() => { setVersion(v as Versions); }}
                        rightSection={v === version ? <CheckIcon size={14} /> : undefined}
                    >
                        {v}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu >
    );
};
