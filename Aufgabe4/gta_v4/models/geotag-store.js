// File origin: VS1LAB A3

//Module Importieren 
const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");
/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...

    //private Array #setOfGeotags speichert Geotags
    #setOfGeotags = [];
    idCounter = 0;

    generateNewID() {
        this.idCounter += 1;
        return this.idCounter;
    }

    examples(){
        let tagList = GeoTagExamples.tagList;
        for (let i = 0; i < (GeoTagExamples.tagList).length; i++) {
                var newId = this.generateNewID;
                this.addGeoTag(new GeoTag(tagList[i][0], tagList[i][1], tagList[i][2], tagList[i][3], newId));
        }
    }
    getArray(){
        return this.#setOfGeotags;
    }

    addGeoTag(GeoTag) {
        if (!this.#setOfGeotags.includes(GeoTag)) {
                this.#setOfGeotags.push(GeoTag);
        }
    }

    removeGeoTag(name) {
        for(let i = 0; i < this.#setOfGeotags.length; i++) {
            if(name === this.#setOfGeotags[i].name) {
                this.#setOfGeotags.splice(i, 1);
                break;
            }
        }
    }

    getGeoTagById(id) {
        for(let i = 0; i < this.#setOfGeotags.length; i++) {
            if(id === this.#setOfGeotags[i].id) {
                return this.#setOfGeotags[i];
            }
        }
    }
//alle Geotags in der Nähe eines gegebenen Standorts (Radius 1)
//(Ortsdaten) in der Umgebung eines bestimmten Punkts direkt abzurufen

    getNearbyGeoTags(tagLatitude, tagLongitude) {
        var radius = 1;
        var res = [];
        var x = tagLatitude;
        var y = tagLongitude;
        //'cur' Parameter der Funktion repräsentiert das aktuelle Element in Iteration .
        this.#setOfGeotags.forEach(function (cur) {
            var curX = cur.latitude - x;
            var curY = cur.longitude - y;
            var squareX = Math.pow(curX,2);
            var squareY = Math.pow(curY,2);
            var squareR = Math.pow(radius,2);
            if((squareX+squareY)<=squareR) //im Bereich Zentrum +- radius
            {
                res.push(cur);
            }
        });
        return res;
    }
//M typischerweise eine Suchfunktion, die zusätzlich zu einem geographischen Filter 
// auch weitere Suchkriterien berücksichtigt 

    searchNearbyGeoTags(searching, latitude, longitude) {
        let match;
        let geotags = this.getNearbyGeoTags(latitude, longitude)
        let nearbyGeoTags = [];
        let geoTagHash;
        let geoTagName;

        for (let i = 0; i < geotags.length; i++) {
            geoTagName = geotags[i].name;
            geoTagHash = geotags[i].hashtag;


            if(geoTagName.includes(searching) || geoTagHash.includes(searching)) {
                match = geotags[i];
                nearbyGeoTags.push(match);
            }
        }

        return nearbyGeoTags;
    }

}

module.exports = InMemoryGeoTagStore
