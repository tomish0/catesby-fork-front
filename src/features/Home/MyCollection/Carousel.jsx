import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import { selectInventoryData } from "./getInventorySlice";
import { addSingleItem } from "./SingleItem/singleItemSlice";
import "pure-react-carousel/dist/react-carousel.es.css";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../../css/Carousel.css";

const Carousel = () => {
  const dispatch = useDispatch();

  const inventoryData = useSelector(selectInventoryData); // inventory data needed for the carousel

  // using pure-react-carousel package which comes with its own styles
  return (
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={125}
      totalSlides={inventoryData.length}
      className="carousel-container"
    >
      <Slider className="slider">
        {inventoryData.map((item, i) => {
          return (
            <Slide key={i} className="slide">
              {item.image_0 ? (
                <div
                  className="image-container"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(70, 70, 70, 0.8), rgba(200, 200, 200, 0.2)), url(https://api.spiritbunker.com/alcohol_images/${
                      item.image_0
                    }?${Math.round(Math.random() * 1000)})`,
                  }}
                >
                  <h3
                    className="title"
                    onClick={() =>
                      dispatch(
                        addSingleItem({
                          haveData: true,
                          updatedData: true,
                          result: item,
                          addRoute: false,
                        })
                      )
                    }
                  >
                    {item.title}
                  </h3>
                </div>
              ) : (
                <div
                  className="image-container"
                  style={{
                    backgroundImage: `linear-gradient(to right, rgba(50, 50, 50, 0.8), rgba(200, 200, 200, 0.2))`,
                  }}
                >
                  <h3
                    className="title"
                    onClick={() =>
                      dispatch(
                        addSingleItem({
                          haveData: true,
                          updatedData: true,
                          result: item,
                          addRoute: false,
                        })
                      )
                    }
                  >
                    {item.title}
                  </h3>
                </div>
              )}
            </Slide>
          );
        })}
      </Slider>
      <ButtonBack className="button-back">
        <FontAwesomeIcon icon={faCaretLeft} className="icon" />
      </ButtonBack>
      <ButtonNext className="button-next">
        <FontAwesomeIcon icon={faCaretRight} className="icon" />
      </ButtonNext>
    </CarouselProvider>
  );
};

export default Carousel;
