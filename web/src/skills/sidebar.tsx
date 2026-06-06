import { NavLink } from "@mantine/core";
import { useContext } from "react";
import { SkillImportContext } from "./skill_context";

export const Sidebar = ({ selectGroup }: { selectGroup: (skillId: string) => void }) => {
    const { skillImport } = useContext(SkillImportContext);
    return (
        <>
            {Object.values(skillImport ?? {}).map((group) => {
                const { strings, groupId } = group;
                const label = strings.bookName ? `${strings.bookName} (${groupId})` : groupId;
                return (
                    <NavLink key={groupId} label={label} h="24px" onClick={() => { selectGroup(groupId); }} />
                );
            })}
        </>
    );
};
