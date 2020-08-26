import React from "react";

const ItemSpecs = (props) => {
  const { item, unfreezePropObj } = props;

  const strength = `${item.strength}%`;
  const age = `${item.age} YO`;

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
      {item.vintage ? (
        <div className="each-item-specification">
          <div className="each-item-specification-title">Vintage</div>
          <div className="each-item-specification-value">{item.vintage}</div>
        </div>
      ) : null}
      {item.age ? (
        <div className="each-item-specification">
          <div className="each-item-specification-title">Age</div>
          <div className="each-item-specification-value">{age}</div>
        </div>
      ) : null}
      {item.region ? (
        <div className="each-item-specification">
          <div className="each-item-specification-title">Region</div>
          <div className="each-item-specification-value">{item.region}</div>
        </div>
      ) : null}
      {item.country ? (
        <div className="each-item-specification">
          <div className="each-item-specification-title">Country</div>
          <div className="each-item-specification-value">{item.country}</div>
        </div>
      ) : null}
      {item.strength ? (
        <div className="each-item-specification">
          <div className="each-item-specification-title">Strength</div>
          <div className="each-item-specification-value">{strength}</div>
        </div>
      ) : null}
      {/* map over the random key/values in unfreezePropObj to show them within
        the specifications -- use function to capitalise the first letters
        & remove ' _ ' from the key strings */}
      {Object.keys(unfreezePropObj).map((key, i) => {
        const uppercaseKey = capitalizeFirstLetter(key);
        return (
          <div className="each-item-specification" key={i}>
            <div className="each-item-specification-title">{uppercaseKey}</div>
            <div className="each-item-specification-value">
              {unfreezePropObj[key]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemSpecs;
