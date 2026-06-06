export type LeafValue<T = string> = {
    _name: string;
    _value: T;
};
export type SkillInput = {
    dir: {
        _name: string;
        dir: (SkillList | Info)[];
    };
};
export type Info = {
    _name: "info";
};
export type SkillList = {
    _name: "skill";
    dir?: Skill[];
};
export type Skill = {
    _name: string;
    dir?: (SkillInfo | SkillCommon | SkillReq)[];
    int?: LeafValue<string>[];
    int32?: LeafValue<string>[];
    int64?: LeafValue<string>[];
    string?: LeafValue<string>[];
};
export type SkillInfo = {
    _name: "info";
    int?: LeafValue<string>[];
    int32?: LeafValue<string>[];
    int64?: LeafValue<string>[];
    string?: LeafValue<string>[];
};
export type SkillCommon = {
    _name: "common";
    string?: LeafValue<string>[];
    int?: LeafValue<string>[];
    int32?: LeafValue<string>[];
    int64?: LeafValue<string>[];
};
export type SkillReq = {
    _name: "req";
    int?: LeafValue<string>[];
    int32?: LeafValue<string>[];
    int64?: LeafValue<string>[];
    string?: LeafValue<string>[];
};
//# sourceMappingURL=skill_input.d.ts.map