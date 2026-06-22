import { useContext, useState } from "react";
import { SkillImportContext, type SkillImport } from "./skill_context";
import { Accordion, Checkbox, ScrollArea, Stack, Title } from "@mantine/core";
import { Skill } from "./skill/skill";

interface SkillGroupProps {
    groupId: string;
    compareImport?: SkillImport;
}

export const SkillGroup = ({ groupId, compareImport }: SkillGroupProps) => {
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
                            <Skill
                                skillId={skillId}
                                skill={skill}
                                compareSkill={compareImport?.[groupId]?.skills[skillId]}
                            />
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Stack>
        </ScrollArea>
    );
};
