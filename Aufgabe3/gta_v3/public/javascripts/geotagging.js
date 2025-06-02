// File origin: VS1LAB A2


/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation() {
    LocationHelper.findLocation(function (locationHelper) {
        const latitude = locationHelper.latitude;
        const longitude = locationHelper.longitude;


        document.getElementById('tagging_latitude').value = latitude;
        document.getElementById('tagging_longitude').value = longitude;


        document.getElementById('discovery_latitude').value = latitude;
        document.getElementById('discovery_longitude').value = longitude;

        const mapManager = new MapManager();
        
        const taglist_json = document.getElementById('map').getAttribute('data-tags');
        console.log(taglist_json);
        mapManager.initMap(latitude,longitude);
        mapManager.updateMarkers(latitude,longitude, JSON.parse(taglist_json));

        const mapImage = document.getElementById('mapView');
        const mapDescription = document.getElementById('resultMap');

        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
        if(mapImage && mapDescription) {
            mapImage.remove();
            mapDescription.remove();
        }
    })
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);
