"use strict";

var Geolocation = module.exports = function(ncmb){

    Geolocation.prototype.ncmb = ncmb;

    function Geolocation(lat, lng) {
        var pos = Geolocation.validate(lat, lng) ||
                  (Array.isArray(lat) && lat.length === 2 && Geolocation.validate(lat[0], lat[1])) ||
                  (typeof lat === 'object' && Object.keys(lat).length === 2 && lat.latitude && lat.longitude && Geolocation.validate(lat.latitude, lat.longitude)) ||
                  {latitude:0, longitude:0};
        return pos;
    };

    Geolocation.validate = function(latitude, longitude) {
      if (typeof(latitude) === 'undefined' || latitude === null || typeof(longitude) === 'undefined' || longitude === null)
      {
        return false;
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
        Geolocation.validate(this.latitude, this.longitude);
        this.__type = 'GeoPoint';
        return this;
    };

    return Geolocation;
};
