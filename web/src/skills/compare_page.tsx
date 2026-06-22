import { Suspense, useCallback, useContext, useState } from 'react';
import { Stack, Flex, ScrollArea, Box, Group, Input } from '@mantine/core';
import { Sidebar } from './sidebar/sidebar';
import { SkillImportContextProvider } from './skill_context_provider';
import { SkillGroup } from './skill_group';
import { SkillOptionsContextProvider } from './skill_options_context_provider';
import { SkillOptionsContext } from './skill_options_context';
import { SkillImportContext, type SkillImport } from './skill_context';
import { VersionSelector } from './version_selector';

const CompareHeader = ({ setOldImport }: { setOldImport: (imp: SkillImport) => void }) => {
    const { setSkillImport } = useContext(SkillImportContext);
    const { options, setOptions } = useContext(SkillOptionsContext);

    const handleNewImportLoad = useCallback((skillImport: SkillImport, tabberVersion: string) => {
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
                <VersionSelector label="Old version" onImportLoad={setOldImport} onFileLoad={setOldImport} />
                <VersionSelector label="New version" onImportLoad={handleNewImportLoad} onFileLoad={setSkillImport} />
                <Input size="xs" placeholder="GMS v268" value={options.version ?? ""} onChange={(e) => { setVersion(e.target.value); }} />
                <Input size="xs" placeholder="[[Hero/Skills#Warrior Basics|Swordman [Hero]]]" onChange={(e) => { setSkillClass(e.target.value); }} />
            </Group>
        </Box>
    );
};

export function CompareSkillsPage() {
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [oldImport, setOldImport] = useState<SkillImport | undefined>(undefined);

    return (
        <SkillImportContextProvider>
            <SkillOptionsContextProvider>
                <Stack gap="md" p="sm" h="100dvh">
                    <CompareHeader setOldImport={setOldImport} />
                    <Flex mih={0} flex="1" gap="sm">
                        <ScrollArea>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Sidebar selectGroup={setSelectedGroup} selectedGroup={selectedGroup} />
                            </Suspense>
                        </ScrollArea>
                        <ScrollArea flex="1">
                            {selectedGroup && (
                                <SkillGroup groupId={selectedGroup} compareImport={oldImport} />
                            )}
                        </ScrollArea>
                    </Flex>
                </Stack>
            </SkillOptionsContextProvider>
        </SkillImportContextProvider>
    );
}
