require "json"
require "i18n"

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

def remove_organization_names(authors)
  authors.select { |author| author.start_with? "VEREADOR" }
end

def generate_laws_by_politician
  laws_simple = JSON.parse(File.read(DATA_PATH + "/projeto-lei-simples-2013-2016-1469923785.json"))
  laws_complementary = JSON.parse(File.read(DATA_PATH + "/projeto-lei-compl-2013-2016-1469923786.json"))
  laws_organic = JSON.parse(File.read(DATA_PATH + "/projeto-lei-org-2013-2016-1469923787.json"))

  laws_by_politician = Hash.new do |hash, key|
    hash[key] = Hash.new { |h, k| h[k] = [] }
  end

  laws_simple.each do |law|
    authors = remove_organization_names(law["author"].split(",")).map { |name| normalize(name) }
    authors.each do |author|
      laws_by_politician[author]["simple"] << law
    end
  end

  laws_complementary.each do |law|
    authors = remove_organization_names(law["author"].split(",")).map { |name| normalize(name) }
    authors.each do |author|
      laws_by_politician[author]["complementary"] << law
    end
  end

  laws_organic.each do |law|
    authors = remove_organization_names(law["author"].split(",")).map { |name| normalize(name) }
    authors.each do |author|
      laws_by_politician[author]["organic"] << law
    end
  end

  File.open("laws_by_politician.json", "w") { |f| f.puts(JSON.pretty_generate(laws_by_politician)) }
end

generate_laws_by_politician
