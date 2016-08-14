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

var neighborhoodXML = {};
map.on('load', function () {
    $.when(
        $.ajax('bairros-rj-kml/Abolicao.kml'),
        $.ajax('bairros-rj-kml/Acari.kml'),
        $.ajax('bairros-rj-kml/AguaSanta.kml'),
        $.ajax('bairros-rj-kml/AltoDaBoaVista.kml'),
        $.ajax('bairros-rj-kml/Anchieta.kml'),
        $.ajax('bairros-rj-kml/Andarai.kml'),
        $.ajax('bairros-rj-kml/Anil.kml'),
        $.ajax('bairros-rj-kml/Bancarios.kml'),
        $.ajax('bairros-rj-kml/Bangu.kml'),
        $.ajax('bairros-rj-kml/BarraDaTijuca.kml'),
        $.ajax('bairros-rj-kml/BarraDeGuaratiba.kml'),
        $.ajax('bairros-rj-kml/BarrosFilho.kml'),
        $.ajax('bairros-rj-kml/Benfica.kml'),
        $.ajax('bairros-rj-kml/BentoRibeiro.kml'),
        $.ajax('bairros-rj-kml/Bonsucesso.kml'),
        $.ajax('bairros-rj-kml/Botafogo.kml'),
        $.ajax('bairros-rj-kml/BrasDePina.kml'),
        $.ajax('bairros-rj-kml/Cachambi.kml'),
        $.ajax('bairros-rj-kml/Cacuia.kml'),
        $.ajax('bairros-rj-kml/Caju.kml'),
        $.ajax('bairros-rj-kml/Camorim.kml'),
        $.ajax('bairros-rj-kml/Campinho.kml'),
        $.ajax('bairros-rj-kml/CampoDosAfonsos.kml'),
        $.ajax('bairros-rj-kml/CampoGrande.kml'),
        $.ajax('bairros-rj-kml/Cascadura.kml'),
        $.ajax('bairros-rj-kml/Catete.kml'),
        $.ajax('bairros-rj-kml/Catumbi.kml'),
        $.ajax('bairros-rj-kml/Cavalcanti.kml'),
        $.ajax('bairros-rj-kml/Centro.kml'),
        $.ajax('bairros-rj-kml/CidadeDeDeus.kml'),
        $.ajax('bairros-rj-kml/CidadeNova.kml'),
        $.ajax('bairros-rj-kml/CidadeUniversitaria.kml'),
        $.ajax('bairros-rj-kml/Cocota.kml'),
        $.ajax('bairros-rj-kml/CoelhoNeto.kml'),
        $.ajax('bairros-rj-kml/Colegio.kml'),
        $.ajax('bairros-rj-kml/ComplexodoAlemao.kml'),
        $.ajax('bairros-rj-kml/Copacabana.kml'),
        $.ajax('bairros-rj-kml/Cordovil.kml'),
        $.ajax('bairros-rj-kml/CosmeVelho.kml'),
        $.ajax('bairros-rj-kml/Cosmos.kml'),
        $.ajax('bairros-rj-kml/CostaBarros.kml'),
        $.ajax('bairros-rj-kml/Curicica.kml'),
        $.ajax('bairros-rj-kml/DelCastilho.kml'),
        $.ajax('bairros-rj-kml/Deodoro.kml'),
        $.ajax('bairros-rj-kml/Encantado.kml'),
        $.ajax('bairros-rj-kml/EngenheiroLeal.kml'),
        $.ajax('bairros-rj-kml/EngenhoDaRainha.kml'),
        $.ajax('bairros-rj-kml/EngenhoDeDentro.kml'),
        $.ajax('bairros-rj-kml/EngenhoNovo.kml'),
        $.ajax('bairros-rj-kml/Estacio.kml'),
        $.ajax('bairros-rj-kml/Flamengo.kml'),
        $.ajax('bairros-rj-kml/Freguesia.kml'),
        $.ajax('bairros-rj-kml/FreguesiaJacarepagua.kml'),
        $.ajax('bairros-rj-kml/Galeao.kml'),
        $.ajax('bairros-rj-kml/Gamboa.kml'),
        $.ajax('bairros-rj-kml/GardeniaAzul.kml'),
        $.ajax('bairros-rj-kml/Gavea.kml'),
        $.ajax('bairros-rj-kml/Gericino.kml'),
        $.ajax('bairros-rj-kml/Gloria.kml'),
        $.ajax('bairros-rj-kml/Grajau.kml'),
        $.ajax('bairros-rj-kml/Grumari.kml'),
        $.ajax('bairros-rj-kml/Guadalupe.kml'),
        $.ajax('bairros-rj-kml/Guaratiba.kml'),
        $.ajax('bairros-rj-kml/Higienopolis.kml'),
        $.ajax('bairros-rj-kml/HonorioGurgel.kml'),
        $.ajax('bairros-rj-kml/Humaita.kml'),
        $.ajax('bairros-rj-kml/Inhauma.kml'),
        $.ajax('bairros-rj-kml/Inhoaiba.kml'),
        $.ajax('bairros-rj-kml/Ipanema.kml'),
        $.ajax('bairros-rj-kml/Iraja.kml'),
        $.ajax('bairros-rj-kml/Itanhanga.kml'),
        $.ajax('bairros-rj-kml/Jacare.kml'),
        $.ajax('bairros-rj-kml/Jacarepagua.kml'),
        $.ajax('bairros-rj-kml/Jacarezinho.kml'),
        $.ajax('bairros-rj-kml/JardimAmerica.kml'),
        $.ajax('bairros-rj-kml/JardimBotanico.kml'),
        $.ajax('bairros-rj-kml/JardimCarioca.kml'),
        $.ajax('bairros-rj-kml/JardimGuanabara.kml'),
        $.ajax('bairros-rj-kml/JardimSulacap.kml'),
        $.ajax('bairros-rj-kml/Joa.kml'),
        $.ajax('bairros-rj-kml/Lagoa.kml'),
        $.ajax('bairros-rj-kml/Laranjeiras.kml'),
        $.ajax('bairros-rj-kml/Leblon.kml'),
        $.ajax('bairros-rj-kml/Leme.kml'),
        $.ajax('bairros-rj-kml/LinsDeVasconcelos.kml'),
        $.ajax('bairros-rj-kml/Madureira.kml'),
        $.ajax('bairros-rj-kml/MagalhaesBastos.kml'),
        $.ajax('bairros-rj-kml/Mangueira.kml'),
        $.ajax('bairros-rj-kml/Manguinhos.kml'),
        $.ajax('bairros-rj-kml/Maracana.kml'),
        $.ajax('bairros-rj-kml/Mare.kml'),
        $.ajax('bairros-rj-kml/MarechalHermes.kml'),
        $.ajax('bairros-rj-kml/MariaDaGraca.kml'),
        $.ajax('bairros-rj-kml/Meier.kml'),
        $.ajax('bairros-rj-kml/Monero.kml'),
        $.ajax('bairros-rj-kml/Olaria.kml'),
        $.ajax('bairros-rj-kml/OsvaldoCruz.kml'),
        $.ajax('bairros-rj-kml/Paciencia.kml'),
        $.ajax('bairros-rj-kml/PadreMiguel.kml'),
        $.ajax('bairros-rj-kml/Paqueta.kml'),
        $.ajax('bairros-rj-kml/ParadaDeLucas.kml'),
        $.ajax('bairros-rj-kml/ParqueAnchieta.kml'),
        $.ajax('bairros-rj-kml/ParqueColumbia.kml'),
        $.ajax('bairros-rj-kml/Pavuna.kml'),
        $.ajax('bairros-rj-kml/Pechincha.kml'),
        $.ajax('bairros-rj-kml/PedraDeGuaratiba.kml'),
        $.ajax('bairros-rj-kml/Penha.kml'),
        $.ajax('bairros-rj-kml/PenhaCircular.kml'),
        $.ajax('bairros-rj-kml/Piedade.kml'),
        $.ajax('bairros-rj-kml/Pilares.kml'),
        $.ajax('bairros-rj-kml/Pitangueiras.kml'),
        $.ajax('bairros-rj-kml/Portuguesa.kml'),
        $.ajax('bairros-rj-kml/PracaDaBandeira.kml'),
        $.ajax('bairros-rj-kml/PracaSeca.kml'),
        $.ajax('bairros-rj-kml/PraiaDaBandeira.kml'),
        $.ajax('bairros-rj-kml/QuintinoBocaiuva.kml'),
        $.ajax('bairros-rj-kml/Ramos.kml'),
        $.ajax('bairros-rj-kml/Realengo.kml'),
        $.ajax('bairros-rj-kml/RecreioDosBandeirantes.kml'),
        $.ajax('bairros-rj-kml/Riachuelo.kml'),
        $.ajax('bairros-rj-kml/Ribeira.kml'),
        $.ajax('bairros-rj-kml/RicardoDeAlbuquerque.kml'),
        $.ajax('bairros-rj-kml/RioComprido.kml'),
        $.ajax('bairros-rj-kml/Rocha.kml'),
        $.ajax('bairros-rj-kml/RochaMiranda.kml'),
        $.ajax('bairros-rj-kml/Rocinha.kml'),
        $.ajax('bairros-rj-kml/Sampaio.kml'),
        $.ajax('bairros-rj-kml/SantaCruz.kml'),
        $.ajax('bairros-rj-kml/SantaTeresa.kml'),
        $.ajax('bairros-rj-kml/Santissimo.kml'),
        $.ajax('bairros-rj-kml/SantoCristo.kml'),
        $.ajax('bairros-rj-kml/SaoConrado.kml'),
        $.ajax('bairros-rj-kml/SaoCristovao.kml'),
        $.ajax('bairros-rj-kml/SaoFranciscoXavier.kml'),
        $.ajax('bairros-rj-kml/Saude.kml'),
        $.ajax('bairros-rj-kml/SenadorCamara.kml'),
        $.ajax('bairros-rj-kml/SenadorVasconcelos.kml'),
        $.ajax('bairros-rj-kml/Sepetiba.kml'),
        $.ajax('bairros-rj-kml/Tanque.kml'),
        $.ajax('bairros-rj-kml/Taquara.kml'),
        $.ajax('bairros-rj-kml/Taua.kml'),
        $.ajax('bairros-rj-kml/Tijuca.kml'),
        $.ajax('bairros-rj-kml/TodosOsSantos.kml'),
        $.ajax('bairros-rj-kml/TomasCoelho.kml'),
        $.ajax('bairros-rj-kml/Turiacu.kml'),
        $.ajax('bairros-rj-kml/Urca.kml'),
        $.ajax('bairros-rj-kml/VargemGrande.kml'),
        $.ajax('bairros-rj-kml/VargemPequena.kml'),
        $.ajax('bairros-rj-kml/VascoDaGama.kml'),
        $.ajax('bairros-rj-kml/VazLobo.kml'),
        $.ajax('bairros-rj-kml/VicenteDeCarvalho.kml'),
        $.ajax('bairros-rj-kml/Vidigal.kml'),
        $.ajax('bairros-rj-kml/VigarioGeral.kml'),
        $.ajax('bairros-rj-kml/VilaDaPenha.kml'),
        $.ajax('bairros-rj-kml/VilaIsabel.kml'),
        $.ajax('bairros-rj-kml/VilaKosmos.kml'),
        $.ajax('bairros-rj-kml/VilaMilitar.kml'),
        $.ajax('bairros-rj-kml/VilaValqueire.kml'),
        $.ajax('bairros-rj-kml/VistaAlegre.kml'),
        $.ajax('bairros-rj-kml/Zumbi.kml')
    )
    .done(function (Abolicao,
                    Acari,
                    AguaSanta,
                    AltoDaBoaVista,
                    Anchieta,
                    Andarai,
                    Anil,
                    Bancarios,
                    Bangu,
                    BarraDaTijuca,
                    BarraDeGuaratiba,
                    BarrosFilho,
                    Benfica,
                    BentoRibeiro,
                    Bonsucesso,
                    Botafogo,
                    BrasDePina,
                    Cachambi,
                    Cacuia,
                    Caju,
                    Camorim,
                    Campinho,
                    CampoDosAfonsos,
                    CampoGrande,
                    Cascadura,
                    Catete,
                    Catumbi,
                    Cavalcanti,
                    Centro,
                    CidadeDeDeus,
                    CidadeNova,
                    CidadeUniversitaria,
                    Cocota,
                    CoelhoNeto,
                    Colegio,
                    ComplexodoAlemao,
                    Copacabana,
                    Cordovil,
                    CosmeVelho,
                    Cosmos,
                    CostaBarros,
                    Curicica,
                    DelCastilho,
                    Deodoro,
                    Encantado,
                    EngenheiroLeal,
                    EngenhoDaRainha,
                    EngenhoDeDentro,
                    EngenhoNovo,
                    Estacio,
                    Flamengo,
                    Freguesia,
                    FreguesiaJacarepagua,
                    Galeao,
                    Gamboa,
                    GardeniaAzul,
                    Gavea,
                    Gericino,
                    Gloria,
                    Grajau,
                    Grumari,
                    Guadalupe,
                    Guaratiba,
                    Higienopolis,
                    HonorioGurgel,
                    Humaita,
                    Inhauma,
                    Inhoaiba,
                    Ipanema,
                    Iraja,
                    Itanhanga,
                    Jacare,
                    Jacarepagua,
                    Jacarezinho,
                    JardimAmerica,
                    JardimBotanico,
                    JardimCarioca,
                    JardimGuanabara,
                    JardimSulacap,
                    Joa,
                    Lagoa,
                    Laranjeiras,
                    Leblon,
                    Leme,
                    LinsDeVasconcelos,
                    Madureira,
                    MagalhaesBastos,
                    Mangueira,
                    Manguinhos,
                    Maracana,
                    Mare,
                    MarechalHermes,
                    MariaDaGraca,
                    Meier,
                    Monero,
                    Olaria,
                    OsvaldoCruz,
                    Paciencia,
                    PadreMiguel,
                    Paqueta,
                    ParadaDeLucas,
                    ParqueAnchieta,
                    ParqueColumbia,
                    Pavuna,
                    Pechincha,
                    PedraDeGuaratiba,
                    Penha,
                    PenhaCircular,
                    Piedade,
                    Pilares,
                    Pitangueiras,
                    Portuguesa,
                    PracaDaBandeira,
                    PracaSeca,
                    PraiaDaBandeira,
                    QuintinoBocaiuva,
                    Ramos,
                    Realengo,
                    RecreioDosBandeirantes,
                    Riachuelo,
                    Ribeira,
                    RicardoDeAlbuquerque,
                    RioComprido,
                    Rocha,
                    RochaMiranda,
                    Rocinha,
                    Sampaio,
                    SantaCruz,
                    SantaTeresa,
                    Santissimo,
                    SantoCristo,
                    SaoConrado,
                    SaoCristovao,
                    SaoFranciscoXavier,
                    Saude,
                    SenadorCamara,
                    SenadorVasconcelos,
                    Sepetiba,
                    Tanque,
                    Taquara,
                    Taua,
                    Tijuca,
                    TodosOsSantos,
                    TomasCoelho,
                    Turiacu,
                    Urca,
                    VargemGrande,
                    VargemPequena,
                    VascoDaGama,
                    VazLobo,
                    VicenteDeCarvalho,
                    Vidigal,
                    VigarioGeral,
                    VilaDaPenha,
                    VilaIsabel,
                    VilaKosmos,
                    VilaMilitar,
                    VilaValqueire,
                    VistaAlegre,
                    Zumbi) {
        console.log("finished loading neighborhood .kml files");
        neighborhoodXML["Abolicao"] = Abolicao;
        neighborhoodXML["Acari"] = Acari;
        neighborhoodXML["AguaSanta"] = AguaSanta;
        neighborhoodXML["AltoDaBoaVista"] = AltoDaBoaVista;
        neighborhoodXML["Anchieta"] = Anchieta;
        neighborhoodXML["Andarai"] = Andarai;
        neighborhoodXML["Anil"] = Anil;
        neighborhoodXML["Bancarios"] = Bancarios;
        neighborhoodXML["Bangu"] = Bangu;
        neighborhoodXML["BarraDaTijuca"] = BarraDaTijuca;
        neighborhoodXML["BarraDeGuaratiba"] = BarraDeGuaratiba;
        neighborhoodXML["BarrosFilho"] = BarrosFilho;
        neighborhoodXML["Benfica"] = Benfica;
        neighborhoodXML["BentoRibeiro"] = BentoRibeiro;
        neighborhoodXML["Bonsucesso"] = Bonsucesso;
        neighborhoodXML["Botafogo"] = Botafogo;
        neighborhoodXML["BrasDePina"] = BrasDePina;
        neighborhoodXML["Cachambi"] = Cachambi;
        neighborhoodXML["Cacuia"] = Cacuia;
        neighborhoodXML["Caju"] = Caju;
        neighborhoodXML["Camorim"] = Camorim;
        neighborhoodXML["Campinho"] = Campinho;
        neighborhoodXML["CampoDosAfonsos"] = CampoDosAfonsos;
        neighborhoodXML["CampoGrande"] = CampoGrande;
        neighborhoodXML["Cascadura"] = Cascadura;
        neighborhoodXML["Catete"] = Catete;
        neighborhoodXML["Catumbi"] = Catumbi;
        neighborhoodXML["Cavalcanti"] = Cavalcanti;
        neighborhoodXML["Centro"] = Centro;
        neighborhoodXML["CidadeDeDeus"] = CidadeDeDeus;
        neighborhoodXML["CidadeNova"] = CidadeNova;
        neighborhoodXML["CidadeUniversitaria"] = CidadeUniversitaria;
        neighborhoodXML["Cocota"] = Cocota;
        neighborhoodXML["CoelhoNeto"] = CoelhoNeto;
        neighborhoodXML["Colegio"] = Colegio;
        neighborhoodXML["ComplexodoAlemao"] = ComplexodoAlemao;
        neighborhoodXML["Copacabana"] = Copacabana;
        neighborhoodXML["Cordovil"] = Cordovil;
        neighborhoodXML["CosmeVelho"] = CosmeVelho;
        neighborhoodXML["Cosmos"] = Cosmos;
        neighborhoodXML["CostaBarros"] = CostaBarros;
        neighborhoodXML["Curicica"] = Curicica;
        neighborhoodXML["DelCastilho"] = DelCastilho;
        neighborhoodXML["Deodoro"] = Deodoro;
        neighborhoodXML["Encantado"] = Encantado;
        neighborhoodXML["EngenheiroLeal"] = EngenheiroLeal;
        neighborhoodXML["EngenhoDaRainha"] = EngenhoDaRainha;
        neighborhoodXML["EngenhoDeDentro"] = EngenhoDeDentro;
        neighborhoodXML["EngenhoNovo"] = EngenhoNovo;
        neighborhoodXML["Estacio"] = Estacio;
        neighborhoodXML["Flamengo"] = Flamengo;
        neighborhoodXML["Freguesia"] = Freguesia;
        neighborhoodXML["FreguesiaJacarepagua"] = FreguesiaJacarepagua;
        neighborhoodXML["Galeao"] = Galeao;
        neighborhoodXML["Gamboa"] = Gamboa;
        neighborhoodXML["GardeniaAzul"] = GardeniaAzul;
        neighborhoodXML["Gavea"] = Gavea;
        neighborhoodXML["Gericino"] = Gericino;
        neighborhoodXML["Gloria"] = Gloria;
        neighborhoodXML["Grajau"] = Grajau;
        neighborhoodXML["Grumari"] = Grumari;
        neighborhoodXML["Guadalupe"] = Guadalupe;
        neighborhoodXML["Guaratiba"] = Guaratiba;
        neighborhoodXML["Higienopolis"] = Higienopolis;
        neighborhoodXML["HonorioGurgel"] = HonorioGurgel;
        neighborhoodXML["Humaita"] = Humaita;
        neighborhoodXML["Inhauma"] = Inhauma;
        neighborhoodXML["Inhoaiba"] = Inhoaiba;
        neighborhoodXML["Ipanema"] = Ipanema;
        neighborhoodXML["Iraja"] = Iraja;
        neighborhoodXML["Itanhanga"] = Itanhanga;
        neighborhoodXML["Jacare"] = Jacare;
        neighborhoodXML["Jacarepagua"] = Jacarepagua;
        neighborhoodXML["Jacarezinho"] = Jacarezinho;
        neighborhoodXML["JardimAmerica"] = JardimAmerica;
        neighborhoodXML["JardimBotanico"] = JardimBotanico;
        neighborhoodXML["JardimCarioca"] = JardimCarioca;
        neighborhoodXML["JardimGuanabara"] = JardimGuanabara;
        neighborhoodXML["JardimSulacap"] = JardimSulacap;
        neighborhoodXML["Joa"] = Joa;
        neighborhoodXML["Lagoa"] = Lagoa;
        neighborhoodXML["Laranjeiras"] = Laranjeiras;
        neighborhoodXML["Leblon"] = Leblon;
        neighborhoodXML["Leme"] = Leme;
        neighborhoodXML["LinsDeVasconcelos"] = LinsDeVasconcelos;
        neighborhoodXML["Madureira"] = Madureira;
        neighborhoodXML["MagalhaesBastos"] = MagalhaesBastos;
        neighborhoodXML["Mangueira"] = Mangueira;
        neighborhoodXML["Manguinhos"] = Manguinhos;
        neighborhoodXML["Maracana"] = Maracana;
        neighborhoodXML["Mare"] = Mare;
        neighborhoodXML["MarechalHermes"] = MarechalHermes;
        neighborhoodXML["MariaDaGraca"] = MariaDaGraca;
        neighborhoodXML["Meier"] = Meier;
        neighborhoodXML["Monero"] = Monero;
        neighborhoodXML["Olaria"] = Olaria;
        neighborhoodXML["OsvaldoCruz"] = OsvaldoCruz;
        neighborhoodXML["Paciencia"] = Paciencia;
        neighborhoodXML["PadreMiguel"] = PadreMiguel;
        neighborhoodXML["Paqueta"] = Paqueta;
        neighborhoodXML["ParadaDeLucas"] = ParadaDeLucas;
        neighborhoodXML["ParqueAnchieta"] = ParqueAnchieta;
        neighborhoodXML["ParqueColumbia"] = ParqueColumbia;
        neighborhoodXML["Pavuna"] = Pavuna;
        neighborhoodXML["Pechincha"] = Pechincha;
        neighborhoodXML["PedraDeGuaratiba"] = PedraDeGuaratiba;
        neighborhoodXML["Penha"] = Penha;
        neighborhoodXML["PenhaCircular"] = PenhaCircular;
        neighborhoodXML["Piedade"] = Piedade;
        neighborhoodXML["Pilares"] = Pilares;
        neighborhoodXML["Pitangueiras"] = Pitangueiras;
        neighborhoodXML["Portuguesa"] = Portuguesa;
        neighborhoodXML["PracaDaBandeira"] = PracaDaBandeira;
        neighborhoodXML["PracaSeca"] = PracaSeca;
        neighborhoodXML["PraiaDaBandeira"] = PraiaDaBandeira;
        neighborhoodXML["QuintinoBocaiuva"] = QuintinoBocaiuva;
        neighborhoodXML["Ramos"] = Ramos;
        neighborhoodXML["Realengo"] = Realengo;
        neighborhoodXML["RecreioDosBandeirantes"] = RecreioDosBandeirantes;
        neighborhoodXML["Riachuelo"] = Riachuelo;
        neighborhoodXML["Ribeira"] = Ribeira;
        neighborhoodXML["RicardoDeAlbuquerque"] = RicardoDeAlbuquerque;
        neighborhoodXML["RioComprido"] = RioComprido;
        neighborhoodXML["Rocha"] = Rocha;
        neighborhoodXML["RochaMiranda"] = RochaMiranda;
        neighborhoodXML["Rocinha"] = Rocinha;
        neighborhoodXML["Sampaio"] = Sampaio;
        neighborhoodXML["SantaCruz"] = SantaCruz;
        neighborhoodXML["SantaTeresa"] = SantaTeresa;
        neighborhoodXML["Santissimo"] = Santissimo;
        neighborhoodXML["SantoCristo"] = SantoCristo;
        neighborhoodXML["SaoConrado"] = SaoConrado;
        neighborhoodXML["SaoCristovao"] = SaoCristovao;
        neighborhoodXML["SaoFranciscoXavier"] = SaoFranciscoXavier;
        neighborhoodXML["Saude"] = Saude;
        neighborhoodXML["SenadorCamara"] = SenadorCamara;
        neighborhoodXML["SenadorVasconcelos"] = SenadorVasconcelos;
        neighborhoodXML["Sepetiba"] = Sepetiba;
        neighborhoodXML["Tanque"] = Tanque;
        neighborhoodXML["Taquara"] = Taquara;
        neighborhoodXML["Taua"] = Taua;
        neighborhoodXML["Tijuca"] = Tijuca;
        neighborhoodXML["TodosOsSantos"] = TodosOsSantos;
        neighborhoodXML["TomasCoelho"] = TomasCoelho;
        neighborhoodXML["Turiacu"] = Turiacu;
        neighborhoodXML["Urca"] = Urca;
        neighborhoodXML["VargemGrande"] = VargemGrande;
        neighborhoodXML["VargemPequena"] = VargemPequena;
        neighborhoodXML["VascoDaGama"] = VascoDaGama;
        neighborhoodXML["VazLobo"] = VazLobo;
        neighborhoodXML["VicenteDeCarvalho"] = VicenteDeCarvalho;
        neighborhoodXML["Vidigal"] = Vidigal;
        neighborhoodXML["VigarioGeral"] = VigarioGeral;
        neighborhoodXML["VilaDaPenha"] = VilaDaPenha;
        neighborhoodXML["VilaIsabel"] = VilaIsabel;
        neighborhoodXML["VilaKosmos"] = VilaKosmos;
        neighborhoodXML["VilaMilitar"] = VilaMilitar;
        neighborhoodXML["VilaValqueire"] = VilaValqueire;
        neighborhoodXML["VistaAlegre"] = VistaAlegre;
        neighborhoodXML["Zumbi"] = Zumbi;
        localStorage.set("neighborhoodXML", JSON.stringify(neighborhoodXML));
    }, function (error) {
        console.error("could not .kml files:", error);
    });

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
