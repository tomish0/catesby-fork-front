import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { domain } from "../../../../../whichDomain/whichDomain";
import { currencyCodesToSymbols } from "../../../../../currencySymbols/currencySymbols";
import { addRoute } from "../singleItemSlice";
import SingleItemUpdate from "../Update/SingleItemUpdate";
import SingleItem from "../SingleItem";
import FilterResults from "../../FilterResults";
import { selectInventoryData } from "../../getInventorySlice";
import TwoAjacentButtons from "../../../../Button/TwoAjacentButtons";
import "../../../../../css/SingleItemAdd.css";

const SingleItemAdd = (props) => {
  const {
    handleAddSubmit,
    noTitleSize,
    setNoTitleSize,
    item,
    setItem,
    emptyItem,
  } = props;

  const dispatch = useDispatch(); // react-redux

  const inventoryData = useSelector(selectInventoryData);

  const [update, setUpdate] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [position, setPosition] = useState(0);

  // handles the search input
  const searchCatalogue = async (event) => {
    window.scrollTo(0, 0);
    setNoTitleSize(false);
    const string = event.target.value;
    // send the search input to the database to pull the results from both catalogue tables
    var searchResults = "";
    if (string.length > 1) {
      await axios.get(`${domain}/catalogue/search/${string}`).then((data) => {
        searchResults = data.data.data;
      });
    }
    // handle undefined results - occurs when you delete all characters in the input
    if (searchResults) {
      // check we have results received from the database
      if (searchResults.known.length > 0 || searchResults.unknown.length > 0) {
        // change the id of each result to whether known or unknown
        // & extract all the name/value specifications of each item & add the parent object
        // change the currency code into symbol
        searchResults.known.forEach((item) => {
          item.catalogueKnownId = item.id;
          delete item.id;
          delete item.user_id;
          item.specifications.forEach((spec) => {
            item[spec.name] = spec.value;
          });
          delete item.specifications;
          item.currency = currencyCodesToSymbols[item.currency]
            ? currencyCodesToSymbols[item.currency]
            : item.currency;
        });
        searchResults.unknown.forEach((item) => {
          item.catalogueUnknownId = item.id;
          delete item.id;
          delete item.user_id;
          item.specifications.forEach((spec) => {
            item[spec.name] = spec.value;
          });
          delete item.specifications;
          item.currency = currencyCodesToSymbols[item.currency]
            ? currencyCodesToSymbols[item.currency]
            : item.currency;
        });
        // Find catalogue unknown duplicates using for loop and remove from unknown array
        // duplicates if the title & size match
        let uniqueList = [];
        let duplicateList = [];
        function checkUnique(item, i) {
          if (uniqueList.includes(item)) {
            if (duplicateList.indexOf(item) === -1) {
              duplicateList.push(item);
            }
          } else {
            if (uniqueList.indexOf(item) === -1) {
              uniqueList.push(item);
            }
          }
        }
        for (let i = 0; i < searchResults.unknown.length; i++) {
          let titleSizeConcat =
            searchResults.unknown[i].title +
            searchResults.unknown[i].size +
            searchResults.unknown[i].size_unit;
          checkUnique(titleSizeConcat, i);
        }
        var uniqueUnknownArray = [];
        uniqueList.forEach((item) => {
          var index = searchResults.unknown.findIndex(
            (i) => item === i.title + i.size + i.size_unit
          );
          uniqueUnknownArray.push(searchResults.unknown[index]);
        });
        // concat both arrays into one
        var fullArray = [...searchResults.known, ...uniqueUnknownArray];
        // remove catalogue known items from all results if there is a catalogue known
        // with the same title & size as a catalogue unknown
        // avoids having duplicates shown
        let unique_list = [];
        let duplicate_list = [];
        function check_unique(item, i) {
          if (unique_list.includes(item)) {
            if (duplicate_list.indexOf(item) === -1) {
              duplicate_list.push(item);
            }
          } else {
            if (unique_list.indexOf(item) === -1) {
              unique_list.push(item);
            }
          }
        }
        for (let i = 0; i < fullArray.length; i++) {
          let titleSizeConcat =
            fullArray[i].title + fullArray[i].size + fullArray[i].size_unit;
          check_unique(titleSizeConcat, i);
        }
        for (let i = fullArray.length - 1; i >= 0; i--) {
          if (
            duplicate_list.find(
              (dup) =>
                dup ===
                fullArray[i].title + fullArray[i].size + fullArray[i].size_unit
            ) &&
            fullArray[i].catalogueKnownId
          ) {
            fullArray.splice(i, 1);
          }
        }
        // put the array in the state to send to FilteredItems
        setFilteredItems(fullArray);
        setNoResult(false);
        var element = document.querySelector(".add-filter-results");
        var rect = element.getBoundingClientRect();
        setPosition(rect.bottom);
      } else {
        setUpdate(true);
        setItem(emptyItem);
        setFilteredItems([]);
        setNoResult(true);
      }
    } else {
      setItem(emptyItem);
      setFilteredItems([]);
      setNoResult(false);
    }
  };

  const [inventoryItem, setInventoryItem] = useState(false);

  const handleItemSelect = (result) => {
    // add the item to state to be sent into both single item & update components
    result.quantity = 1;
    result.location = "";
    var inventoryKnownIds = [];
    var inventoryUnknownIds = [];
    inventoryData.forEach((item) => {
      if (item.catalogueKnownId) {
        inventoryKnownIds.push(item.catalogueKnownId);
      } else {
        inventoryUnknownIds.push(item.catalogueUnknownId);
      }
    });
    if (result.catalogueUnknownId) {
      inventoryUnknownIds.find((id) => id === result.catalogueUnknownId)
        ? setInventoryItem(true)
        : setInventoryItem(false);
    } else {
      inventoryKnownIds.find((id) => id === result.catalogueKnownId)
        ? setInventoryItem(true)
        : setInventoryItem(false);
    }
    setItem(result);
    setUpdate(false);
    window.scrollTo({ left: 0, top: position, behavior: "smooth" });
  };

  return (
    <div className="single-item-add">
      <button className="back-btn" onClick={() => dispatch(addRoute(false))}>
        <FontAwesomeIcon icon={faChevronLeft} className="icon" />
        &nbsp;Back
      </button>
      <input
        onChange={searchCatalogue}
        type="text"
        placeholder="Find Your New Item"
        className="search-input"
      />
      <div className="add-filter-results">
        {filteredItems.length > 0 ? (
          <FilterResults
            data={filteredItems}
            itemAdd={true}
            handleItemSelect={handleItemSelect}
          />
        ) : null}
      </div>
      {item.title.length > 0 ? (
        !update ? (
          <div>
            {inventoryItem ? (
              <div className="add-message">Already in your Collection</div>
            ) : null}
            <SingleItem item={item} itemSpecifications={item} />
            {!inventoryItem ? (
              <TwoAjacentButtons
                leftBtnMessage={"Add To My Collection"}
                leftBtnClass={"add-item-btn"}
                leftOnClick={() => handleAddSubmit(item, null, [])}
                rightBtnMessage={"Update"}
                rightBtnClass={"update-item-btn"}
                rightOnClick={() => {
                  setUpdate(true);
                  window.scrollTo(0, position);
                }}
              />
            ) : null}
          </div>
        ) : (
          <SingleItemUpdate item={item} handleAddSubmit={handleAddSubmit} />
        )
      ) : null}
      {noTitleSize ? (
        <div className="add-message">
          Make sure to fill in the Highlighted Fields
        </div>
      ) : null}
      {noResult ? (
        <SingleItemUpdate
          item={item}
          noResult={noResult}
          handleAddSubmit={handleAddSubmit}
        />
      ) : null}
    </div>
  );
};

export default SingleItemAdd;
