"use strict";

var Geolocation = module.exports = function(ncmb){

    Geolocation.prototype.ncmb = ncmb;

	function Geolocation(firstParameter, secondParameter) {
        //if parameters have 2 elements
        if (secondParameter != null && Geolocation.validate(firstParameter, secondParameter)) {
          this.latitude = firstParameter;
	      this.longitude = secondParameter;
	      return;
        }
        //if firstParameter is Array
	    if (firstParameter && firstParameter !== null && Array.isArray(firstParameter) && firstParameter.length === 2 && Geolocation.validate(firstParameter[0], firstParameter[1])) {
	      this.latitude = firstParameter[0];
	      this.longitude = firstParameter[1];
	      return;
	    }
        //if firstParameter is Object
	    if (firstParameter && firstParameter !== null && typeof firstParameter === 'object' && Object.keys(firstParameter).length === 2 && firstParameter.latitude && firstParameter.longitude && Geolocation.validate(firstParameter.latitude, firstParameter.longitude)) {
	      this.latitude = firstParameter.latitude;
	      this.longitude = firstParameter.longitude;
	      return;
	    }
        //other cases
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

    Geolocation.prototype._toJSON = function() {
        Geolocation.validate(this.latitude, this.longitude);
        return {
	        "__type": "GeoPoint",
	        latitude: this.latitude,
	        longitude: this.longitude
	     };
    };

	return Geolocation;
};
