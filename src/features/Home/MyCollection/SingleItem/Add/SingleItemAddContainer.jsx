import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { postInventoryItem } from "../singleItemSlice";
import SingleItemAdd from "./SingleItemAdd";

const SingleItemAddContainer = () => {
  const dispatch = useDispatch(); // react-redux method

  const emptyItem = {
    title: "",
    description: "",
    price_range: "",
    currency: "",
    quantity: 1,
    location: "",
    region: "",
    country: "",
    vintage: "",
    age: "",
    strength: "",
    image_0: "",
  };

  const [item, setItem] = useState(emptyItem);
  const [noTitleSize, setNoTitleSize] = useState(false);

  const handleAddSubmit = (
    itemSpecifications,
    newSpecification,
    newSpecificationArray,
    changeMade
  ) => {
    var titleSize = true;
    if (
      itemSpecifications.title.length === 0 &&
      itemSpecifications.size.length === 0
    ) {
      titleSize = false;
    }

    if (titleSize) {
      // add values to the size_unit & currency if no selection is made
      if (!itemSpecifications.size_unit) {
        itemSpecifications.size_unit = "cL";
      }
      if (!itemSpecifications.currency) {
        itemSpecifications.currency = "GBP";
      }
      // create a copy object of the itemSpecification state
      const stateObjCopy = { ...itemSpecifications };
      // create a copy object of the itemSpecification & newSpecification state
      const removedSpecObj = { ...stateObjCopy, ...newSpecification };
      // add the newSpecificationArray objects that have both key/value into object
      newSpecificationArray.forEach((obj) => {
        if (obj.key.length > 0 && obj.value.length > 0) {
          removedSpecObj[obj.key.trim()] = obj.value.trim();
        }
      });
      // for every key value pair in the object, if there is no value then delete
      // from the object
      Object.entries(removedSpecObj).forEach(([key, value]) => {
        if (value === undefined || value === null || value.length === 0) {
          delete removedSpecObj[key];
        }
      });
      // create id key depending on whether is known or unknown
      const idKey = item.catalogueKnownId
        ? "catalogueKnownId"
        : "catalogueUnknownId";
      // delete the inventory & inventory specifications from object
      const deleteKeys = [
        "quantity",
        "location",
        "title",
        "description",
        idKey,
      ];
      deleteKeys.forEach((key) => {
        delete removedSpecObj[key];
      });
      // create id value depending on whether is known or unknown
      const id = item.catalogueKnownId
        ? item.catalogueKnownId
        : item.catalogueUnknownId;
      // create the data object with 3 sections
      const data = {
        // inventory object data sent to inventory tables
        inventory: {
          location: stateObjCopy.location,
          quantity:
            stateObjCopy.quantity.length !== 0 ? stateObjCopy.quantity : 1,
        },
        // catalogue object data sent to catalogue table
        catalogue: {
          [idKey]: id,
          title:
            stateObjCopy.title.length > 0 ? stateObjCopy.title : item.title,
          description: stateObjCopy.description,
        },
        // catalogue specifications object data sent to catalogueSpecifications table
        catalogueSpecifications: {
          size: item.size,
          size_unit: item.size_unit,
          ...removedSpecObj,
        },
        // used to handle route if updating inventory item or adding new
        updateOrAdd: "add",
      };
      if (!itemSpecifications.image_0) {
        itemSpecifications.image_0 = "";
      }
      // add changeMade to data object if a change has been made in update
      if (
        changeMade ||
        itemSpecifications.image_0.includes("data:image/jpeg;base64,")
      ) {
        data.changeMade = true;
      }
      // dispatch to function in singleItemSlice
      dispatch(postInventoryItem(data));
    } else {
      setNoTitleSize(true);
      window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>
      <SingleItemAdd
        handleAddSubmit={handleAddSubmit}
        noTitleSize={noTitleSize}
        setNoTitleSize={setNoTitleSize}
        item={item}
        setItem={setItem}
        emptyItem={emptyItem}
      />
    </div>
  );
};

export default SingleItemAddContainer;
