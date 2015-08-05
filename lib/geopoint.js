"use strict";

var GeoPoint = module.exports = function(ncmb){

    function GeoPoint(lat, lng) {
      var pos = GeoPoint.validate(lat, lng) ||
                (Array.isArray(lat) && GeoPoint.validate(lat[0], lat[1])) ||
                (typeof lat === "object" && GeoPoint.validate(lat.latitude, lat.longitude)) ||
                {latitude: 0, longitude: 0};

      this.latitude  = pos.latitude;
      this.longitude = pos.longitude;
    };

    var className = GeoPoint.prototype.className = "/geopoint";

    GeoPoint.validate = function(latitude, longitude) {
      if (
        typeof latitude  === "undefined" || latitude  === null ||
        typeof longitude === "undefined" || longitude === null
      ){
        return null;
      }
      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error("GeoPoint latitude and longitude should be number");
      }
      if (latitude < -90.0) {
        throw new Error("GeoPoint should not take latitude (" + latitude + ") < -90.0.");
      }
      if (latitude > 90.0) {
        throw new Error("GeoPoint should not take latitude (" + latitude + ") > 90.0.");
      }
      if (longitude < -180.0) {
        throw new Error("GeoPoint should not take longitude (" + longitude + ") < -180.0.");
      }
      if (longitude > 180.0) {
        throw new Error("GeoPoint should not take longitude (" + longitude + ") > 180.0.");
      }
      return {latitude: latitude, longitude: longitude};
    };

    GeoPoint.prototype.toJSON = function() {
      return {
        __type:    "GeoPoint",
        latitude:  this.latitude,
        longitude: this.longitude
      };
    };

    return GeoPoint;
};
