"use strict";

var Geolocation = module.exports = function(ncmb){

    Geolocation.prototype.ncmb = ncmb;

	function Geolocation(arg1, arg2) {
		console.log("in constructor" + arg1 + "|" + arg2);
	    if ( arg1 && arg1 !== null && arg1.constructor == Array) {
	      Geolocation._validate(arg1[0], arg1[1]);
	      this.latitude = arg1[0];
	      this.longitude = arg1[1];
	    } else if (arg1 && arg1 !== null && typeof arg1 === 'object') {
	      Geolocation._validate(arg1.latitude, arg1.longitude);
	      this.latitude = arg1.latitude;
	      this.longitude = arg1.longitude;
	    } else if ((!isNaN(arg1)) && (!isNaN(arg2))) {
	      Geolocation._validate(arg1, arg2);
	      this.latitude = arg1;
	      this.longitude = arg2;
	    } else {
	      this.latitude = 0;
	      this.longitude = 0;
	    }
	};

    Geolocation._validate = function(latitude, longitude) {
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
        this._validate(this.latitude, this.longitude);
        return {
	        "__type": "GeoPoint",
	        latitude: this.latitude,
	        longitude: this.longitude
	     };
    };

	return Geolocation;
};
