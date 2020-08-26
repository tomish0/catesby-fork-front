import React from "react";

const UpdateItemSpecs = (props) => {
  
  const capitalizeFirstLetter = (str) => {
    // function to capitalise the first letters & remove ' _ ' from the item keys
    str = str.replace(/_/, " ");
    str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(" ");
  };

  return (
    <div className="item-specifications">
      <div className="each-item-specification">
        <div className="each-item-specification-title">Vintage</div>
        <input
          type="number"
          name="vintage"
          className="each-item-specification-value update"
          value={props.itemSpecifications.vintage}
          onChange={props.handleItemDetails}
        />
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Age</div>
        <div className="sign-input-container">
          <span className="age-input">YO</span>
          <input
            type="number"
            name="age"
            className="each-item-specification-value update"
            value={props.itemSpecifications.age}
            onChange={props.handleItemDetails}
          />
        </div>
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Region</div>
        <input
          type="text"
          name="region"
          className="each-item-specification-value update"
          value={props.itemSpecifications.region}
          onChange={props.handleItemDetails}
        />
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Country</div>
        <input
          type="text"
          name="country"
          className="each-item-specification-value update"
          value={props.itemSpecifications.country}
          onChange={props.handleItemDetails}
        />
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Strength</div>
        <div className="sign-input-container">
          <span className="strength-input">%</span>
          <input
            type="number"
            name="strength"
            className="each-item-specification-value update"
            value={props.itemSpecifications.strength}
            onChange={props.handleItemDetails}
          />
        </div>
      </div>
      {/* map over the random key/values in unfreezePropObj to show them within
        the specifications -- use function to capitalise the first letters
        & remove ' _ ' from the key strings */}
      {props.newSpecification
        ? Object.keys(props.newSpecification).map((key, i) => {
            const uppercaseKey = capitalizeFirstLetter(key);
            return (
              <div className="each-item-specification" key={i}>
                <div className="each-item-specification-title">
                  {uppercaseKey}
                </div>
                <input
                  type="text"
                  name={key}
                  className="each-item-specification-value update"
                  value={props.newSpecification[key]}
                  onChange={(e) => props.handleRandomItemDetails(e, key)}
                />
              </div>
            );
          })
        : null}
      {/* map over the specification array of blankObjects to be filled 
        with the data typed into the relevant inputs - starts with a singular
        blank object, then is further filled after click on add category button */}
      {props.newSpecificationArray.map((item, index) => {
        return (
          <div className="each-item-specification" key={index}>
            <input
              type="text"
              id={`id-${index}-key`}
              name="key"
              placeholder={"category"}
              className="each-item-specification-title update"
              value={props.newSpecificationArray[index].key}
              onChange={(e) => props.handleNewSpecificationKey(e, index)}
            />
            <input
              type="text"
              id={`id-${index}-value`}
              name="value"
              placeholder={"description"}
              className="each-item-specification-value update"
              value={props.newSpecificationArray[index].value}
              onChange={(e) => props.handleNewSpecificationValue(e, index)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default UpdateItemSpecs;
