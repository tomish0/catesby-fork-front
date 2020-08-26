import React from "react";
import UseCameraRoute from "../../../UseCamera/UseCameraRoute";

const UpdateTopSpecs = (props) => {
  return (
    <div className="item-top-container">
      <h3>
        <input
          type="text"
          name="title"
          className={
            props.noResult
              ? "item-top-container-value update input-highlight"
              : "item-top-container-value update "
          }
          placeholder="Title..."
          value={props.itemSpecifications.title}
          onChange={props.handleItemDetails}
        />
      </h3>
      <div className="update-image-container">
        <UseCameraRoute
          itemSpecifications={props.itemSpecifications}
          setItemSpecifications={props.setItemSpecifications}
          image_0={props.image_0}
        />
      </div>
      <textarea
        type="text"
        name="description"
        className="item-top-container-value update update-textarea"
        placeholder={"Description..."}
        value={props.itemSpecifications.description}
        onChange={props.handleItemDetails}
      />
    </div>
  );
};

export default UpdateTopSpecs;
