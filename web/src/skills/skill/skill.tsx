import { useContext, useState } from "react";
import { SkillImportContext } from "../skill_context";
import { Accordion, Alert, Button, Flex, Group, Stack, Table } from "@mantine/core";
import type { ImportedSkill } from "../skill_context";
import { ErrorBoundary } from "../../base/error_boundary";
import { getBoxTemplate, getGroupId, getSkillProps, getTableTemplate, type SkillProps } from "./skill_template";
import { useClipboard } from '@mantine/hooks';
import { CheckIcon } from "@phosphor-icons/react";
import { SkillOptionsContext } from "../skill_options_context";

export const Skill = ({ skillId, skill }: { skillId: string; skill: ImportedSkill }) => {
    const { skillImport } = useContext(SkillImportContext);
    const { options } = useContext(SkillOptionsContext);
    const props = getSkillProps(skillId, skill, options);
    return (
        <>
            <Accordion.Control>
                <Flex align="center" gap="sm">
                    {skillId}: {skill.strings.name}{skill.base.invisible ? ' (invisible)' : ''}
                </Flex>
            </Accordion.Control>
            <Accordion.Panel>
                <ErrorBoundary fallback={<Alert>An error occurred while loading this skill. Contact noreplyz.</Alert>}>
                    <Stack gap="xs">
                        <SkillButtons props={props} />
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Property</Table.Th>
                                    <Table.Th>Value</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {Object.entries(props).map(([key, value]) => {
                                    if (!value) {
                                        return null;
                                    }
                                    return (
                                        <Table.Tr key={key}>
                                            <Table.Td>{key}</Table.Td>
                                            <Table.Td>{value}</Table.Td>
                                        </Table.Tr>
                                    );
                                })}
                            </Table.Tbody>
                        </Table>
                        {Object.entries(skill.req).length > 0 && (
                            <>
                                <p>Reqs:</p>
                                <ul>
                                    {Object.entries(skill.req).map(([reqId, req]) => (
                                        <li key={reqId}>{skillImport?.[getGroupId(reqId)]?.skills[reqId]?.strings.name ?? 'Unknown'}: {req}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </Stack>
                </ErrorBoundary>
            </Accordion.Panel>
        </>
    );
};

type CopyType = 'tTable' | 'tBox' | 'description' | 'readout' | 'formula' | null;
export const SkillButtons = ({ props }: { props: SkillProps }) => {
    const { options } = useContext(SkillOptionsContext);
    const clipboard = useClipboard();
    const [copied, setCopied] = useState<CopyType>(null);

    const copy = (type: CopyType, text: string) => {
        console.log(text);
        clipboard.copy(text);
        setCopied(type);
        setTimeout(() => { setCopied(null); }, 1000);
    };

    return (
        <Group gap="xs" align="center">
            <Button
                variant="outline"
                size="compact-xs"
                component="a"
                href={props.link}
                target="_blank"
                rel="noopener noreferrer"
            >
                Wiki
            </Button>
            <Button
                variant="outline"
                size="compact-xs"
                rightSection={copied === 'tTable' ? <CheckIcon size={16} /> : undefined}
                onClick={() => { copy('tTable', getTableTemplate(props, options.version)); }}
            >
                Copy table
            </Button>
            <Button
                variant="outline"
                size="compact-xs"
                rightSection={copied === 'tBox' ? <CheckIcon size={16} /> : undefined}
                onClick={() => { copy('tBox', getBoxTemplate(props, options.version)); }}
            >
                Copy box
            </Button>
            <Button
                variant="outline"
                size="compact-xs"
                rightSection={copied === 'description' ? <CheckIcon size={16} /> : undefined}
                onClick={() => { copy('description', props.description); }}
            >
                Copy description
            </Button>
            <Button
                variant="outline"
                size="compact-xs"
                rightSection={copied === 'readout' ? <CheckIcon size={16} /> : undefined}
                onClick={() => { copy('readout', props.readout); }}
            >
                Copy readout
            </Button>
            <Button
                variant="outline"
                size="compact-xs"
                rightSection={copied === 'formula' ? <CheckIcon size={16} /> : undefined}
                onClick={() => { copy('formula', props.formula); }}
            >
                Copy formula
            </Button>
        </Group>
    );
};
