import React from "react";
import Button from "./Button";

const ButtonIcon = ({ iconName, ...props }) => {
  return (
    <Button className="btn-icon" {...props}>
      <i className="material-icons">{iconName}</i>
    </Button>
  );
};

export default ButtonIcon;
