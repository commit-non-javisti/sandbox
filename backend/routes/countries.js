var express = require('express');
var _ = require("underscore");
var countriesDs = require(__dirname + "/../services/countries-datasource");
var api = require(__dirname + '/../services/api-params');

var router = express.Router();

router.get('/', function (req, res) {
    countriesDs.getCountriesLocations()
        .then(function (countries) {
            _.keys(countries).forEach(function(country) {

                countries[country].links = {
                    details: api.getApiPath() + api.countriesPath + '/' + country,
                }

            });
            var resBody = {
                countries: countries
            };
            res.json(resBody);
        });
});

router.get('/:country', function (req, res) {

    res.json({
        users: api.getApiPath() + api.usersPath + '/' + req.params.country,
        locations: api.getApiPath() + api.locationsPath + '/' + req.params.country,
        languages: api.getApiPath() + api.languagesPath + '/' + req.params.country,
    });

});

module.exports = router;