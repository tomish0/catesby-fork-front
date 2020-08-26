import React from 'react';
import UpdateTopSpecs from "./UpdateTopSpecs";
import UpdatePrimeSpecs from "./UpdatePrimeSpecs";
import UpdateItemSpecs from "./UpdateItemSpecs";

const UpdateSpecsContainer = (props) => {
    return (
        <div>
            {/* UpdateTopSpecs = title, img & description specifications */}
          <UpdateTopSpecs
            itemSpecifications={props.itemSpecifications}
            setItemSpecifications={props.setItemSpecifications}
            handleItemDetails={props.handleItemDetails}
            image_0={props.image_0}
            noResult={props.noResult}
          /> 
          {/* UpdatePrimeSpecs = quantity, size, location, price range specifications */}
          <UpdatePrimeSpecs
            itemSpecifications={props.itemSpecifications}
            handleItemDetails={props.handleItemDetails}
            size={props.size}
            currency={props.currency}
            noResult={props.noResult}
          />
          {/* UpdateItemSpecs includes - hard coded specifications eg strength
          - specifications that are dynamically rendered 
          - new key value input pairs to be filled in by the user */}
          <UpdateItemSpecs
            itemSpecifications={props.itemSpecifications}
            handleItemDetails={props.handleItemDetails}
            newSpecification={props.newSpecification}
            handleRandomItemDetails={props.handleRandomItemDetails}
            newSpecificationArray={props.newSpecificationArray}
            handleNewSpecificationKey={props.handleNewSpecificationKey}
            handleNewSpecificationValue={props.handleNewSpecificationValue}
          />
        </div>
    );
}

export default UpdateSpecsContainer;