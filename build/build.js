// Dependencies
var CsvToArray = require("csv-to-array")
  , Fs = require("fs")
  ;

CsvToArray({
    csvOptions: {
        delimiter: ";"
    }
  , file: __dirname + "/churches.csv"
  , columns: [
        "locality"
      , "address"
      , "county"
    ]
}, function (err, response) {
    var data = [];

    // {
    //     "address": {
    //         "locality": { "type": "string" }
    //       , "county":   { "type": "number" }
    //       , "street":   { "type": "string" }
    //       , "number":   { "type": "number" }
    //       , "zip":      { "type": "number" }
    //     }
    //   , "conference": {
    //         "name": { "type": "string" }
    //     }
    //   , "type":       { "type": "string" }
    // }

    response.forEach(function (c) {
        if (JSON.stringify(c) === "{}") { return; }
        c.address = c.address || "";
        var street = (c.address.match(/(str\.)? ?(.*) ?\, Nr/i) || [])[2] || "";
        data.push({
            address: c.address
          , locality: c.locality
          , county: c.county
          , conference: {
                name: null
            }
          , type: "church"
        });
    });


    Fs.writeFileSync(__dirname + "/../dist/churches.json", JSON.stringify(data, null, 4));
});
