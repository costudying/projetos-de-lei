require "json"
require "pry"
require "I18n"

I18n.available_locales = [:en]
def sanitize(str)
  I18n.transliterate(str).upcase
end

db = Hash.new { |hsh, key| hsh[key] = {} }

def load(filename)
  data = JSON.parse(File.read(filename))

  laws = Hash.new { |hsh, key| hsh[key] = [] }
  data.each do |d|
    d["author"].split(",").map { |name| sanitize(name) }.each do |author|
      laws[author] << {
        id: d["id"],
        url: d["url"],
        descr: d["description"],
        date: d["date"]
      }
    end
  end
  return laws
end

# load("projeto-lei-simples-2013-2016-1469923785.json").each do |author, laws|
#   db[author][:laws] = laws
#   db[author][:laws_count] = laws.count
# end
#
# load("projeto-lei-simples-2013-2016-1469923785.json").each do |author, laws|
#   db[author][:laws] = laws
#   db[author][:laws_count] = laws.count
# end

`ls *.json`.split("\n").each do |fname|
  name = fname.split("-")[0..-2].join
  load(fname).each do |author, laws|
    db[author][name.to_sym] = laws
    db[author][(name + "_count").to_sym] = laws.count
  end
end

File.open("vereadores.json", "w") { |f|
  f.puts JSON.pretty_generate(db) 
}

pry
