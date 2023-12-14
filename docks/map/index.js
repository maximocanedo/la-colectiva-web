"use strict";
import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
(async () => {
    let mapOptions = {
        center: [
            -34.382347,
            -58.559766
        ],
        zoom: 15
    };
    let map = new L.map('map_fixed' , mapOptions);
    let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    map.addLayer(layer);
    map.setMinZoom(13);

    /*let marker = new L.Marker([
        -34.382347,
        -58.559766
    ]);
    marker.addTo(map);*/
    window.map = map;
    console.log(map);
   //
        const {lat, lng} = map.getCenter();
        const prefer = 1;
        const q = "";
        const query = `?lat=${lat}&lng=${lng}&radio=10000&prefer=${prefer}&q=${q}&p=0&itemsPerPage=200`;
        console.log(query);
        let source = await fetch("https://colectiva.com.ar:5050/docks/explore" + query, {
            method: "GET",
            credentials: "include"
        });
        if(source.ok) {
            let arr = await source.json();
            arr.map(dock => {
                let dockIcon = L.divIcon({className: "dock"});
                let mk = L.marker(dock.coordinates, { icon: dockIcon }).addTo(map);
                let el = mk.getElement();
                el.addEventListener("click", e => {
                    window.location = "/docks/dock?id=" + dock._id;
                })
                mk.bindPopup(dock.name).openPopup();
            })
        }

})();