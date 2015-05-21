"use strict";

var Geolocation = module.exports = function(ncmb){

    Geolocation.prototype.ncmb = ncmb;

    function Geolocation(lat, lng) {
        //if parameters have 2 elements
        if (lng != null && Geolocation.validate(lat, lng)) {
          this.latitude = lat;
          this.longitude = lng;
          return;
        }
        //if lat is Array
        if (lat && lat !== null && Array.isArray(lat) && lat.length === 2 && Geolocation.validate(lat[0], lat[1])) {
          this.latitude = lat[0];
          this.longitude = lat[1];
          return;
        }
        //if lat is Object
        if (lat && lat !== null && typeof lat === 'object' && Object.keys(lat).length === 2 && lat.latitude && lat.longitude && Geolocation.validate(lat.latitude, lat.longitude)) {
          this.latitude = lat.latitude;
          this.longitude = lat.longitude;
          return;
        }
        this.latitude = 0;
        this.longitude = 0;
        return;
    };

    Geolocation.validate = function(latitude, longitude) {
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
	    return true;
    };

    Geolocation.prototype.toJSON = function() {
        Geolocation.validate(this.latitude, this.longitude);
        return {
	        "__type": "GeoPoint",
	        latitude: this.latitude,
	        longitude: this.longitude
	     };
    };

	return Geolocation;
};
