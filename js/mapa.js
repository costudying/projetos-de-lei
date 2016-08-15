var names = _.keys(indications);
console.log(names);
_.each(names, function (name) {
    $("#select-counselor").append($("<option>", {value: name, text: name}));
});
function Hash(defaultValueCallback) {
    this.dict = {};
    this.defaultValueCallback = defaultValueCallback;
    return this;
}
Hash.prototype.set = function (key, value) {
    this.dict[key] = value;
};
Hash.prototype.get = function (key) {
    if (_.isUndefined(this.dict[key])) {
        this.dict[key] = this.defaultValueCallback(key);
    }
    return this.dict[key];
};
function groupIndicationsByDate(name) {
    var hash = new Hash(function () { return []; });
    _.each(indications[name], function (ind) {
        var date = new Date(Date.parse(ind.date));
        hash.get(date).push(ind.neighborhood);
    });
    return hash.dict;
}
var indicationsByDate = {};
var neighborhoodExists = {};
_.each(names, function (name) {
    indicationsByDate[name] = groupIndicationsByDate(name);
    _.each(indications[name], function (ind) {
        neighborhoodExists[ind.neighborhood] = true;
    });
});
var neighborhoods = _.keys(neighborhoodExists);

mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc3VsdG9ybW9iaWxlIiwiYSI6ImNpbGVqcGhkMjBtejV2bm1jMXhqN3ZhcGsifQ.MrxLW6ZkampJgd297kg_Zw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-43.414047, -22.907193],
    zoom: 13,
    hash: true
});
console.log('hi');

map.on('load', function () {
    $.ajax('bairros-rj-kml/Flamengo.kml').done(function(xml) {
        var collec = toGeoJSON.kml(xml);
        var feat = collec.features[0];
        map.addSource('flamengo', {type: 'geojson', data: feat});
        map.addLayer({
            'id': 'neighborhood-flamengo',
            'type': 'fill',
            'source': 'flamengo',
            'layout': {},
            'paint': {
                'fill-color': '#F00',
                'fill-opacity': 0.8
            }
        });
    });
});
