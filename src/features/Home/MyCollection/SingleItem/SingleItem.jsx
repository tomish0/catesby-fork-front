import React from "react";
import "../../../../css/SingleItem.css";
import TopSpecs from "./SingleItemSpecifications/TopSpecs";
import PrimeSpecs from "./SingleItemSpecifications/PrimeSpecs";
import ItemSpecs from "./SingleItemSpecifications/ItemSpecs";

const SingleItem = (props) => {
  // single product props received from either click in SearchInventory list
  // or after an update in SingleItemUpdate
  const item = props.item;

  // copy of props to make alterations
  const unfreezePropObj = JSON.parse(JSON.stringify(item));
  // delete the catalogue id from copy object
  unfreezePropObj.catalogueKnownId
    ? delete unfreezePropObj.catalogueKnownId
    : delete unfreezePropObj.catalogueUnknownId;
  // keys in object to delete to have an object with purely random/dynamic key/values
  const deleteKeys = [
    "entryDate",
    "age",
    "country",
    "currency",
    "inventoryId",
    "title",
    "description",
    "quantity",
    "price_range",
    "image_0",
    "region",
    "location",
    "strength",
    "vintage",
    "size",
    "size_unit",
    "user_id",
    "id",
  ];
  // loop over above keys in object to delete
  deleteKeys.forEach((key) => {
    delete unfreezePropObj[key];
  });

  return (
    <div>
      <div className="single-item-container">
        <TopSpecs item={item} />
        <PrimeSpecs item={item} />
        <ItemSpecs item={item} unfreezePropObj={unfreezePropObj} />
      </div>
    </div>
  );
};

export default SingleItem;
