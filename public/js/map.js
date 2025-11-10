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
