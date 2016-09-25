require "json"
require "fuzzy_match"
require "i18n"

I18n.available_locales = [:en]

def normalize(name)
  "VEREADOR " + I18n.transliterate(name).upcase
end

def generate_name_to_id
  indications_by_politician = JSON.parse(File.read("fixed_indications_by_politician.json"))
  laws_by_politician = JSON.parse(File.read("laws_by_politician.json"))
  politicians = JSON.parse(File.read("../dadosVereadores/dados.json"))

  # names in `politicians` are in a different format from those in `indications_by_politician`
  # let's say the ones in `politicians` are the "names" and the other ones are the "ids"
  names = politicians.map { |poli| poli["vereador"] }
  ids = indications_by_politician.keys.concat(laws_by_politician.keys).uniq.select { |id| id.start_with? "VEREADOR" }
  names_to_id = {}

  fuzzy_match = FuzzyMatch.new(ids)
  names.each do |name|
    names_to_id[name] = fuzzy_match.find(normalize(name))
  end

  File.open("name_to_id.json", "w") { |f| f.puts(JSON.pretty_generate(names_to_id)) }
end

generate_name_to_id
