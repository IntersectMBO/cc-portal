"use client";

import React, { PropsWithChildren } from "react";

import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { TextArea } from "./TextArea";
import { Select } from "./Select";
import { Upload } from "./Upload";

type ControlledFieldComposition = React.FC<PropsWithChildren> & {
  Checkbox: typeof Checkbox;
  Input: typeof Input;
  TextArea: typeof TextArea;
  Select: typeof Select;
  Upload: typeof Upload;
};

const ControlledField: ControlledFieldComposition = ({ children }) => (
  <>{children}</>
);

ControlledField.Checkbox = Checkbox;
ControlledField.Input = Input;
ControlledField.TextArea = TextArea;
ControlledField.Select = Select;
ControlledField.Upload = Upload;

export { ControlledField };
