(function () {
"use strict";

$(document).ready(function () {
  $("#container-progress-bar-map").hide();
  $("#select-politician").selectize({
    sortField: 'text'
  });
});

mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc3VsdG9ybW9iaWxlIiwiYSI6ImNpbGVqcGhkMjBtejV2bm1jMXhqN3ZhcGsifQ.MrxLW6ZkampJgd297kg_Zw';
var map = new mapboxgl.Map({
    container: 'container-map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-43.414047, -22.907193],
    zoom: 13,
    hash: true
});

var Component = {
  details: function (party, email, phone) {
    var __ = HTMLBuilder;
    var detailsHTML =
    __.ul(
      __.li(__.b("Partido: "), party),
      __.li(__.b("Email: "), email),
      __.li(__.b("Tel.: "), phone)
    );
    return $(detailsHTML);
  }
};

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

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function toHex(dec) {
  var str = dec.toString(16);
  if (str.length == 1) {
    str = "0" + str;
  }
  return str;
}

var Cache = {
  neighborhoodKMLDataByName: {}
};

function loadNeighborhoodKMLFiles(queue, queueTotal, countByNeighborhoodKMLName) {
  if (_.isEmpty(queue)) {
    console.log("[*] Finish loading all neighborhood KML files.");
    $("#progress-bar-map > .progress-bar").css("width", "100%");
    $("#progress-bar-map > .progress-bar").attr("aria-valuenow", "100");
    setTimeout(function () {
      $("#container-progress-bar-map").hide(200);
    }, 800);
  } else {
    var progress = Math.round(100 * ((queueTotal - queue.length) / queueTotal)).toString();
    console.log(progress);
    $("#progress-bar-map > .progress-bar").css("width", progress + "%");
    $("#progress-bar-map > .progress-bar").attr("aria-valuenow", progress);

    var name = queue.pop();
    // console.log("[*] Loading '"+name+".kml'... ("+queue.length+" left)");
    if (Cache.neighborhoodKMLDataByName[name]) {
      var perc = (countByNeighborhoodKMLName[name] * 1.0) / maxIndicationsPerNeighborhoodKMLName[name];
      map.setPaintProperty(name, 'fill-opacity', 0.5);
      var rgb = HSVtoRGB(240 + 60 * perc, 1.0, perc);
      var color = "#" + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
      map.setPaintProperty(name, 'fill-color', color);
      loadNeighborhoodKMLFiles(queue, queueTotal, countByNeighborhoodKMLName);
    } else {
      $.ajax("data/neighborhoods/" + name + ".kml").done(function (kmlData) {
          // console.log("[*] Done loading '"+name+".kml!'");
          Cache.neighborhoodKMLDataByName[name] = kmlData;
          var collec = toGeoJSON.kml(kmlData);
          var feat = collec.features[0];
          var perc = (countByNeighborhoodKMLName[name] * 1.0) / maxIndicationsPerNeighborhoodKMLName[name];
          var rgb = HSVtoRGB(240 + 60 * perc, 1.0, perc);
          var color = "#" + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
          map.addSource(name, {type: "geojson", data: feat});
          map.addLayer({
              id: name,
              type: "fill",
              source: name,
              layout: {},
              paint: {
                  "fill-color": color,
                  "fill-opacity": 0.5
              }
          });
          loadNeighborhoodKMLFiles(queue, queueTotal, countByNeighborhoodKMLName);
      });
    }
  }
}

function renderMap(indications) {
    var neighborhoods = [];
    _.each(indications, function (ind) {
      neighborhoods.push(convertToKMLNeighborhoodNames(ind.neighborhood));
    });
    neighborhoods = _.uniq(_.flatten(neighborhoods));
    console.log(neighborhoods);
    var countByNeighborhoodKMLName = {};
    _.each(indications, function (ind) {
      var kmlNames = convertToKMLNeighborhoodNames(ind.neighborhood);
      _.each(kmlNames, function (kmlName) {
        if (!countByNeighborhoodKMLName[kmlName]) {
          countByNeighborhoodKMLName[kmlName] = 0;
        }
        countByNeighborhoodKMLName[kmlName] += 1;
      });
    });
    console.log('count', countByNeighborhoodKMLName);
    // reset map
    _.each(Cache.neighborhoodKMLDataByName, function (kmlData, name) {
      map.setPaintProperty(name, 'fill-opacity', 0.0);
    });
    $("#progress-bar-map > .progress-bar").css("width", "0%");
    $("#progress-bar-map > .progress-bar").attr("aria-valuenow", "0");
    $("#container-progress-bar-map").show();
    loadNeighborhoodKMLFiles(neighborhoods, neighborhoods.length, countByNeighborhoodKMLName);
}

function loadIndications(id) {
  var filename = id.split(" ").join("_") + ".json";
  $.getJSON("data/indications/" + filename, function (indications) {
    console.log("loaded", indications);
    renderMap(indications);
  });
}

map.on('load', function () {
  console.log("[*] Map loaded.");
  $( document ).ready(function () {
    $("#select-politician").on("change", function () {
      var id = $(this).val();
      var phone = dataByPoliticianId[id].phone;
      var email = dataByPoliticianId[id].email;
      var party = dataByPoliticianId[id].party;
      console.log(id, phone, email, party);
      $("#container-details").empty();
      $("#container-details").append( Component.details(party, email, phone) );
      loadIndications(id);
    });
  });
});

var maxIndicationsPerNeighborhoodKMLName = {
  "TAQUARA": 64,
  "PRACASECA": 23,
  "VILAVALQUEIRE": 28,
  "VARGEMPEQUENA": 9,
  "CURICICA": 8,
  "TANQUE": 5,
  "FREGUESIA": 13,
  "JACAREPAGUA": 93,
  "PECHINCHA": 6,
  "GARDENIAAZUL": 8,
  "JOA": 24,
  "ITANHANGA": 9,
  "ESTACIO": 17,
  "GRAJAU": 3,
  "ANIL": 11,
  "CIDADEDEDEUS": 8,
  "REALENGO": 31,
  "CAMORIM": 5,
  "RECREIODOSBANDEIRANTES": 84,
  "MARACANA": 2,
  "ROCHA": 65,
  "INHAUMA": 18,
  "ENGENHODARAINHA": 14,
  "SANTACRUZ": 89,
  "ENGENHODEDENTRO": 6,
  "BARRADATIJUCA": 54,
  "ANDARAI": 3,
  "BENTORIBEIRO": 37,
  "PIEDADE": 9,
  "FLAMENGO": 8,
  "LAGOA": 5,
  "ABOLICAO": 2,
  "GUARATIBA": 134,
  "CAMPOGRANDE": 243,
  "PAVUNA": 337,
  "COELHONETO": 515,
  "HONORIOGURGEL": 47,
  "ACARI": 74,
  "BOTAFOGO": 173,
  "COSTABARROS": 48,
  "PARQUECOLUMBIA": 99,
  "BRASDEPINA": 140,
  "RAMOS": 142,
  "COLEGIO": 49,
  "TURIACU": 3,
  "GUADALUPE": 85,
  "LEME": 33,
  "CENTRO": 16,
  "ANCHIETA": 58,
  "DEODORO": 2,
  "IRAJA": 99,
  "MARE": 39,
  "CAJU": 15,
  "MADUREIRA": 37,
  "OLARIA": 83,
  "CASCADURA": 10,
  "DELCASTILHO": 5,
  "BARROSFILHO": 18,
  "RICARDODEALBUQUERQUE": 15,
  "PENHA": 109,
  "VISTAALEGRE": 25,
  "AGUASANTA": 8,
  "ENGENHONOVO": 4,
  "MARIADAGRACA": 7,
  "JARDIMSULACAP": 3,
  "COMPLEXODOALEMAO": 3,
  "CATETE": 2,
  "SAUDE": 12,
  "MANGUEIRA": 3,
  "JARDIMGUANABARA": 3,
  "TIJUCA": 8,
  "CORDOVIL": 54,
  "CAMPINHO": 32,
  "ENCANTADO": 2,
  "GALEAO": 25,
  "HIGIENOPOLIS": 55,
  "BONSUCESSO": 49,
  "VICENTEDECARVALHO": 29,
  "BARRADEGUARATIBA": 5,
  "COSMOS": 23,
  "VARGEMGRANDE": 3,
  "GLORIA": 1,
  "MANGUINHOS": 42,
  "BANGU": 46,
  "PACIENCIA": 33,
  "RIOCOMPRIDO": 16,
  "PRACADABANDEIRA": 1,
  "MEIER": 8,
  "TOMASCOELHO": 4,
  "COCOTA": 9,
  "JACARE": 4,
  "SEPETIBA": 192,
  "BENFICA": 7,
  "ZUMBI": 1,
  "PITANGUEIRAS": 3,
  "BANCARIOS": 5,
  "VILAKOSMOS": 15,
  "VIDIGAL": 2,
  "GAMBOA": 117,
  "SANTOCRISTO": 117,
  "TAUA": 3,
  "MONERO": 10,
  "LINSDEVASCONCELOS": 8,
  "GAVEA": 8,
  "CACHAMBI": 6,
  "VILAISABEL": 6,
  "SAMPAIO": 1,
  "SAOCRISTOVAO": 2,
  "GERICINO": 17,
  "CACUIA": 4,
  "QUINTINOBOCAIUVA": 7,
  "INHOAIBA": 19,
  "SANTISSIMO": 267,
  "CAVALCANTI": 1,
  "SENADORVASCONCELOS": 20,
  "JARDIMAMERICA": 6,
  "JARDIMCARIOCA": 8,
  "SAOCONRADO": 1,
  "COPACABANA": 22,
  "LEBLON": 5,
  "JARDIMBOTANICO": 4,
  "HUMAITA": 9,
  "IPANEMA": 4,
  "LARANJEIRAS": 7,
  "ALTODABOAVISTA": 6,
  "CATUMBI": 10,
  "SANTATERESA": 15,
  "PARADADELUCAS": 24,
  "GRUMARI": 1,
  "SENADORCAMARA": 32,
  "ENGENHEIROLEAL": 4,
  "RIBEIRA": 4,
  "OSVALDOCRUZ": 19,
  "VAZLOBO": 69,
  "VIGARIOGERAL": 15,
  "PADREMIGUEL": 10,
  "RIACHUELO": 2,
  "SAOFRANCISCOXAVIER": 1,
  "PORTUGUESA": 3,
  "ROCINHA": 1,
  "TODOSOSSANTOS": 3,
  "PILARES": 5,
  "PRAIADABANDEIRA": 1,
  "PAQUETA": 6,
  "MAGALHAESBASTOS": 15,
  "CIDADEUNIVERSITARIA": 3,
  "COSMEVELHO": 2,
  "VILAMILITAR": 1,
  "URCA": 2
};

var dataByPoliticianId = {
    "VEREADOR ALEXANDRE ISQUIERDO": {
      "name": "Alexandre Isquierdo",
      "party": "DEM",
      "phone": "3814-2406/2200/2220",
      "email": "alexandreisquierdo@camara.rj.gov.br"
    },
    "VEREADOR ATILA A. NUNES": {
      "name": "Atila A. Nunes",
      "party": "PMDB",
      "phone": "3814-2011/2531/2543",
      "email": "atila.nunes@camara.rj.gov.br"
    },
    "VEREADOR BABA": {
      "name": "Babá",
      "party": "PSOL",
      "phone": "3814-2005 a 2007 / 2387",
      "email": "baba@camara.rj.gov.br"
    },
    "VEREADOR CARLO CAIADO": {
      "name": "Carlo Caiado",
      "party": "DEM",
      "phone": "3814-2081 a 2083/2513/2514",
      "email": "caiado@carlocaiado.com.br"
    },
    "VEREADOR CARLOS BOLSONARO": {
      "name": "Carlos Bolsonaro",
      "party": "PSC",
      "phone": "3814-2117 a 2119 /2717",
      "email": "contato@carlosbolsonaro.com.br"
    },
    "VEREADOR CESAR MAIA": {
      "name": "Cesar Maia",
      "party": "DEM",
      "phone": "3814-2331/2735/2485/2492/2592/2484/2476",
      "email": "cesar.maia@uol.com.br"
    },
    "VEREADOR CHIQUINHO BRAZAO": {
      "name": "Chiquinho Brazão",
      "party": "PMDB",
      "phone": "3814-2136/2139/2010",
      "email": "chiquinho.brazao@camara.rj.gov.br"
    },
    "VEREADOR DR. CARLOS EDUARDO": {
      "name": "Dr. Carlos Eduardo",
      "party": "SOLIDARIEDADE",
      "phone": "3814-2328/2434/2490/2773/2469/2491",
      "email": "dr.carloseduardo@camara.rj.gov.br"
    },
    "VEREADOR DR. EDUARDO MOURA": {
      "name": "Dr. Eduardo Moura",
      "party": "PMDB",
      "phone": "3814-2466 / 2468 ou cel:7856-5769",
      "email": "doutor@eduardomoura.com.br"
    },
    "VEREADOR DR. GILBERTO": {
      "name": "Dr. Gilberto",
      "party": "PMN",
      "phone": "3814-2132 a 2135",
      "email": "dr.gilberto@camara.rj.gov.br"
    },
    "VEREADOR DR. JAIRINHO": {
      "name": "Dr. Jairinho",
      "party": "PMDB",
      "phone": "3814-2039/2475/2498/2237",
      "email": "vereadorjairinho@terra.com.br"
    },
    "VEREADOR DR. JOAO RICARDO": {
      "name": "Dr. João Ricardo",
      "party": "PMDB",
      "phone": "3814-2246 / 2944 / 2418",
      "email": "drjoaoricardo@camara.rj.gov.br"
    },
    "VEREADOR DR. JORGE MANAIA": {
      "name": "Dr. Jorge Manaia",
      "party": "SOLIDARIEDADE",
      "phone": "3814-2140/2143/2144/2563",
      "email": "doutor@jorgemanaia.com.br"
    },
    "VEREADOR EDSON ZANATA": {
      "name": "Edson Zanata",
      "party": "PT",
      "phone": "3814-2163 a 2165",
      "email": "edsonzanata@camara.rj.gov.br"
    },
    "VEREADOR EDUARDAO": {
      "name": "Eduardão",
      "party": "PMDB",
      "phone": "3814-2013 a 2016",
      "email": "eduardao@camara.rj.gov.br"
    },
    "VEREADOR ELISEU KESSLER": {
      "name": "Eliseu Kessler",
      "party": "PSD",
      "phone": "3814-2102/2103/2105 /2050",
      "email": "eliseukessler@camara.rj.gov.br"
    },
    "VEREADOR ELTON BABU": {
      "name": "Elton Babú",
      "party": "PT",
      "phone": "3814-2396/2444/2935/2442/2224/2733/2441",
      "email": "eltonbabu13444@gmail.com"
    },
    "VEREADOR JEFFERSON MOURA": {
      "name": "Jefferson Moura",
      "party": "REDE",
      "phone": "3814-2901/2069/2749",
      "email": "gabinetejeffersonmoura@gmail.com"
    },
    "VEREADOR JIMMY PEREIRA": {
      "name": "Jimmy Pereira",
      "party": "PRTB",
      "phone": "3814-2088/2089/2091",
      "email": "jimmypereira@camara.rj.gov.br"
    },
    "VEREADOR JOAO CABRAL": {
      "name": "João Cabral",
      "party": "PMDB",
      "phone": "3814-2509 e 2521",
      "email": "joaocabral@camara.rj.gov.br"
    },
    "VEREADOR JOAO MENDES DE JESUS": {
      "name": "João Mendes de Jesus",
      "party": "PRB",
      "phone": "3814-2009/2057/2061/2333",
      "email": "joaomendesdejesus@camara.rj.gov.br"
    },
    "VEREADOR JORGE BRAZ": {
      "name": "Jorge Braz",
      "party": "PSB",
      "phone": "3814-2607/2609/2178",
      "email": "vereadorjorgebraz@camara.rj.gov.br"
    },
    "VEREADOR JORGE FELIPPE": {
      "name": "Jorge Felippe",
      "party": "PMDB",
      "phone": "3814-2001 a 2004",
      "email": "jorge.felippe@camara.rj.gov.br"
    },
    "VEREADOR JORGINHO DA SOS": {
      "name": "Jorginho da S.O.S.",
      "party": "PMDB",
      "phone": "3814-2231/2232/2456/2457",
      "email": "jorge.silva@camara.rj.gov.br"
    },
    "VEREADOR JUNIOR DA LUCINHA": {
      "name": "Junior da Lucinha",
      "party": "PMDB",
      "phone": "3814-2451/2455/2448",
      "email": "juniordalucinha@camara.rj.gov.br"
    },
    "VEREADORA LEILA DO FLAMENGO": {
      "name": "Leila do Flamengo",
      "party": "PMDB",
      "phone": "3814-2375 a 2377/2409",
      "email": "leiladoflamengo@camara.rj.gov.br"
    },
    "VEREADOR LEONEL BRIZOLA NETO": {
      "name": "Leonel Brizola Neto",
      "party": "PSOL",
      "phone": "3814-2125/2180/2412",
      "email": "leonelbrizola@camara.rj.gov.br"
    },
    "VEREADOR MARCELINO D'ALMEIDA": {
      "name": "Marcelino D Almeida",
      "party": "PP",
      "phone": "3814-2183 a 2185/2448/2515",
      "email": "marcelinodalmeida@gmail.com"
    },
    "VEREADOR MARCELO ARAR": {
      "name": "Marcelo Arar",
      "party": "PTB",
      "phone": "3814-2030/2045/2046",
      "email": "marceloarar@camara.rj.gov.br"
    },
    "VEREADOR MARCELO PIUI": {
      "name": "Marcelo Piuí",
      "party": "PHS",
      "phone": "3814-2017 a 2020",
      "email": "marcelopiui@camara.rj.gov.br"
    },
    "VEREADOR MARCIO GARCIA": {
      "name": "Marcio Garcia",
      "party": "REDE",
      "phone": "3814-2158/2159 e 2270",
      "email": "vereadormarciogarcia@gmail.com"
    },
    "VEREADOR MARIO JUNIOR": {
      "name": "Mario Junior",
      "party": "DEM",
      "phone": "3814-2238 / 2176 / 2236",
      "email": "mariojunior@camara.rj.gov.br"
    },
    "VEREADOR PAULO MESSINA": {
      "name": "Paulo Messina",
      "party": "PROS",
      "phone": "3814-2094/2095/2070",
      "email": "messina@camara.rj.gov.br"
    },
    "VEREADOR PAULO PINHEIRO": {
      "name": "Paulo Pinheiro",
      "party": "PSOL",
      "phone": "3814-2393/2068/2920/2463",
      "email": "paulopinheiro@camara.rj.gov.br"
    },
    "VEREADOR PROF. UOSTON": {
      "name": "Prof. Uoston",
      "party": "PMDB",
      "phone": "3814-2032/2033/2034",
      "email": "prof.uoston@camara.rj.gov.br"
    },
    "VEREADOR PROF. CELIO LUPPARELLI": {
      "name": "Prof.Célio Lupparelli ",
      "party": "DEM",
      "phone": "3814-2037/2038",
      "email": "celiolupparelli@celiolupparelli.com.br"
    },
    "VEREADOR PROFESSOR ROGERIO ROCAL": {
      "name": "Professor Rogério Rocal",
      "party": "PTB",
      "phone": "3814-2127/2128/2131",
      "email": "rogeriorocal@gmail.com"
    },
    "VEREADOR RAFAEL ALOISIO FREITAS": {
      "name": "Rafael Aloisio Freitas",
      "party": "PMDB",
      "phone": "3814-2022 a 2025",
      "email": "rafael@rafaelaloisiofreitas.com.br"
    },
    "VEREADOR RAPHAEL GATTAS": {
      "name": "Raphael Gattás",
      "party": "PP",
      "phone": "3814-2086 / 2087 / 2365 / 2170 / 2925",
      "email": "raphael.gattas@camara.rj.gov.br"
    },
    "VEREADOR REIMONT": {
      "name": "Reimont",
      "party": "PT",
      "phone": "3814-2113 a 2115 / 2394",
      "email": "reimont@reimont.com.br"
    },
    "VEREADOR RENATO CINCO": {
      "name": "Renato Cinco",
      "party": "PSOL",
      "phone": "3814-2026 a 2029 / 2008",
      "email": "renatocinco@renatocinco.com"
    },
    "VEREADOR RENATO MOURA": {
      "name": "Renato Moura",
      "party": "PDT",
      "phone": "3814-2401/2461/2446/2449",
      "email": "renato.moura@camara.rj.gov.br"
    },
    "VEREADORA ROSA FERNANDES": {
      "name": "Rosa Fernandes",
      "party": "PMDB",
      "phone": "3814-2065 a 2067/2255",
      "email": "rosa.fernandes@camara.rj.gov.br"
    },
    "VEREADOR S. FERRAZ": {
      "name": "S. Ferraz",
      "party": "PMDB",
      "phone": "3814-2106 a 2109",
      "email": "sferraz@camara.rj.gov.br"
    },
    "VEREADORA TANIA BASTOS": {
      "name": "Tânia Bastos",
      "party": "PRB",
      "phone": "3814-2097 a 2099/2512",
      "email": "vereadorataniabastos@camara.rj.gov.br"
    },
    "VEREADORA TERESA BERGHER": {
      "name": "Teresa Bergher",
      "party": "PSDB",
      "phone": "3814-2389/2391/2054",
      "email": "teresa.bergher@camara.rj.gov.br"
    },
    "VEREADOR THIAGO K. RIBEIRO": {
      "name": "Thiago K. Ribeiro",
      "party": "PMDB",
      "phone": "3814-2381/2383/2384",
      "email": "thiagokribeiro@gmail.com"
    },
    "VEREADORA VERA LINS": {
      "name": "Vera Lins",
      "party": "PP",
      "phone": "3814-2187/2587/2579/2433",
      "email": "veralins@camara.rj.gov.br"
    },
    "VEREADORA VERONICA COSTA": {
      "name": "Veronica Costa",
      "party": "PMDB",
      "phone": "3814-2076/2078/2580",
      "email": "veronica.costa@camara.rj.gov.br"
    },
    "VEREADOR WILLIAN COELHO": {
      "name": "Willian Coelho",
      "party": "PMDB",
      "phone": "3814-2154 a 2157",
      "email": "williancoelho@camara.rj.gov.br"
    },
    "VEREADOR ZICO": {
      "name": "Zico",
      "party": "PTB",
      "phone": "3814-2167 a 2169/2172",
      "email": "vereadorzico@camara.rj.gov.br"
    }
};

})();
