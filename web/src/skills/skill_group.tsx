import { useContext, useState } from "react";
import { SkillImportContext } from "./skill_context";
import { Checkbox, Stack, Title } from "@mantine/core";

export const SkillGroup = ({ groupId }: { groupId: string }) => {
    const { skillImport } = useContext(SkillImportContext);
    const group = skillImport?.[groupId];
    const [showInvisible, setShowInvisible] = useState(false);

    if (group == null) {
        return null;
    }

    return (
        <div>
            <Stack>
                <Checkbox label="Show invisible skills" checked={showInvisible} onChange={(e) => { setShowInvisible(e.target.checked); }} />
                <Title order={2}>{group.strings.bookName}</Title>
                {Object.entries(group.skills).filter(([, skill]) => showInvisible || !skill.base.invisible).map(([skillId, skill]) => (
                    <div key={skillId}>
                        <Title order={3}>{skillId}: {skill.strings.name}{skill.base.invisible ? ' (invisible)' : ''}</Title>
                        <p>{skill.strings.desc}</p>
                        {/* TODO: move these into individual Skill components */}
                        {Object.entries(skill.req).length > 0 && (
                            <p>Reqs:
                                <ul>
                                    {Object.entries(skill.req).map(([reqId, req]) => (
                                        <li key={reqId}>{skillImport?.[getGroupId(reqId)]?.skills[reqId]?.strings?.name || 'Unknown'}: {req}</li>
                                    ))}
                                </ul>
                            </p>
                        )}
                    </div>
                ))}
            </Stack>
        </div>
    );
};

const getGroupId = (id: string) => {
    return id.slice(0, -4);
};
