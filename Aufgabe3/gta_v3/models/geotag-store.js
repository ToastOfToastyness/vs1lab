// File origin: VS1LAB A3

const GeoTag = require("./geotag");

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
    #tagarray

    // TODO: ... your code here ...
    constructor(){
        this.#tagarray = [];
    }

    addGeoTag(name, longitude, latitude, hashtag){
        geoTag = new GeoTag(name,longitude,latitude,hashtag);
        this.#tagarray.push(geoTag);
    }

    removeGeoTag(name) {
        for( let i = 0; i < this.#tagarray.length ; i++ ) {
            if ( this.#tagarray[i].name == name) {
                this.#tagarray.splice(index, 1);
            }
        }
    }

    getNearbyGeoTags(location) {
        arraysNearby = [];
        let radius = 10;
        for( let i = 0; i < this.#tagarray.length ; i++ ) {
            let distance = Math.SQRT2(Math.pow(this.#tagarray[i].latitude - location.latitude,2) + Math.pow(this.#tagarray[i].longitude - location.longitude,2));
            if ( distance <= radius) {
                arraysNearby.push(this.#tagarray[i]);
            }
        }

        return arraysNearby;
    }

    searchNearbyGeoTags(keyword) {
        arraysNearby = this.getNearbyGeoTags;
        searchedTags = [];
        for( let i = 0; i < this.#tagarray.length ; i++ ) {
            currentArray = this.#tagarray[i];
            if (currentArray.name.includes(keyword) || currentArray.hashtag.includes(keyword)) {
                searchedTags.push(this.#tagarray[i]);
            }
        }

        return searchedTags;
    }

}

module.exports = InMemoryGeoTagStore
