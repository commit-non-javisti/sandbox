var _ = require("underscore");
var Q = require('q');
var db = require('./mongo-connection');

var locationsDs = {

    /**
     * Return all districts of a country
     *
     * @param country it, uk
     * @returns {Promise}
     */
    getDistricts: function (country, dbFunc) {
        if (dbFunc) {
            return getDistrictsCollection(dbFunc, country);
        } else {
            return db().then(function (db) {
                return getDistrictsCollection(db, country)
                    .then(function (result) {
                        db.close();
                        return result;
                    });
            });
        }

        function getDistrictsCollection(db, country) {
            return db.collection(country + '_districts')
                .find({}, {district: 1, _id: 0})
                .toArray();
        }
    }

}

module.exports = locationsDs;