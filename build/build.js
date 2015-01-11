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

    var maps = {
        options: {
            center: {
                lat: 45.9961577,
              , lng: 25.6120277
            }
          , zoom: 7
          , type: "ROADMAP"
          , clustering: {
                options: {
                    maxZoom: 17
                  , gridSize: 120
                  , styles: [
                        {
                            height: 48
                          , url: "http://resources.jillix.net/res/maps/marker_cluster_blue_circle.png"
                          , width: 48
                          , textColor: "white"
                          , textSize: 18
                        }
                    ]
                }
            }
        }
      , markers: []
    };

    response.forEach(function (c) {
        if (JSON.stringify(c) === "{}") { return; }
        c.address = c.address || "";
        var street = (c.address.match(/(str\.)? ?(.*) ?\, Nr/i) || [])[2] || ""
          , cElm = {
                address: c.address
              , locality: c.locality
              , county: c.county
              , conference: {
                    name: null
                }
              , type: "church"
            }
          ;

        // Data
        data.push(cElm);
        maps.markers.push({
            title: cElm.locality
          , position: {
                lat: null
              , lng: null
            }
          , _: cElm
            // , infowin: {
            //       content: ""
            //   },
        });
    });

    Fs.writeFileSync(__dirname + "/../dist/churches.json", JSON.stringify(data, null, 4));
    Fs.writeFileSync(__dirname + "/../dist/maps.json", JSON.stringify(maps, null, 4));
});
