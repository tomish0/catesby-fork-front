import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInventoryData, selectInventoryData } from "./getInventorySlice";
import { selectSingleItem, addRoute } from "./SingleItem/singleItemSlice";
import Carousel from "./Carousel";
import Button from "../../Button/Button";
import SearchInventory from "./SearchInventory";
import SingleItemContainer from "./SingleItem/SingleItemContainer";
import SingleItemAddContainer from "./SingleItem/Add/SingleItemAddContainer";
import "../../../css/MyCollection.css";

const MyCollection = () => {
  const dispatch = useDispatch(); // react-redux method

  const inventoryData = useSelector(selectInventoryData);
  const singleItem = useSelector(selectSingleItem);

  // useEffect used to get all the inventoryData for the given user
  useEffect(() => {
    dispatch(getInventoryData());
  }, [dispatch]);

  return (
    <div className="my-collection-container">
      <h2>My Collection</h2>
      {singleItem.addRoute ? (
        <SingleItemAddContainer />
      ) : singleItem.haveData ? (
        <SingleItemContainer item={singleItem.result} />
      ) : (
        <div className="carousel-add-search-container">
          {inventoryData.length > 0 ? <Carousel /> : null}
          <div className={inventoryData.length > 0 ? "align-page-button" : 'center-page-button'}>
            <Button
              className="add-collection-btn"
              btnMessage="Add To My Collection"
              onClick={() => dispatch(addRoute(true))}
            />
          </div>
          {inventoryData.length > 0 ? <SearchInventory /> : null}
        </div>
      )}
    </div>
  );
};

export default MyCollection;
