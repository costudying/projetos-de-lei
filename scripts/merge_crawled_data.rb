require "pry"
require "json"
require "fuzzy_match"
require "i18n"

I18n.available_locales = [:en]

def log msg
  puts "[*] #{msg}"
end

def load_json path
  JSON.parse(File.read(path))
end

def normalize author
  I18n.transliterate(author).gsub(".", " ").gsub("'", " ").split(/\s+/).join("_").downcase
end

# def gen_laws_count data_by_author
#   keys = [:org, :comp, :simp]
# end

def gen_author_to_name data_by_author
  authors = data_by_author.keys
end

def main
  politicians = load_json("../data/downloaded/politicians.json")
  log("politicians loaded: #{politicians.count}")

  indications = load_json("../data/crawled/ind-1475244545.json")
  laws_organic = load_json("../data/crawled/org-1475243939.json")
  laws_simple = load_json("../data/crawled/simples-1475243921.json")
  laws_complementary = load_json("../data/crawled/compl-1475243933.json")

  log("indications loaded: #{indications.count}")
  log("organic laws loaded: #{laws_organic.count}")
  log("complementary laws loaded: #{laws_complementary.count}")
  log("simple laws loaded: #{laws_simple.count}")

  data_by_author = Hash.new do |hash, key|
    hash[key] = Hash.new { |h, k| h[k] = [] }
  end

  {ind: indications, org: laws_organic, simp: laws_simple, comp: laws_complementary}.each do |data_name, data_set|
    data_set.each do |entry|
      authors = entry["author"].split(",")
      authors.each do |author|
        if author.start_with? "VEREADOR"
          normalized_author = normalize(author)
          data_by_author[normalized_author][data_name] << entry
        end
      end
    end
  end

  data_by_author.each do |name, data|
    log("politician: #{name}")
    log("\tindications: #{data[:ind].count}")
    log("\torganic laws: #{data[:org].count}")
    log("\tcomplementary laws: #{data[:comp].count}")
    log("\tsimple laws: #{data[:simp].count}")
  end

  binding.pry
end
main
