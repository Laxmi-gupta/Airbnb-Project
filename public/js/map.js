// this public folder js file dont hv access to env files so we will pass through ejs files
  maptilersdk.config.apiKey = mapApi;
  const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element in which the SDK will render the map
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 14 // starting zoom
  });

// Add marker at the new location
new maptilersdk.Marker()
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new maptilersdk.Popup({offset: 25})
  .setHTML(`<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`))
  .addTo(map);
  

// map on specific location but this dont store in db
// maptilersdk.geocoding.forward(locationName).then(result => {
//   if (result && result.features && result.features.length > 0) {
//     const coords = result.features[0].geometry.coordinates;
//     console.log(result.features[0].geometry);
//     // Jump to the searched location
//     map.jumpTo({ center: coords, zoom: 16 });

//     // Add marker at the new location
//     new maptilersdk.Marker()
//       .setLngLat(coords)
//       .addTo(map);
//   } 
// });