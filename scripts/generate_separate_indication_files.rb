require "json"
require "i18n"

I18n.available_locales = [:en]

DATA_PATH = "../data"
OUTPUT_PATH = "./indications"

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

def generate_separate_indications_files
  # FIXME: we need to re-generate the indications_by_politician.json file,
  # it's currently not showing any data for VEREADORA LEILA FLAMENGO, even though there
  # is some inside the original indicacoes-2013-2016-1469924392.json file!  
  `mkdir indications`
  name_to_id = JSON.parse(File.read("name_to_id.json"))
  politicians = name_to_id.values
  indications_by_politician = JSON.parse(File.read(DATA_PATH + "/indications_by_politician.json"))
  politicians.each do |name|
    indications = indications_by_politician[name]
    if indications.nil?
      puts "Politician #{name} has no indications!"
      indications = []
    end
    filename = normalize(name).split(" ").join("_") + ".json"
    File.open(OUTPUT_PATH + "/" + filename, "w") { |f| f.puts(JSON.generate(indications)) }
  end
end

generate_separate_indications_files
