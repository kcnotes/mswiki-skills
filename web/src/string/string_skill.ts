import { stringTokeniser } from "./string_tokenizer";

const startContainerMap = {
    'c': '<span class="darkorange-text">',
    'r': '<span class="red-text">',
    'b': '<span class="blue-text">',
    'e': '<strong>',
} as const;

const endContainerMap = {
    'c': '</span>',
    'r': '</span>',
    'b': '</span>',
    'e': '</strong>',
} as const;

export const getSkillString = (
    str: string,
    parameters: Record<string, string>,
    parser: (param: string, parameters: Record<string, string>) => string,
) => {
    const tokens = stringTokeniser(str, Object.keys(parameters));
    const res = tokens.map(token => {
        switch (token.type) {
            case 'start-container':
                return startContainerMap[token.containerType];
            case 'end-container':
                return endContainerMap[token.containerType];
            case 'content':
                return parseContent(token.content);
            case 'parameter':
                return parser(token.parameter, parameters);
            default:
                return '';
        }
    }).join('');
    return clean(res);
};

/**
 * Given the parameter name, e.g. 'damage', generates the formula expression for that parameter
 */
export const parseFormula = (param: string, parameters: Record<string, string>): string => {
    const value = parameters[param] as string | undefined;
    if (value == null) {
        return `#${param}`;
    }
    // Value is an expression
    if (isNaN(Number(value))) {
        const parsed = value
            .replace(/u\(/g, 'ceil(')
            .replace(/d\(/g, 'floor(');
        return `{#expr:${parsed}}`;
    }
    // Value is a number
    return value;
};

export const parseReadout = (param: string): string => {
    return `#${param}`;
};

export const parseContent = (str: string): string => {
    const res = str
        .replace(/\\r\\n/g, '<br /><br />')
        .replace(/\\n/g, '<br />');
    return res;
};

export const clean = (str: string): string => {
    return str.replace(/-{/g, '&#45;{');
};
