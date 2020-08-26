// Recall all Inventory Entries from the Inventory - GET /inventory & Recall an Inventory Entry from the Inventory - GET /inventory/[ID]

var payload = null;

// Remove an Inventory Entry from Inventory - DELETE /inventory/[ID]

var payload = null;

//Add an Inventory Entry to the Inventory - POST /inventory

var parloadInventory = {
  catalogueId: 1,
  quantity: 2,
  location: "hull",
  information: "really nice"
};

//Add a Product to the Catalogue - POST /catalogue

var payloadCatalogue = {
  title: "whiskey",
  description: "very nice whiskey",
  user_id: 1,
  catalogueSpecification: [{ alcoholContent: 99 }, { height: 20 }]
};

//Remove a Product from the Catalogue - DELETE /catalogue/[ID]

var payload = null;

//Recall all Products from the Catalogue - GET /catalogue & Recall a Product from the Catalogue - GET /catalogue/[ID]

var payload = null;

//Edit Catalogue Product - PUT /catalogue/[ID]

var payloadCatalogueEdit = {
  catalogueId: 1,
  title: "whiskey",
  description: "very nice whiskey",
  catalogueSpecification: [{ alcoholContent: 99 }, { height: 20 }]
};

// Add a User  - POST /user

var payloadUser = {
  name: "colin",
  email: "colin@colin.com",
  password: "iamcolin",
  phoneNumber: "0857485737535"
};

//Remove a User - DELETE /user

var payload = null;

//Edit User - PUT /user

var payloadUser = {
  name: "colin",
  email: "colin@colin.com",
  password: "iamcolin",
  phoneNumber: "0857485737535"
};

//Recall a user - GET /user

var payload = null;

//Add a Contact - POST /user/contact

var payloadContact = {
  line1: "10",
  line2: "Downing Street",
  line3: "London",
  postcode: "N1 4PP",
  city: "London",
  county: "London",
  country: "UK",
  contactName: "Uncle Boris",
  email: "bj@gov.uk",
  contactNumber: +447788888888,
  deliveryMessage: "Get Brexit Done"
};

//Remove a Contact - DELETE /user/contact/[ID]

var payload = null;

//Recall all Contacts - GET /user/contact

var payload = null;

//Add a preference - POST /user/preference

var payloadPreference = {
  emailUpdates: true,
  uiStyle: 1
};

//Remove a preference - DELETE /user/preference

var payload = null;

//recall Preferences - GET /user/preference

var payload = null;

//Edit Preference - PUT /user/preference

var payload = {
  preferenceId: 1,
  emailUpdates: true,
  uiStyle: 1
};
