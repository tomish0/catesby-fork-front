import React from "react";

const TopSpecs = (props) => {
  const item = props.item;
  return (
    <div className="item-top-container">
      <h3>{item.title}</h3>
      <div className="img-description-container">
        {item.image_0 ? (
          <img
            src={`https://api.spiritbunker.com/alcohol_images/${
              item.image_0
            }?${Math.round(Math.random() * 1000)}`}
            className="img-no-update"
            alt={`${item.title}`}
          />
        ) : null}
        {item.description ? (
          <div className="inventory-description">{item.description}</div>
        ) : null}
      </div>
    </div>
  );
};

export default TopSpecs;
