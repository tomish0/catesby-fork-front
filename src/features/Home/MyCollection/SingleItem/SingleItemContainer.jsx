import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteItem, updatedData, resetHaveData } from "./singleItemSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import SingleItem from "./SingleItem";
import UpdateContainer from "./Update/UpdateContainer";
import "../../../../css/SingleItemContainer.css";
import TwoAjacentButtons from "../../../Button/TwoAjacentButtons";

const SingleItemContainer = (props) => {
  // single product props received from either click in SearchInventory list
  // or after an update in SingleItemUpdate
  const item = props.item;

  const dispatch = useDispatch(); // react-redux method

  // used to render SingleItem or SingleItemUpdate
  const [updateClicked, setUpdateClicked] = useState(false);
  // used to handle click on delete to then show cancel or complete delete
  const [deleteClicked, setDeleteClicked] = useState(false);

  const quanityValue = parseInt(item.quantity); // numeric quantity to calculate estimate value
  const priceRangeValue = parseInt(item.price_range); // numeric price to calculate estimate value

  return (
    <div>
      {!updateClicked ? (
        <div className="single-item-container">
          {/* button used to go back to Carousel / SearchInventory, uses 
          redux state - haveData in singleItemSlice */}
          <button
            className="back-btn"
            onClick={() => dispatch(resetHaveData())}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="icon" />
            &nbsp;Back
          </button>
          <div className="single-item-position">
            <SingleItem item={item} />
          </div>
          {/* if there is a price range value then create estimated value by multiplying
          price range with quantity */}
          {item.price_range && item.quantity && item.quantity !== 1 ? (
            <div className="estimated-value-container">
              <div className="estimate-value">
                * Total Value:&nbsp;&nbsp;
                <span>
                  {item.currency}
                  {quanityValue * priceRangeValue}
                </span>
              </div>
              <div className="estimate">
                <div className="star-dash">* -</div>
                <div>
                  Estimate - quantity owned multiplied by the value
                </div>
              </div>
            </div>
          ) : null}
          {/* if delete button clicked then show sure / cancel, otherwise show
          update / delete */}
          {!deleteClicked ? (
            <TwoAjacentButtons
              leftBtnMessage={"Update"}
              leftBtnClass={"update-item-btn"}
              leftOnClick={() => {
                setUpdateClicked(true);
                dispatch(updatedData(false));
                window.scrollTo(0, 0);
              }}
              rightBtnMessage={"Delete"}
              rightBtnClass={"delete-item-btn"}
              rightOnClick={() => setDeleteClicked(true)}
            />
          ) : (
            <TwoAjacentButtons
              leftBtnMessage={"Sure?"}
              leftBtnClass={"confirm-delete-item-btn"}
              leftOnClick={() => dispatch(deleteItem(item.inventoryId))}
              rightBtnMessage={"Cancel"}
              rightBtnClass={"cancel-delete-item-btn"}
              rightOnClick={() => setDeleteClicked(false)}
            />
          )}
        </div>
      ) : (
        <UpdateContainer
          item={item} // product
          setUpdateClicked={setUpdateClicked} // to handle coming back to SingleItem after update
        />
      )}
    </div>
  );
};

export default SingleItemContainer;
