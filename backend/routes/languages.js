var express = require('express');
var _ = require("underscore");
var languagesAdapter = require(__dirname + "/../services/languages-adapter");
var api = require(__dirname + '/../services/api-params');

var router = express.Router();

router.get('/:country', function (req, res, next) {

    languagesAdapter.getRankedLanguages(req.params.country)
        .then(function(languages) {
            res.json({
                languages: languages,
                links: {
                    languagesPerDistrict: api.getApiPath() + api.languagesPath + '/' + req.params.country + '/per-district',
                    singleDistrict: api.getApiPath() + api.languagesPath + '/' + req.params.country + '/{:districtName}'
                }
            });
        })
        .catch(next);
});

router.get('/:country/per-district', function (req, res) {

    languagesAdapter.getLanguagesPerDistrict(req.params.country)
        .then(function(languages) {
            res.json(languages);
        });
});

router.get('/:country/:district', function (req, res) {

    languagesAdapter.getRankedLanguages(req.params.country, req.params.district)
        .then(function(languages) {
            res.json(languages);
        });
});

module.exports = router;