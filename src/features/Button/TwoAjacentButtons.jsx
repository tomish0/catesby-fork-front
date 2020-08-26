import React from "react";
import Button from "./Button";
import "../../css/TwoAdjacentButtons.css";

const TwoAjacentButtons = (props) => {
  return (
    <div className="buttons-single-item">
      <Button
        btnMessage={props.leftBtnMessage}
        className={props.leftBtnClass}
        onClick={props.leftOnClick}
      />
      <Button
        btnMessage={props.rightBtnMessage}
        className={props.rightBtnClass}
        onClick={props.rightOnClick}
      />
    </div>
  );
};

export default TwoAjacentButtons;
