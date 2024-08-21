import React from "react";

type Props = {
  children: React.ReactNode;
  wrapper: any;
  condition: boolean;
};

const ConditionalWrapper: React.FC<Props> = ({
  condition,
  wrapper,
  children,
}: Props): JSX.Element => (condition ? wrapper(children) : children);

export default ConditionalWrapper;
