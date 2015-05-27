"use strict";

var Geolocation = module.exports = function(ncmb){

    function Geolocation(lat, lng) {
      var pos = Geolocation.validate(lat, lng) ||
                (Array.isArray(lat) && Geolocation.validate(lat[0], lat[1])) ||
                (typeof lat === "object" && Geolocation.validate(lat.latitude, lat.longitude)) ||
                {latitude: 0, longitude: 0};

      this.latitude  = pos.latitude;
      this.longitude = pos.longitude;
    };

    Geolocation.validate = function(latitude, longitude) {
      if (
        typeof latitude  === "undefined" || latitude  === null ||
        typeof longitude === "undefined" || longitude === null
      ){
        return null;
      }
      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error("Geolocation latitude and longitude should be number");
      }
      if (latitude < -90.0) {
        throw new Error("Geolocation should not take latitude (" + latitude + ") < -90.0.");
      }
      if (latitude > 90.0) {
        throw new Error("Geolocation should not take latitude (" + latitude + ") > 90.0.");
      }
      if (longitude < -180.0) {
        throw new Error("Geolocation should not take longitude (" + longitude + ") < -180.0.");
      }
      if (longitude > 180.0) {
        throw new Error("Geolocation should not take longitude (" + longitude + ") > 180.0.");
      }
      return {latitude: latitude, longitude: longitude};
    };

    Geolocation.prototype.toJSON = function() {
      return {
        __type:    "Geolocation",
        latitude:  this.latitude,
        longitude: this.longitude
      };
    };

    return Geolocation;
};
