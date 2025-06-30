// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


//Hilfsfunktion zum seite "neuladen"
function refreshDiscovery({searchTerm, latitude, longitude, page = 1, pageSize = 5 }) {
  // builds a query string using new URLSearchParams({...}), so your request URL becomes something like
  // /api/geotags?searchTerm=&latitude=49.0138&longitude=8.4044&page=1&pageSize=5
  const params = new URLSearchParams({
    searchTerm,
    latitude,
    longitude,
    page,
    pageSize
  });

  fetch(`/api/geotags?${params.toString()}`)
    .then(res => {
      if (!res.ok) throw new Error(`Fehler bei /api/geotags: ${res.status}`);
      return res.json();
    })
    .then(json => {
      // json hat shape: { page, pageSize, totalItems, totalPages, pageData: [ ... ] }
      const taglist = json.data;

      document.getElementById("name").value = '';
      document.getElementById("hashtag").value = '';

      const ul = document.getElementById("discoveryResults");

      ul.innerHTML = "";
      if (taglist.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No results to display.";
        ul.appendChild(li);
      } else {
        taglist.forEach(geoTag => {
          const li = document.createElement("li");
          li.textContent = `${geoTag.name} (${geoTag.latitude}, ${geoTag.longitude}) ${geoTag.hashtag}`;
          ul.appendChild(li);
        });
      }

      const pagDiv = document.querySelector(".pagination");
      pagDiv.innerHTML = ""; 

      if (json.page > 1) {
        const prev = document.createElement("a");
        prev.href = "#";
        prev.textContent = "« Previous";
        prev.addEventListener("click", e => {
          e.preventDefault();
          refreshDiscovery({searchTerm, latitude, longitude, page: json.page - 1, pageSize });
        });
        pagDiv.appendChild(prev);
      }

      const info = document.createElement("span");
      info.textContent = ` Page ${json.page} of ${json.totalPages} `;
      pagDiv.appendChild(info);

      if (json.page < json.totalPages) {
        const next = document.createElement("a");
        next.href = "#";
        next.textContent = "Next »";
        next.addEventListener("click", e => {
          e.preventDefault();
          refreshDiscovery({searchTerm, latitude, longitude, page: json.page + 1, pageSize });
        });
        pagDiv.appendChild(next);
      }

      //Karte aktualisieren: data-tags setzen + location updaten
      const mapContainer = document.getElementById("map");
      mapContainer.setAttribute("data-tags", JSON.stringify(taglist));
      updateLocation();
    })
    .catch(err => {
      console.error(err);
    });
}

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
    mapManager = new MapManager();

// ... your code here ...
function updateLocation() {

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

        const searchTerm = document.getElementById("search_keyword").value || "";
        refreshDiscovery({searchTerm, latitude: latitude, longitude: longitude, page: 1, pageSize: 5 });


        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);
    })
    }
    else {
        const taglist_json = document.getElementById('map').getAttribute('data-tags');
        mapManager.updateMarkers(dLat,dLong , JSON.parse(taglist_json));
        const searchTerm = document.getElementById("search_keyword").value || "";
    }
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
  updateLocation();

  // “Tagging” form: "normalen" submit unterbrechen  → AJAX POST to /api/geotags
  const tagForm = document.getElementById("tag-form");
  tagForm.addEventListener("submit", event => {
    // abesenden/ neuladen verhindern 
    event.preventDefault();
    
    const name     = document.getElementById("name").value;
    const hashtag  = document.getElementById("hashtag").value;
    const latitude = document.getElementById("tagging_latitude").value;
    const longitude= document.getElementById("tagging_longitude").value;

    fetch('/api/geotags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, latitude, longitude, hashtag })
    })
      // ist die erstellung erfolgreich, so werden textfelder geleert und karte geupdatet/pagination geht auf default
      .then(res => {
        if (!res.ok) throw new Error(`Fehler beim Erstellen: ${res.status}`);
        return res.json();
      })
      .then(newTag => {
        const lat = document.getElementById("tagging_latitude").value;
        const lon = document.getElementById("tagging_longitude").value;
        const searchTerm = document.getElementById("search_keyword").value || "";
        refreshDiscovery({searchTerm, latitude: lat, longitude: lon, page: 1, pageSize: 5 });
      })
      .catch(err => console.error(err));
  });

  // “Discovery” form: "normalen" submit unterbrechen  → AJAX GET to /api/geotags
  const disForm = document.getElementById("discoveryFilterForm");
  disForm.addEventListener("submit", event => {
    event.preventDefault();

    const searchTerm = document.getElementById("search_keyword").value || "";
    const lat = document.getElementById("discovery_latitude").value;
    const lon = document.getElementById("discovery_longitude").value;

    // seite "neuladen" mit suchbegriff ergebnissen 
    refreshDiscovery({searchTerm, latitude: lat, longitude: lon, page: 1, pageSize: 5 });
  });
});
