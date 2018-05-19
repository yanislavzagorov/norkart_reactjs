
//Initializing the map
function setMap() {
      console.log('Loading map');
      mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGlsZG8iLCJhIjoiY2lrdHZvMHdsMDAxMHdvbTR0MWZkY3FtaCJ9.u4bFYLBtEGNv4Qaa8Uaqzw';
      var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
            center: [10.74812, 59.92145], // starting position [lng, lat]
            zoom: 14 // starting zoom. Zoomlevel is from 0 -> 22, where 22 is zoomed in an 0 is zoomed out
      });

      map.addControl(new mapboxgl.NavigationControl());

      var paint = {
            'circle-radius': 8,
            'circle-color': 'red',
            'circle-opacity': 0.5
      };

      var paint2 = {
            'fill-color': 'yellow',
            'fill-opacity': 0.5
      };

      map.on('load', function(){
            map.addLayer(createMapboxLayer('utesteder', 'circle', osloUtesteder, paint));

      });
      map.on("click", "utesteder", function (event) {
            var content = event.features[0].properties.name;
            var coordinates = event.features[0].geometry.coordinates.slice();
            new mapboxgl.Popup().setLngLat(coordinates).setHTML(content).addTo(map);
      });

      map.on("click", function (event){
        if(map.getLayer('buffered')){
          console.log("Finnes!");
          map.removeLayer('buffered');
          map.removeSource('buffered');
        } else{
          console.log("Finnes ikke!");
        }

          console.log(event);
          map.addLayer(createMapboxLayer('buffered', 'fill', createPolygon(event.lngLat), paint2));
          var ptsWithin = turf.pointsWithinPolygon('utesteder', map.getLayer('buffered').geometry('createPolygon'));
          console.log(ptsWithin);
      });

      // Add geolocate control to the map.
      map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true
          },
          trackUserLocation: true
      }));
}

function createMapboxLayer(id, type, geojson, paint = false) {
      var layer =  {
            'id': id,
            'type': type,
            'source': {
                  'type': 'geojson',
                  'data': geojson
            },
            'paint': (paint) ? paint : {}
            }

      return layer;
};

function createPolygon(lngLat) {
    var point = turf.point(lngLat.toArray());
    var buffered = turf.buffer(point, 300, {units: 'meters'});
    return buffered;
};



window.onload = setMap;
