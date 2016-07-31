require "pry"
require "json"
# require "unicode_utils/upcase"
require "I18n"

I18n.available_locales = [:en]
def sanitize(str)
  I18n.transliterate(str).upcase
end

def load_neighborhoods(filename)
  neighborhoods = []
  text = File.read(filename)
  text.each_line do |line|
    neighborhoods << sanitize(line).upcase
  end
  neighborhoods
end

neighborhoods = load_neighborhoods("neighborhoods.txt")

def load_neighborhoods_aliases(filename)
  aliases = {}
  text = File.read(filename)
  text.each_line do |line|
    str = sanitize(line).upcase
    child, parents_str = str.split("=>")
    parents = parents_str.split(/,| E |,E /)
    aliases[child.strip] = parents.map(&:strip)
  end
  aliases
end

aliases = load_neighborhoods_aliases("neighborhoods_alias.txt")

class Parser
  attr :result, :errors

  def initialize(filename)
    @data = JSON.parse(File.read("indicacoes-2013-2016-1469924392.json"))
    @@results = []
    @@errors = []
    @@neighborhoods = load_neighborhoods("neighborhoods.txt")
    @@aliases = load_neighborhoods_aliases("neighborhoods_alias.txt")
  end

  def load_neighborhoods(filename)
    neighborhoods = []
    text = File.read(filename)
    text.each_line do |line|
      neighborhoods << sanitize(line).upcase
    end
    neighborhoods
  end

  def load_neighborhoods_aliases(filename)
    aliases = {}
    text = File.read(filename)
    text.each_line do |line|
      str = sanitize(line).upcase
      child, parents_str = str.split("=>")
      parents = parents_str.split(/,| E |,E /)
      aliases[child.strip] = parents.map(&:strip)
    end
    aliases
  end

  def parse_address(descr)
    # m = /(?<= NA|NO|AO LONGO DA|EXTENSÃO DA)(.*)(?==>)/.match(descr)
    # if m.nil?
    #   "ERROR"
    # else
    #   m[0]
    # end
    @@neighborhoods.each do |neigh|
      neigh.
    end
  end

  def parse
    @data.each do |data|
      out = parse_address(data["description"])
      if out != "ERROR"
        @@results << {
          in: data["description"].strip,
          out: out.strip
        }
      else
        @@errors << data["description"]
      end
    end
  end

  def print_results
    File.open("addr.txt", "w") do |f|
      f.puts "RESULTS #{@@results.count} | ERRORS #{@@errors.count} | TOTAL #{@data.count}"
      f.puts @@errors.join("\n")
      f.puts "\n\nRESULTS" + ("#" * 20)
      f.puts @@results.map { |r| "#{r[:in]}\n#{r[:out]}\n"}.join("\n")
    end
  end
end

# data = JSON.parse(File.read("indicacoes-2013-2016-1469924392.json")).map do |d|
#   d.merge({"address" => parse_address(d["description"]).strip})
# end

parser = Parser.new("indicacoes-2013-2016-1469924392.json")
parser.parse
# parser.print_results

pry
