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
function groupIndicationsByDate(name) { // working
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

function findBoundaryDates() {
    var allDates = [];
    _.each(_.keys(indicationsByDate), function (name) {
        var dates = _.keys(indicationsByDate[name]);
        allDates = allDates.concat(dates);
    });
    var sortedAscDates = _.sortBy(_.map(_.uniq(allDates), function (d) { return new Date(d); }));
    return {startDate: _.first(sortedAscDates), endDate: _.last(sortedAscDates)};
}

function numberOfDaysBetween(boundaryDates) {
    var asUTC = function (date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    };
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (asUTC(boundaryDates.endDate) - asUTC(boundaryDates.startDate)) / millisecondsPerDay;
}

function buildDaySlider() {
    var boundaryDates = findBoundaryDates();
    var numberOfDays = numberOfDaysBetween(boundaryDates);
    $(function () {
        $('.slider-input').jRange({
            from: 0,
            to: numberOfDays,
            step: 1,
            scale: [0, (numberOfDays - 1)],
            format: '%s',
            width: 800,
            showLabels: true,
            snap: true
        });
    });
}
buildDaySlider();

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
    window.kmlByName = {};
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
                kmlByName[name] = xml;
                // neighborhoodXML[name] = xml;
                var collec = toGeoJSON.kml(xml);
                var feat = collec.features[0];
                map.addSource(name, {type: "geojson", data: feat});
                map.addLayer({
                    id: name.toUpperCase(),
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
        // map.setPaintProperty('Leblon', 'fill-color', '#000000');
        // map.setPaintProperty('Ipanema', 'fill-color', '#000000');
        // map.setPaintProperty('Lagoa', 'fill-color', '#000000');
    });
});

$('#select-counselor').on('change', function () {
    _.each(neighborhoodNames, function (neigh) {
        map.setPaintProperty(neigh.toUpperCase(), 'fill-opacity', 0.25);
        map.setPaintProperty(neigh.toUpperCase(), 'fill-color', '#FFFFFF');
    });
    var name = $(this).val();
    console.log('Loading data for: ', name);
    var neighIndNamesByDate = indicationsByDate[name];
    var boundaryDates = findBoundaryDates();
    var numberOfDays = numberOfDaysBetween(boundaryDates);
    var delayInMilliseconds = 10000 / numberOfDays;
    var currDay = 0;
    var maxCountForNeighborhoodName = {};
    _.forEach(neighIndNamesByDate, function (neighIndNames, date) {
        _.each(neighIndNames, function (neighIndName) {
            var neighNames = convertToKMLNeighborhoodNames(neighIndName);
            _.each(neighNames, function (neighName) {
                if (!maxCountForNeighborhoodName[neighName]) { maxCountForNeighborhoodName[neighName] = 0; }
                maxCountForNeighborhoodName[neighName] += 1;
            });
        });
    });
    var countForNeighborhoodName = {};
    $('.slider-input').jRange('setValue', currDay.toString());
    var interval = setInterval(function () {
        var date = moment(boundaryDates.startDate).add(currDay, 'days').toDate();
        console.log('('+currDay+'/'+numberOfDays+') Indications for date:', date);
        console.log(neighIndNamesByDate[date]);
        $('.slider-input').jRange('setValue', currDay.toString());

        var neighIndNames = neighIndNamesByDate[date];
        if (!_.isUndefined(neighIndNames)) {
            window.neighIndNames = neighIndNames;
            _.each(neighIndNames, function (neighIndName) {
                _.each(convertToKMLNeighborhoodNames(neighIndName), function (neighName) {
                    if (!countForNeighborhoodName[neighName]) { countForNeighborhoodName[neighName] = 0; }
                    countForNeighborhoodName[neighName] += 1;
                    var op = (countForNeighborhoodName[neighName]*1.0) / maxCountForNeighborhoodName[neighName];
                    map.setPaintProperty(neighName, 'fill-opacity', op);
                    map.setPaintProperty(neighName, 'fill-color', '#FF0000');
                });
            });
        }

        // var neighIndNames = neighIndNamesByDate[date];
        // if (!_.isUndefined(neighIndNames)) {
        //     _.each(neighIndNames, function (neighIndName) {
        //         var names = convertToKMLNeighborhoodNames(neighIndName);
        //         console.log(names);
        //     });
        // }
        // _.forEach(_.groupBy(indNeighs), function (arr, indNeigh) {
        //     var count = arr.length;
        //     console.log('convert:', indNeigh);
        //     var names = convertToKMLNeighborhoodNames(indNeigh);
        //     _.each(names, function (name) {
        //         if (_.isUndefined(countForNeighborhoodName[name])) {
        //             countForNeighborhoodName[name] = 0;
        //         }
        //         countForNeighborhoodName[name] += count;
        //         var opacity = (countForNeighborhoodName[name] * 1.0) / maxCountForNeighborhoodName[name];
        //         map.setPaintProperty(name, 'fill-opacity', opacity);
        //         map.setPaintProperty(name, 'fill-color', '#FF0000')
        //     });
        // });

        currDay += 1;
        if (currDay == numberOfDays) {
            clearInterval(interval);
        }
    }, delayInMilliseconds);
    window.maxCountForNeighborhoodName = maxCountForNeighborhoodName;
    window.countForNeighborhoodName = countForNeighborhoodName;
});

function convertToKMLNeighborhoodNames(nameFromIndication) {
    return _
    .chain(nameFromIndication.split('+'))
    .map(function (word) {
        return word.split(' ').join('');
    })
    .map(function (word) {
        if (word === "GARDENIA") { return "GARDENIAAZUL"; }
        else if (word === "LAPA") { return "CENTRO"; } // NOT 100% accurate!
        else if (word === "ILHADOGOVERNADOR") { return "GALEAO"; } // NOT 100% accurate!
        else if (word === "OSWALDOCRUZ") { return "OSVALDOCRUZ"; }
        else if (word === "QUINTINO") { return "QUINTINOBOCAIUVA" }
        else if (word === "SULACAP") { return "JARDIMSULACAP"; }
        else return word;
    })
    .value();
}

//
// WIP: map each name in `neighborhoods` (from `indications.js`) to a name in `neighborhoodNames` (from `neighborhoodNames.js`, extracted from the KML files)
//
window.testNames = function () {
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
