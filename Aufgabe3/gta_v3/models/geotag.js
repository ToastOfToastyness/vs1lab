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
    /**
     * 
     * @param {string} name - The name of the geotag.
     * @param {number} latitude - The latitude of the geotag.
     * @param {number} longitude - The longitude of the geotag.
     * @param {string} hashtag - The hashtag of the geotag.
     */

    constructor(name, latitude, longitude, hashtag) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hashtag = hashtag;
    }

    /**
     * 
     * @returns {string} - The name of the geotag.
     */
    getName() {
        return this.name;
    }

    /**
     * 
     * @param {string} name - The new name of the geotag.
    */
    setName(name) {
        this.name = name;
    }

    /**
     * 
     * @returns {number} - The latitude of the geotag.
     */
    getLatitude() {
        return this.latitude;
    }

    /**
     * @param {number} latitude - The new latitude of the geotag.
    */
    setLatitude(latitude) {
        this.latitude = latitude;
    }

    /**
     * 
     * @returns {number} - The longitude of the geotag.
     */
    getLongitude() {
        return this.longitude;
    }

    /**
     * @param {number} longitude - The new longitude of the geotag.
    */
    setLongitude(longitude) {
        this.longitude = longitude;
    }

    /**
     * 
     * @returns {string} - The hashtag of the geotag.
     */
    getHashtag() {
        return this.hashtag;
    }

    /**
     * @param {string} hashtag - The new hashtag of the geotag.
    */
    setHashtag(hashtag) {
        this.hashtag = hashtag;
    }

    /**
     * 
     * @returns {string} - A string representation of the geotag.
     */
    toString() {
        return `${this.name} (${this.latitude}, ${this.longitude}) #${this.hashtag}`;
    }

    /**
     * 
     * @returns {object} - A JSON representation of the geotag.
     */
    //um sie über eine API zu senden oder von einer API zu empfangen.
    //Geotags in ein speicherbares Format konvertieren
    toJSON() {
        return {
            name: this.name,
            latitude: this.latitude,
            longitude: this.longitude,
            hashtag: this.hashtag
        };
    }

    /**
     * 
     * @param {object} json - A JSON representation of the geotag.
     * @returns {GeoTag} - A new GeoTag object.
     */
    static fromJSON(json) {
        return new GeoTag(json.name, json.latitude, json.longitude, json.hashtag);
    }

}

module.exports = GeoTag;
