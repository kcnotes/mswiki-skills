import { useContext, useState } from "react";
import { SkillImportContext } from "./skill_context";
import { Accordion, Checkbox, ScrollArea, Stack, Title } from "@mantine/core";
import { Skill } from "./skill/skill";

export const SkillGroup = ({ groupId }: { groupId: string }) => {
    const { skillImport } = useContext(SkillImportContext);
    const group = skillImport?.[groupId];
    const [showInvisible, setShowInvisible] = useState(false);

    if (group == null) {
        return null;
    }

    return (
        <ScrollArea>
            <Stack>
                <Checkbox label="Show invisible skills" checked={showInvisible} onChange={(e) => { setShowInvisible(e.target.checked); }} />
                <Title order={2}>{group.strings.bookName}</Title>
                <Accordion order={3} variant="filled">
                    {Object.entries(group.skills).filter(([, skill]) => showInvisible || !skill.base.invisible).map(([skillId, skill]) => (
                        <Accordion.Item key={skillId} value={skillId}>
                            <Skill skillId={skillId} skill={skill} />
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Stack>
        </ScrollArea>
    );
};
