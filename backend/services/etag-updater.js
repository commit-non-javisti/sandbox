"use strict";

var _ = require('lodash');
var Q = require('q');


var countriesDs = require('./dao/mongodb/countries-datasource');
var connectToDB = require('./dao/mongodb/mongo-connection');
var ghHttp = require('./gh-http');

var connect = _.compose(Q.when, connectToDB);

var toUrl = function (user) {
    return user.url;
}

var etag_updater = {
    options: {
        maxNum: Number.MAX_VALUE
    },
    getEuropeCountries: function () {
        return connect().then(function (db) {
            return countriesDs.getCountriesLocations(db);
        }).then(function (continent) {
            //FIXME : valid only for europe
            return _.keys(continent.europe.countries);
        });
    },
    getUsersByCountry: function (country) {
        return connect().then(function (db) {
            return db.collection(country + "_users").find({}).limit(etag_updater.options.maxNum);
        });
    },
    getUsersUrlByCountry: function (country) {
        return this.getUsersByCountry(country).then(function (cursor) {
            return cursor.map(toUrl);
        });
    },
    getETagsByCountry: function (country) {
        return this.getUsersUrlByCountry(country).then(function (cursor) {
            return cursor.map(ghHttp.getWithLimit);
        }).then(function(response) {
            return response;
        });
    },
    toEtags: function (url) {
        return ghHttp.getWithLimit(url).then(function(http) {
            if(!http.response.headers.etag) throw new Error(http.response.headers.status);
            return http.response.headers.etag;
        })
    }

};

module.exports = etag_updater;