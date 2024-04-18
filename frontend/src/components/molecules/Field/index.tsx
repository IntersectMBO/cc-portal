import React, { PropsWithChildren } from "react";

import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { MultipleSelect } from "./MultipleSelect";
import { TextArea } from "./TextArea";

type FieldComposition = React.FC<PropsWithChildren> & {
  Input: typeof Input;
  Checkbox: typeof Checkbox;
  TextArea: typeof TextArea;
  MultipleSelect: typeof MultipleSelect;
};

const Field: FieldComposition = ({ children }) => <>{children}</>;

Field.Checkbox = Checkbox;
Field.Input = Input;
Field.TextArea = TextArea;
Field.MultipleSelect = MultipleSelect;

export { Field };

export * from "./types";
