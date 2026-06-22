import { Button, FileButton, Menu } from "@mantine/core";
import { versions, defaultVersion } from "../data/skills/versions.json";
import { useCallback, useEffect, useState } from "react";
import type { SkillImport } from "./skill_context";
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';

export type Versions = keyof typeof versions | null;

interface VersionSelectorProps {
    onImportLoad: (skillImport: SkillImport, tabberVersion: string) => void;
    onFileLoad?: (skillImport: SkillImport) => void;
    label?: string;
}

export const VersionSelector = ({ onImportLoad, onFileLoad, label = "Select version" }: VersionSelectorProps) => {
    const [version, setVersion] = useState(defaultVersion as Versions);

    const getImport = useCallback(async (version: Versions) => {
        try {
            if (!version) {
                return;
            }
            const importResult = (await import(`../data/skills/${version}.json`)) as { default: SkillImport };
            onImportLoad(importResult.default, versions[version].tabber);
        } catch (error) {
            console.error(error);
        }
    }, [onImportLoad]);

    const setFile = async (file: File | null) => {
        try {
            const contents = await file?.text();
            if (contents) {
                const skillImport = JSON.parse(contents) as SkillImport;
                onFileLoad?.(skillImport);
            }
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
                <Button variant="outline" size="xs" rightSection={<CaretDownIcon size={14} />}>{label}</Button>
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
        </Menu>
    );
};
