var names = _.keys(indications);
// console.log(names);
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
map.on('load', function () {
    console.log("[*] Map loaded.");
    // var neighborhoodXML = {};
    // if (localStorage.getItem("neighborhoodXML") === null) {
    var randomColor = function () {
        return ('#' + (function co(lor){   return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) && (lor.length == 6) ?  lor : co(lor); })('')).toUpperCase();
    };
    var nameQueue = _.clone(neighborhoodNames);
    var loadNeighborhoods = function (queue, completionCallback) {
        if (_.isEmpty(queue)) {
            console.log("[*] Finish loading all neighborhood KML files.");
            completionCallback();
            return;
        } else {
            var name = queue.pop();
            console.log("[*] Loading '"+name+".kml'... ("+queue.length+" left)");
            $.ajax("bairros-rj-kml/" + name + ".kml").done(function (xml) {
                console.log("[*] Done loading '"+name+".kml!'");
                // neighborhoodXML[name] = xml;
                var collec = toGeoJSON.kml(xml);
                var feat = collec.features[0];
                map.addSource(name, {type: "geojson", data: feat});
                map.addLayer({
                    id: name,
                    type: "fill",
                    source: name,
                    layout: {},
                    paint: {
                        "fill-color": randomColor(),
                        "fill-opacity": 0.8
                    }
                });
                loadNeighborhoods(queue, completionCallback);
            });
        }
    };

    loadNeighborhoods(nameQueue, function () {
        // localStorage.setItem("neighborhoodXML", JSON.stringify(neighborhoodXML));
    });


    //
    // WIP: map each name in `neighborhoods` (from `indications.js`) to a name in `neighborhoodNames` (from `neighborhoodNames.js`, extracted from the KML files)
    //
    var test = function () {
        var result = {ok: [], err: []};
        var nclone = _.clone(neighborhoods);
        var namesFromInd =
            _.chain(nclone)
            .sortBy()
            .each(function (n) {
                if (n.search("\\+")!=-1) {
                    _.each(n.split("+"), function (word) {
                        nclone.push(word);
                    });
                }
             })
             .filter(function (n) {
                 return n.search("\\+")===-1;
             })
             .map(function (n) {
                 return n.split(" ").join("");
             })
             .map(function (n) { // correction
                 if (n === "GARDENIA") { return "GARDENIAAZUL"; }
                 else if (n === "LAPA") { return "CENTRO"; } // NOT 100% accurate!
                 else if (n === "ILHADOGOVERNADOR") { return "GALEAO"; } // NOT 100% accurate!
                 else if (n === "OSWALDOCRUZ") { return "OSVALDOCRUZ"; }
                 else if (n === "QUINTINO") { return "QUINTINOBOCAIUVA" }
                 else if (n === "SULACAP") { return "JARDIMSULACAP"; }
                 else return n;
             })
             .value();
        var namesFromKML = _.chain(neighborhoodNames).sortBy().map(function (n) { return n.toUpperCase(); }).value();
        var kml = {};
        _.each(namesFromKML, function (n) {
            kml[n] = true;
        });
        _.each(namesFromInd, function (nind) {
            if (kml[nind]) {
                result.ok.push(nind);
            } else {
                result.err.push(nind);
            }
        });
        return result;
    };
    // } else {
    //     console.log("[*] Loading neighborhood XML files from localStorage.");
    //     neighborhoodXML = JSON.parse(localStorage.getItem("neighborhoodXML"));
    //     _.forOwn(neighborhoodXML, function (xml, name) {
    //         var collec = toGeoJSON.kml(xml);
    //         var feat = collec.features[0];
    //         map.addSource(name, {type: "geojson", data: feat});
    //         map.addLayer({
    //             id: name,
    //             type: "fill",
    //             source: name,
    //             layout: {},
    //             paint: {
    //                 "fill-color": "#F00",
    //                 "fill-opacity": 0.8
    //             }
    //         });
    //     });
    // }
    // $.ajax('bairros-rj-kml/Flamengo.kml').done(function(xml) {
    //     var collec = toGeoJSON.kml(xml);
    //     var feat = collec.features[0];
    //     map.addSource('flamengo', {type: 'geojson', data: feat});
    //     map.addLayer({
    //         'id': 'neighborhood-flamengo',
    //         'type': 'fill',
    //         'source': 'flamengo',
    //         'layout': {},
    //         'paint': {
    //             'fill-color': '#F00',
    //             'fill-opacity': 0.8
    //         }
    //     });
    // });
});
