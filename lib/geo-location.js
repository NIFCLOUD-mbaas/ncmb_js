"use strict";

var Geolocation = module.exports = function(ncmb){

    Geolocation.prototype.ncmb = ncmb;

	function Geolocation(firstParameter, secondParameter) {

	    if ( firstParameter && firstParameter !== null && firstParameter.constructor == Array) {
	      Geolocation.validate(firstParameter[0], firstParameter[1]);
	      this.latitude = firstParameter[0];
	      this.longitude = firstParameter[1];
	    } else if (firstParameter && firstParameter !== null && typeof firstParameter === 'object') {
	      Geolocation.validate(firstParameter.latitude, firstParameter.longitude);
	      this.latitude = firstParameter.latitude;
	      this.longitude = firstParameter.longitude;
	    } else if ((!isNaN(firstParameter)) && (!isNaN(secondParameter))) {
	      Geolocation.validate(firstParameter, secondParameter);
	      this.latitude = firstParameter;
	      this.longitude = secondParameter;
	    } else {
	      this.latitude = 0;
	      this.longitude = 0;
	    }
	};

    Geolocation.validate = function(latitude, longitude) {
	    if (latitude < -90.0) {
	      throw "NCMB.GeoPoint latitude " + latitude + " < -90.0.";
	    }
	    if (latitude > 90.0) {
	      throw "NCMB.GeoPoint latitude " + latitude + " > 90.0.";
	    }
	    if (longitude < -180.0) {
	      throw "NCMB.GeoPoint longitude " + longitude + " < -180.0.";
	    }
	    if (longitude > 180.0) {
	      throw "NCMB.GeoPoint longitude " + longitude + " > 180.0.";
	    }
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
