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
    const mapManager = new MapManager();
    const mapImage = document.getElementById('mapView');
    const mapDescription = document.getElementById('resultMap');
    let dLat = document.getElementById('discovery_latitude').value;
    let dLong = document.getElementById('discovery_longitude').value;
    if(mapImage && mapDescription) {
            mapImage.remove();
            mapDescription.remove();
    }
    if (!dLat && !dLong) { 
        LocationHelper.findLocation(function (locationHelper) {
        const latitude = locationHelper.latitude;
        const longitude = locationHelper.longitude;


        document.getElementById('tagging_latitude').value = latitude;
        document.getElementById('tagging_longitude').value = longitude;


        document.getElementById('discovery_latitude').value = latitude;
        document.getElementById('discovery_longitude').value = longitude;

        
        const taglist_json = document.getElementById('map').getAttribute('data-tags');
        mapManager.initMap(latitude,longitude);
        mapManager.updateMarkers(latitude,longitude, JSON.parse(taglist_json));


        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
    })
    }
    else {
        const taglist_json = document.getElementById('map').getAttribute('data-tags');
        mapManager.initMap(dLat,dLong);
        mapManager.updateMarkers(dLat,dLong , JSON.parse(taglist_json));
    }
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", updateLocation);
