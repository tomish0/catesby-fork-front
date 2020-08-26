import React, { useState } from "react";
import UseCamera from "../UseCamera/UseCamera";

const UseCameraRoute = (props) => {
  const [cameraOn, setCameraOn] = useState(false); // used to turn camera on/off

  return (
    <div>
      {/* if there is an original image then show in the div otherwise just show div */}
      {props.image_0 ? (
        // if the camera button is clicked then show the camera
        !cameraOn ? (
          <div
            className="img-update"
            style={{
              backgroundImage: `url(https://api.spiritbunker.com/alcohol_images/${props.image_0}?${Math.round(
                Math.random() * 1000
              )})`,
            }}
          >
            <div className="camera-click-container">
              <span onClick={() => setCameraOn(true)}>Change Photo</span>
            </div>
          </div>
        ) : (
          <UseCamera
            itemSpecifications={props.itemSpecifications}
            setItemSpecifications={props.setItemSpecifications}
            setCameraOn={setCameraOn}
            image_0={props.image_0}
          />
        )
      ) : !cameraOn ? (
        <div className="img-update">
          <div className="camera-click-container">
            <span onClick={() => setCameraOn(true)}>Add Photo</span>
          </div>
        </div>
      ) : (
        <UseCamera
          itemSpecifications={props.itemSpecifications}
          setItemSpecifications={props.setItemSpecifications}
          setCameraOn={setCameraOn}
        />
      )}
    </div>
  );
};

export default UseCameraRoute;
