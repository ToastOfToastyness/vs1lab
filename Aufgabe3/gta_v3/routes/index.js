// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');
const GeoTagExamples = require('../models/geotag-examples');
/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
var GeoTagStoreObject = new GeoTagStore();
GeoTagStoreObject.examples(); //Lade die GeoTag-Beispiele in unser Array

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  res.render('index', { taglist:GeoTagStoreObject.getArray() , latvalue: "", longvalue: "", mapGeoTagList: 
    JSON.stringify(GeoTagStoreObject.getArray()) })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

//Route aufrufen, wenn das Formular für das Tagging (/tagging) mit POST-Daten gesendet wird
// TODO: ... your code here ...
router.post('/tagging',(req, res)=> {
  GeoTagStoreObject.addGeoTag(new GeoTag(req.body.name, req.body.tagLatitude, req.body.tagLongitude, req.body.taghashtag));
  //wird aufgerufen, um GeoTags in der Nähe der angegebenen Koordinaten zu erhalten.
  let nearbyGT = GeoTagStoreObject.getNearbyGeoTags(req.body.tagLatitude, req.body.tagLongitude);
    res.render("index", { //rendert die EJS-Datei 'index', die eine Vorlage für die Benutzeroberfläche darstellt.
      //Daten, die an die EJS-Vorlage übergeben werden, um sie dynamisch zu rendern:
      taglist: nearbyGT,
      latvalue: req.body.tagLatitude,
      longvalue: req.body.tagLongitude, 
      mapGeoTagList: JSON.stringify(nearbyGT)
    });   
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// TODO: ... your code here ...

//Diese Route aufrufen, wenn das Formular für (/discovery) mit POST-Daten gesendet wird.
router.post('/discovery',(req, res)=> {
  let searchTerm = req.body.searchbox; //Daten, die vom Client gesendet wurden, einschließlich searchbox
  //sucht nach GeoTags in der Nähe der angegebenen Koordinaten (hiddenLatitude und hiddenLongitude) und die das Suchwort (searchTerm) enthalten.
  let searching = GeoTagStoreObject.searchNearbyGeoTags(searchTerm);
  res.render("index", {  //rendert die EJS-Datei 'index', die eine Vorlage für die Benutzeroberfläche darstellt.
    //Daten, die an die EJS-Vorlage übergeben werden, um sie dynamisch zu rendern
    taglist: searching,
    latvalue: req.body.hiddenLatitude,
    longvalue: req.body.hiddenLongitude,
    mapGeoTagList: JSON.stringify(searching)
  });   
});

module.exports = router;
