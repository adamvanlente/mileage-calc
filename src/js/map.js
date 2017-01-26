module.exports = {

  // Create a map element using Google's API.
  createMap: function (self) {
    if (self.map) return
    self.map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 3,
      center: {lat: 0, lng: -180},
      mapTypeId: 'terrain'
    })
  },

  // Set map element and draw a polyline.
  setPolylineToMap: function (self) {
    // Get coords from Airports.
    var orig = self.originAirport
    var dest = self.destinationAirport
    var lat1 = Number(orig.lat)
    var lon1 = Number(orig.lon)
    var lat2 = Number(dest.lat)
    var lon2 = Number(dest.lon)
    var coords = this.getPolylineCoords(lat1, lon1, lat2, lon2)

    // Remove existing polyline.
    this.removeExistingPolyline(self)

    // Create new polyline.
    self.polyline = this.createPolyline(coords)

    // Set the polyline to the map.
    self.polyline.setMap(self.map)

    // Center the map based on where the polyline is.
    this.resetCenterWithPolyline(lat1, lon1, lat2, lon2, self)
  },

  // Get coordinate array for the polyline.
  getPolylineCoords: function (lat1, lon1, lat2, lon2) {
    return [{ lat: lat1, lng: lon1 },
            { lat: lat2, lng: lon2 }]
  },

  // Remove a previous polyline if it exists.
  removeExistingPolyline: function (self) {
    if (self.polyline) self.polyline.setMap(null)
  },

  // Create the Google Maps polyline object.
  createPolyline: function (coords) {
    return new window.google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    })
  },

  // Reset the center of the Map canvas give a set of coords.
  resetCenterWithPolyline: function (lat1, lon1, lat2, lon2, self) {
    var centerLat = (lat1 + lat2) / 2
    var centerLon = (lon1 + lon2) / 2
    var centerCoord = new window.google.maps.LatLng(centerLat, centerLon)
    self.map.setOptions({
      center: centerCoord
    })
  }
}
