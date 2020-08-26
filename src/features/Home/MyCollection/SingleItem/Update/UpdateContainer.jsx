import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { currencySymbolsToCodes } from "../../../../../currencySymbols/currencySymbols";
import {
  selectSingleItem,
  putItemDetails,
  updatedData,
} from "../singleItemSlice";
import SingleItemUpdate from "./SingleItemUpdate";
import SingleItemContainer from "../SingleItemContainer";

const UpdateContainer = (props) => {
  const dispatch = useDispatch(); // react-redux method

  const singleItem = useSelector(selectSingleItem);

  const handleUpdateSubmit = (
    itemSpecifications,
    newSpecification,
    newSpecificationArray,
    changeMade
  ) => {
    // only post if change occured = true
    if (
      changeMade ||
      itemSpecifications.image_0.includes("data:image/jpeg;base64,")
    ) {
      // create a copy object of the itemSpeification state
      const stateObjCopy = { ...itemSpecifications };
      // create a copy object of the itemSpeification & newSpecification state
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
      // if there isn't a change to the currency in the select menu but
      // the user has added a price then add the £ as currency (top of select list)
      if (removedSpecObj.price_range && !removedSpecObj.currency) {
        removedSpecObj.currency = "\u00A3";
      }
      // delete the inventory & inventory specifications from object
      const deleteKeys = ["quantity", "location", "title", "description"];
      deleteKeys.forEach((key) => {
        delete removedSpecObj[key];
      });
      // change the currency back to the currency code
      removedSpecObj.currency = currencySymbolsToCodes[removedSpecObj.currency];
      // create id value depending on whether is known or unknown
      const id = props.item.catalogueKnownId
        ? props.item.catalogueKnownId
        : props.item.catalogueUnknownId;
      // create id key depending on whether is known or unknown
      const idKey = props.item.catalogueKnownId
        ? "catalogueKnownId"
        : "catalogueUnknownId";
      // create the data object with 3 sections
      const data = {
        // inventory object data sent to inventory tables
        inventory: {
          inventoryId: parseInt(props.item.inventoryId),
          location: stateObjCopy.location,
          quantity:
            stateObjCopy.quantity.length !== 0 ? stateObjCopy.quantity : 1,
        },
        // catalogue object data sent to catalogue table
        catalogue: {
          [idKey]: id,
          title:
            stateObjCopy.title.length > 0
              ? stateObjCopy.title
              : props.item.title,
          description: stateObjCopy.description,
        },
        // catalogue specifications object data sent to catalogueSpecifications table
        catalogueSpecifications: {
          size: props.item.size,
          size_unit: props.item.size_unit,
          ...removedSpecObj,
        },
        updateOrAdd: 'update',
      };
      // dispatch to function in singleItemSlice
      dispatch(putItemDetails(data));
    } else {
      dispatch(updatedData(true));
      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
      {!singleItem.updatedData ? (
        <div>
          <button
            // sets updateClicked to false in SingleItem to take user back
            className="back-btn"
            onClick={() => props.setUpdateClicked(false)}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="icon" />
            &nbsp;Back
          </button>
          <SingleItemUpdate
            item={props.item} // product
            handleUpdateSubmit={handleUpdateSubmit}
          />
        </div>
      ) : (
        <SingleItemContainer item={singleItem.result} />
      )}
    </div>
  );
};

export default UpdateContainer;
