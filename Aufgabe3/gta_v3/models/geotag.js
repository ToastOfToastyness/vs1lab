// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    // TODO: ... your code here ...
    constructor(name, longitude, latitude, hashtag) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.name = name;
        this.hashtag = hashtag;
    }
}

module.exports = GeoTag;
