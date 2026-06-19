import { NavLink } from "@mantine/core";
import { useContext } from "react";
import { SkillImportContext } from "../skill_context";

export const Sidebar = ({ selectGroup, selectedGroup }: { selectGroup: (skillId: string) => void, selectedGroup: string | null }) => {
    const { skillImport } = useContext(SkillImportContext);
    return (
        <>
            {Object.values(skillImport ?? {}).map((group) => {
                const { strings, groupId } = group;
                const label = strings.bookName ? `${strings.bookName} (${groupId})` : groupId;
                return (
                    <NavLink
                        key={groupId}
                        label={label}
                        h="28px"
                        onClick={() => { selectGroup(groupId); }}
                        variant="light"
                        active={selectedGroup === groupId}
                    />
                );
            })}
        </>
    );
};
