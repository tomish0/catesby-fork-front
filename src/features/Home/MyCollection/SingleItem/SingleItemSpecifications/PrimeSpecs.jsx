import React from "react";

const PrimeSpecs = (props) => {
  const item = props.item;
  const size = item.size + item.size_unit;
  const priceWithCurrency = item.currency + item.price_range;
  return (
    <div className="prime-specifications">
      <div className="each-item-specification">
        <div className="each-item-specification-title">Quantity</div>
        <div className="each-item-specification-value">
          {item.quantity}
        </div>
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Size</div>
        <div className="each-item-specification-value">{size}</div>
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Location</div>
        <div className="each-item-specification-value">
          {item.location}
        </div>
      </div>
      <div className="each-item-specification">
        <div className="each-item-specification-title">Value</div>
        <div className="each-item-specification-value">
          {item.price_range && item.currency
            ? priceWithCurrency
            : null}
        </div>
      </div>
    </div>
  );
};

export default PrimeSpecs;
