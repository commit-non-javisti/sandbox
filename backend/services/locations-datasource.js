var _ = require("underscore");
var locationData = require(__dirname + '/../data/it_locations');

var locationsDs = {

    findBy: function(areaLevel, shortName) {
        var locationsFound = {};
        _.keys(locationData).forEach(function (key) {

            if (locationData[key].length > 0) {
                var found = _.find(locationData[key][0].address_components, function (address) {
                    return _.contains(address.types, areaLevel)
                        && address.short_name && address.short_name.toLowerCase() == shortName.toLowerCase();
                });

                if (found) {
                    locationsFound[key] = locationData[key];
                }
            }
        });

        return locationsFound;
    }
}

module.exports = locationsDs;