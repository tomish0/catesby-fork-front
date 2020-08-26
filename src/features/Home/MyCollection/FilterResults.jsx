import React from "react";
import "../../../css/FilterResults.css";

const FilterResults = (props) => {
  return (
    <div>
      <table className="filter-results-table">
        <tbody>
          <tr>
            <th></th>
            <th>Vintage</th>
            {props.itemAdd ? <th>Region</th> : null}
            <th>Size</th>
            {!props.itemAdd ? <th>Quantity</th> : null}
            <th>Value</th>
          </tr>
          {props.data.map((result, index) => {
            return (
              <tr key={index}>
                <td
                  className="filter-result-title"
                  onClick={() => props.handleItemSelect(result)}
                >
                  {result.title}
                </td>
                <td>
                  {result.vintage
                    ? result.vintage
                    : result.age
                    ? `${result.age} YO`
                    : null}
                </td>
                {props.itemAdd ? (
                  <td>{result.region ? result.region : result.country}</td>
                ) : null}
                <td>{`${result.size}${result.size_unit}`}</td>
                {!props.itemAdd ? <td>{result.quantity}</td> : null}
                <td>
                  {result.price_range && result.currency
                    ? `${result.currency}${result.price_range}`
                    : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FilterResults;
