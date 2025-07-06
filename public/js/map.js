mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: listing.geometry.coordinates, // [lng, lat]
  zoom: 9
});

const marker = new mapboxgl.Marker({ color: "black" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML("<p>Exact location will be provided after booking</p>")
  )
  .addTo(map);
