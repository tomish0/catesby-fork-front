// used to change currency code into relevant symbol
var currencyCodesToSymbols = {
  USD: "$", // US Dollar
  EUR: "\u20AC", // Euro
  GBP: "\u00A3", // British Pound Sterling
  JPY: "\u00A5", // Japanese Yen
  HKD: "HK$", // Hong Kong Dollar
};

var currencySymbolsToCodes = {
  $: "USD", // US Dollar
  "\u20AC": "EUR", // Euro
  "\u00A3": "GBP", // British Pound Sterling
  "\u00A5": "JPY", // Japanese Yen
  HK$: "HKD", // Hong Kong Dollar
};

var currencySymbolsArray = ["\u00A3", "$", "\u20AC", "\u00A5", "HK$"];

module.exports = { currencyCodesToSymbols, currencySymbolsToCodes, currencySymbolsArray };
