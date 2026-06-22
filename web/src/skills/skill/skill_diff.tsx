import { Table, Text } from "@mantine/core";
import { diffWords } from "diff";
import type { SkillProps } from "./skill_template";

interface SkillDiffProps {
    newProps: SkillProps;
    oldProps: SkillProps;
}

const toString = (value: SkillProps[keyof SkillProps]): string => {
    if (value == null || value === false) return '';
    if (value === true) return 'true';
    return String(value);
};

const DiffText = ({ oldVal, newVal }: { oldVal: string; newVal: string }) => {
    const parts = diffWords(oldVal, newVal);
    return (
        <>
            {parts.map((part, i) => {
                if (part.added) {
                    return <Text key={i} span c="green" style={{ whiteSpace: 'pre-wrap' }}>{part.value}</Text>;
                }
                if (part.removed) {
                    return <Text key={i} span c="red" td="line-through" style={{ whiteSpace: 'pre-wrap' }}>{part.value}</Text>;
                }
                return <Text key={i} span style={{ whiteSpace: 'pre-wrap' }}>{part.value}</Text>;
            })}
        </>
    );
};

export const SkillDiff = ({ newProps, oldProps }: SkillDiffProps) => {
    const keys = Array.from(new Set([
        ...Object.keys(newProps),
        ...Object.keys(oldProps),
    ])) as (keyof SkillProps)[];

    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Property</Table.Th>
                    <Table.Th>Value</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {keys.map((key) => {
                    const newVal = toString(newProps[key]);
                    const oldVal = toString(oldProps[key]);

                    if (!newVal && !oldVal) return null;

                    const changed = newVal !== oldVal;

                    return (
                        <Table.Tr
                            key={key}
                            style={changed ? { backgroundColor: 'var(--mantine-color-yellow-light)' } : undefined}
                        >
                            <Table.Td>{key}</Table.Td>
                            <Table.Td>
                                {changed ? (
                                    <DiffText oldVal={oldVal} newVal={newVal} />
                                ) : (
                                    newVal
                                )}
                            </Table.Td>
                        </Table.Tr>
                    );
                })}
            </Table.Tbody>
        </Table>
    );
};
