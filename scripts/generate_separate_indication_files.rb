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
  indications_by_politician = JSON.parse(File.read(DATA_PATH + "/indications_by_politician.json"))
  indications_by_politician.each do |name, indications|
    filename = normalize(name).split(" ").join("_") + ".json"
    File.open(OUTPUT_PATH + "/" + filename, "w") { |f| f.puts(JSON.generate(indications)) }
  end
end

generate_separate_indications_files
