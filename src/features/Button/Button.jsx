import React from "react";
import "../../css/Button.css";

const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`button-comp ${props.className}`}
      type={props.type}
    >
      {props.btnMessage}
    </button>
  );
};

export default Button;
