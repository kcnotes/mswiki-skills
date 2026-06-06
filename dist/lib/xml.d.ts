/**
 * Converts an XML file within an input folder, and writes to the output folder
 */
export declare function convertFile<T>(xmlPath: string, opts: {
    inputFolder: string;
    outputFolder: string;
    normalize?: (data: any) => T;
}): Promise<T>;
/**
 * Parses an XML file into a JS object
 */
export declare function parseXml<T extends any>(xmlPath: string, normalize?: (data: any) => T): Promise<any>;
//# sourceMappingURL=xml.d.ts.map