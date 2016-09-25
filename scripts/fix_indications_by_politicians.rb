require "json"
require "i18n"
require "pry"

I18n.available_locales = [:en]

DATA_PATH = "../data"

def normalize(name)
  I18n.transliterate(name).split(/\s+/).map do |word|
    if word.match(/^DR\.[^\s]/)
      word.gsub("DR.", "DR. ")
    elsif word.match(/^PROF\.[^\s]/)
      word.gsub("PROF.", "PROF. ")
    elsif word.match(/^K\.[^\s]/)
      word.gsub("K.", "K. ")
    elsif word === "S.O.S."
      "SOS"
    else
      word
    end
  end.join(" ")
end

# conserta o nome do das chaves no arquivo `indications_by_politician.json`
# normalizando para bater com as chaves do `laws_by_politician.json`
def fix_indications_by_politician
  indications_by_politician = JSON.parse(File.read(DATA_PATH + "/indications_by_politician.json"))
  fixed_indications_by_politician = {}
  indications_by_politician.each_key do |name|
    normalized_name = normalize(name)
    fixed_indications_by_politician[normalized_name] = indications_by_politician[name]
  end
  File.open("fixed_indications_by_politician.json", "w") { |f| f.puts(JSON.pretty_generate(fixed_indications_by_politician)) }
end

fix_indications_by_politician
