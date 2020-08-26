import React, { useState } from "react";
import UpdateSpecsContainer from "./UpdateSpecifications/UpdateSpecsContainer";
import TwoAjacentButtons from "../../../../Button/TwoAjacentButtons";

const SingleItemUpdate = (props) => {
  // props receieved from SingleItem
  const item = props.item; // product
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
  ];
  // loop over above keys in object to delete
  deleteKeys.forEach((key) => {
    delete unfreezePropObj[key];
  });

  const size = item.size && item.size_unit ? item.size + item.size_unit : null;
  // the singleItem object stored in redux state is used to either render update page
  // or take you back to SingleItem page with updated data

  const [itemSpecifications, setItemSpecifications] = useState({
    // State for the form details filled with item data to give inputs value
    // some are conditionals since data can be undefined - key/value not stored in db
    title: item.title,
    description: item.description,
    price_range: item.price_range ? item.price_range : "",
    currency: item.currency ? item.currency : "",
    quantity: item.quantity ? item.quantity : "",
    location: item.location ? item.location : "",
    size: item.size ? item.size : "",
    size_unit: item.size_unit ? item.size_unit : "",
    region: item.region ? item.region : "",
    country: item.country ? item.country : "",
    vintage: item.vintage ? item.vintage : "",
    age: item.age ? item.age : "",
    strength: item.strength ? item.strength : "",
    image_0: item.image_0 ? item.image_0 : "",
  });

  // state to handle if chnage actually occured - request only sent if true
  const [changeMade, setChangeMade] = useState(false);

  const handleItemDetails = (e) => {
    setChangeMade(true); // change occured so request will be sent
    // function to handle input changes for itemSpecifications state above
    setItemSpecifications({
      ...itemSpecifications,
      [e.target.name]: e.target.value,
    });
  };

  // state for mapped over unfreezePropObj
  const [newSpecification, setNewSpecification] = useState(unfreezePropObj);

  const handleRandomItemDetails = (e, key) => {
    setChangeMade(true); // change occured so request will be sent
    // function to handle input changes to
    // newSpecification state above
    setNewSpecification({
      ...newSpecification,
      [key]: e.target.value,
    });
  };

  // object used to be filled in when a user adds details in empty key value inputs
  const blankObject = { key: "", value: "" };
  // state array of new key/value pairs added into blankObject type
  const [newSpecificationArray, setNewSpecificationArray] = useState([
    blankObject,
  ]);

  const handleNewSpecificationKey = (e, index) => {
    setChangeMade(true); // change occured so request will be sent
    // handle the new key typed into the input
    // correctIndex is used to re-add the correct sliced part of the state array
    // after the position in the array where the new key is added
    const correctIndex = index + 1;
    // set the array with the new key at the correct position
    // e.g : if there are 4 elements in the array [0, 1, 2, 3], meaning 4 empty key/value input pairs
    // the user types a key into the 2nd in the array - index 1
    // the array is sliced before position index 1 to return the first element in array
    // array element 0 is spread into the state array
    // then the new key is added to the object with e.target.value
    // & the value remains refers to its previous value found in array[index]
    // after the position index 1, then need to re-spread the rest of the array into the correct postion
    // using correct index, you slice the array at point 2 & above, returning the rest of the array
    setNewSpecificationArray([
      ...newSpecificationArray.slice(0, index),
      {
        key: e.target.value,
        value: newSpecificationArray[index].value,
      },
      ...newSpecificationArray.slice(correctIndex),
    ]);
  };

  const handleNewSpecificationValue = (e, index) => {
    setChangeMade(true); // change occured so request will be sent
    // handle the new value typed into the input
    // logic same as above
    const correctIndex = index + 1;
    setNewSpecificationArray([
      ...newSpecificationArray.slice(0, index),
      {
        key: newSpecificationArray[index].key,
        value: e.target.value,
      },
      ...newSpecificationArray.slice(correctIndex),
    ]);
  };

  return (
    <div>
      <div
        onSubmit={
          props.handleUpdateSubmit
            ? props.handleUpdateSubmit
            : props.handleAddSubmit
        }
        className="single-item-container"
      >
        {/* Send the data into Update Container which contains the various 
          components cotaining the various input fields - component is also used 
          by SingleItemAdd */}
        <UpdateSpecsContainer
          itemSpecifications={itemSpecifications}
          handleItemDetails={handleItemDetails}
          setItemSpecifications={setItemSpecifications}
          size={size}
          currency={item.currency}
          image_0={item.image_0}
          newSpecification={newSpecification}
          handleRandomItemDetails={handleRandomItemDetails}
          newSpecificationArray={newSpecificationArray}
          handleNewSpecificationKey={handleNewSpecificationKey}
          handleNewSpecificationValue={handleNewSpecificationValue}
          noResult={props.noResult}
        />
        <TwoAjacentButtons
          leftBtnMessage={
            props.handleUpdateSubmit
              ? "Complete Update"
              : "Add To My Collection"
          }
          leftBtnClass={
            props.handleUpdateSubmit ? "update-item-btn" : "add-item-btn"
          }
          leftOnClick={() => {
            props.handleUpdateSubmit
              ? props.handleUpdateSubmit(
                  itemSpecifications,
                  newSpecification,
                  newSpecificationArray,
                  changeMade
                )
              : props.handleAddSubmit(
                  itemSpecifications,
                  newSpecification,
                  newSpecificationArray,
                  changeMade
                );
          }}
          rightBtnMessage={"Add Category"}
          rightBtnClass={"add-category-btn"}
          // button adds a new blank object onto array each time to add new
          // category / description inputs
          rightOnClick={() => {
            const newArray = newSpecificationArray.concat(blankObject);
            setNewSpecificationArray(newArray);
          }}
        />
      </div>
    </div>
  );
};

export default SingleItemUpdate;
