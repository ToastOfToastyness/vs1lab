// File origin: VS1LAB A3, A4

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
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');
const GeoTagExamples = require('../models/geotag-examples');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
var GeoTagStoreObject = new GeoTagStore();
GeoTagStoreObject.examples(); //Lade die GeoTag-Beispiele in unser Array


// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

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
  
  var newId = GeoTagStoreObject.generateNewID();
  GeoTagStoreObject.addGeoTag(new GeoTag(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag, newId));
  //wird aufgerufen, um GeoTags in der Nähe der angegebenen Koordinaten zu erhalten.
  let nearbyGT = GeoTagStoreObject.getNearbyGeoTags(req.body.latitude, req.body.longitude);
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
  let searching = GeoTagStoreObject.searchNearbyGeoTags(searchTerm, req.body.hiddenLatitude, req.body.hiddenLongitude);
  res.render("index", {  //rendert die EJS-Datei 'index', die eine Vorlage für die Benutzeroberfläche darstellt.
    //Daten, die an die EJS-Vorlage übergeben werden, um sie dynamisch zu rendern
    taglist: searching,
    latvalue: req.body.hiddenLatitude,
    longvalue: req.body.hiddenLongitude,
    mapGeoTagList: JSON.stringify(searching)
  });   
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...
router.get('/api/geotags', function(req,res) {
  const { searchTerm, latitude, longitude } = req.query;
  const searching = GeoTagStoreObject.searchNearbyGeoTags(searchTerm, latitude, longitude);
  res.json(searching);
})


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', function(req,res) {
  
  const { name, latitude, longitude, hashtag } = req.body;
  var id = GeoTagStoreObject.generateNewID();
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag, id)
  GeoTagStoreObject.addGeoTag(newGeoTag);


  res
    .status(201)
    .location(`/api/geotags/${newGeoTag.id}`) // e.g. URL to fetch this specific tag
    .json(newGeoTag);
})

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', function(req,res) {
  const tagId = req.params.id;
  const geoTag = GeoTagStoreObject.getGeoTagById(tagId)
  res.json(geoTag);
  
})

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id', function(req,res) {
  const tagId = req.params.id;
  const { name, latitude, longitude, hashtag } = req.body;

  const existingTag = GeoTagStoreObject.getGeoTagById(id);
  GeoTagStoreObject.removeGeoTag(existingTag.name);
  const newGeoTag = new GeoTag(name, latitude, longitude, hashtag, id);

  GeoTagStoreObject.addGeoTag(newGeoTag);

  res.json(updatedTag);
})

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', function(req,res) {
  const tagId = req.params.id;
  const geoTag = GeoTagStoreObject.getGeoTagById(tagId);
  const name = geoTag.name;
  GeoTagStoreObject.removeGeoTag(name);
  res.json(geoTag);
})

module.exports = router;
