// this public folder js file dont hv access to env files so we will pass through ejs files
maptilersdk.config.apiKey = mapApi;
const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: [77.209, 28.6139], // starting position [lng, lat]
  zoom: 14 // starting zoom
});

// map on specific location
maptilersdk.geocoding.forward(locationName).then(result => {
  if (result && result.features && result.features.length > 0) {
    const coords = result.features[0].geometry.coordinates;

    // Fly to the searched location
    map.jumpTo({ center: coords, zoom: 16 });

    // Add marker at the new location
    new maptilersdk.Marker()
      .setLngLat(coords)
      .addTo(map);
  } 
})