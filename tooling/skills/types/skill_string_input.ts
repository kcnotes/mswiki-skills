export type SkillStringInput = {
  dir: {
    dir: Field[],
    _name: "Skill.img"
  };
};

type LeafValue<T> = {
  _name: T;
  _value: string;
};

type BookField = "bookName";
type SkillField = "name" | "desc" | "h" | "h1";

type Field = {
  string?: LeafValue<BookField | SkillField>[];
  _name: string; // book/skill ID
};
