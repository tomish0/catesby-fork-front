import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectInventoryData } from "./getInventorySlice";
import Button from "../../Button/Button";
import "../../../css/SearchInventory.css";
import "../../../css/FilterResults.css";
import { addSingleItem } from "./SingleItem/singleItemSlice";
import FilterResults from "./FilterResults";

const SearchInventory = () => {
  const dispatch = useDispatch(); // react-redux method
  // all inventory for the given user retrieved in getInventorySlice on load of MyCollecton comp
  const inventoryData = useSelector(selectInventoryData);

  const [filteredData, setFilteredData] = useState([]); // state for filtered results

  // handles the filtering of data when a search is made
  const filter = (e) => {
    let inputValue = e.target.value;
    // check if the search has length or else set filtered items to empty array
    if (inputValue.length !== 0) {
      // reset filteredData to empty before filtering again so have fresh results, not results on top of previous
      setFilteredData([]);
      const searchableData = []; // empty array to put reduced data that is filtered upon into
      // for each of the inventory items return a new smaller object
      inventoryData.forEach((item) => {
        const removeKeys = {
          age: item.age,
          bottler: item.bottler,
          country: item.country,
          distillery: item.distillery,
          title: item.title,
          region: item.region,
          series: item.series,
          vintage: item.vintage,
        };
        const allValues = Object.values(removeKeys); // ignore the keys & put all the values of the object into an array
        // remove all undefined / null values from array
        const filteredValues = allValues.filter((i) => {
          return !!i;
        });
        searchableData.push(filteredValues); // push the array of values into searchableData array
      });
      var mergedArrays = [].concat.apply([], searchableData); // merge the arrays in searchableData into a single array of values
      // filter through the array of values to see if the search value matches any
      const filteredInventoryResults = mergedArrays.filter((i) => {
        return i.toLowerCase().includes(inputValue.toLowerCase());
      });
      // if filteredInventoryResults length is greater than 0 meaning there are 1 or more positive value matches
      if (filteredInventoryResults.length > 0) {
        // then for each of the arrays in searchable data filter to see if they include the filtered values
        searchableData.forEach((item, index) => {
          var findMatch = item.filter((element) =>
            filteredInventoryResults.includes(element)
          );
          // if there is a match for that array (findMatch.length > 0) then add the corresponding inventory object to the state
          // since the index of each of the searchable data arrays will match the index of each of the inventoryData objects
          // we can use the index here to put the correct matching object into the state
          if (findMatch.length > 0) {
            setFilteredData((filteredData) => [
              ...filteredData,
              inventoryData[index],
            ]);
          }
        });
      } else {
        // if the filter reveals no matchs then put no match into the state
        setFilteredData(["No Match"]);
      }
    } else {
      setFilteredData([]);
    }
  };

  const handleItemSelect = (result) => {
    const item = {
      haveData: true,
      result: result,
    };
    dispatch(addSingleItem(item));
  };

  return (
    <div className="my-collection-search">
      <input
        type="text"
        placeholder="Search Your Collection"
        onChange={filter}
        className="search-input"
      />
      {/* if there is filteredData upon a successful search then show the map out the results into a table*/}
      {filteredData.length > 0 && filteredData[0] !== "No Match" ? (
        <FilterResults
          handleItemSelect={handleItemSelect}
          data={filteredData}
        />
      ) : // else there is filteredData but upon a failed search so show No Match message
      filteredData.length > 0 && filteredData[0] === "No Match" ? (
        <div className="search-no-match">No Match</div>
      ) : (
        // otherwise there is no filteredData so show the table with all the inventory data
        <FilterResults
          handleItemSelect={handleItemSelect}
          data={inventoryData}
        />
      )}
    </div>
  );
};

export default SearchInventory;
