import { Suspense, useState } from 'react';
import { Stack, Flex, ScrollArea } from '@mantine/core';
import { Sidebar } from '../skills/sidebar/sidebar';
import { SkillImportContextProvider } from '../skills/skill_context_provider';
import { SkillGroup } from '../skills/skill_group';
import { SkillOptionsContextProvider } from '../skills/skill_options_context_provider';
import { SkillsHeader } from '../skills/skills_header';

export function SkillsPage() {
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    return (
        <SkillImportContextProvider>
            <SkillOptionsContextProvider>
                <Stack gap="md" p="sm" h="100dvh">
                    <SkillsHeader />
                    <Flex mih={0} flex="1" gap="sm">
                        <ScrollArea>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Sidebar selectGroup={setSelectedGroup} selectedGroup={selectedGroup} />
                            </Suspense>
                        </ScrollArea>
                        <ScrollArea flex="1">
                            {selectedGroup && <SkillGroup groupId={selectedGroup} />}
                        </ScrollArea>
                    </Flex>
                </Stack>
            </SkillOptionsContextProvider>
        </SkillImportContextProvider>
    );
}
