import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logUserOut } from "../../../Authentication/authSlice";
import Button from "../../../Button/Button";
import TwoAjacentButtons from "../../../Button/TwoAjacentButtons";
import { domain } from "../../../../whichDomain/whichDomain";

const DeleteUser = () => {
  const dispatch = useDispatch(); // react-redux method

  const [deleteClicked, setDeleteClicked] = useState(false);

  const handleDelete = () => {
    const url = `${domain}/user/`;
    axios({
      method: "delete",
      url: url,
    })
      .then((res) => {
        console.dir(res);
        dispatch(logUserOut());
      })
      .catch((err) => {
        console.dir(err);
      });
  };

  return (
    <div className="delete-user-container">
      {!deleteClicked ? (
        <Button
          btnMessage={"Delete Account"}
          className={"delete-account-btn"}
          onClick={() => setDeleteClicked(true)}
        />
      ) : (
        <TwoAjacentButtons
          leftBtnMessage={"Sure?"}
          leftBtnClass={"confirm-delete-account-btn"}
          leftOnClick={handleDelete}
          rightBtnMessage={"Cancel"}
          rightBtnClass={"cancel-delete-item-btn"}
          rightOnClick={() => setDeleteClicked(false)}
        />
      )}
    </div>
  );
};

export default DeleteUser;
