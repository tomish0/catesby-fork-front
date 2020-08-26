import React from "react";
import { currencySymbolsArray } from "../../../../../../currencySymbols/currencySymbols";

const UpdatePrimeSpecs = (props) => {
  const currencyArray = currencySymbolsArray;
  if (props.currency) {
    const correctCurrencyIndex = currencyArray.findIndex(
      (currency) => currency === props.currency
    );
    currencyArray.splice(correctCurrencyIndex, 1);
    currencyArray.unshift(props.currency);
  }

  const sizeUnitArray = ["cL", "L"];
  if (props.size_unit) {
    const correctSizeUnitIndex = sizeUnitArray.findIndex(
      (sizeUnit) => sizeUnit === props.size_unit
    );
    sizeUnitArray.splice(correctSizeUnitIndex, 1);
    sizeUnitArray.unshift(props.size_unit);
  }

  return (
    <div className="prime-specifications">
      <div className="each-item-specification">
        <div className="each-item-specification-title">Quantity</div>
        <input
          type="number"
          name="quantity"
          step="1"
          min="0"
          className="each-item-specification-value quantity-update update"
          value={props.itemSpecifications.quantity}
          onChange={props.handleItemDetails}
        />
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Size</div>
        {!props.noResult ? (
          <div className="each-item-specification-value">
            {props.size
              ? props.size
              : props.itemSpecifications.size +
                props.itemSpecifications.size_unit}
          </div>
        ) : (
          <div className="currency-size-sign-input-container">
            <input
              type="number"
              name="size"
              className="each-item-specification-value size-update update input-highlight"
              value={props.itemSpecifications.size}
              onChange={props.handleItemDetails}
            />
            <select onChange={props.handleItemDetails} name="currency">
              {sizeUnitArray.map((sizeUnit, index) => {
                return (
                  <option key={index} value={sizeUnit}>
                    {sizeUnit}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Location</div>
        <textarea
          type="text"
          name="location"
          className="each-item-specification-value update"
          value={props.itemSpecifications.location}
          onChange={props.handleItemDetails}
        />
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Value</div>
        <div className="currency-size-sign-input-container">
          <select onChange={props.handleItemDetails} name="currency">
            {currencyArray.map((currency, index) => {
              return (
                <option key={index} value={currency}>
                  {currency}
                </option>
              );
            })}
          </select>
          <input
            type="number"
            name="price_range"
            className="each-item-specification-value price-update update"
            value={props.itemSpecifications.price_range}
            onChange={props.handleItemDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdatePrimeSpecs;
