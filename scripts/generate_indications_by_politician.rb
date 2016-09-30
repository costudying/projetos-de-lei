require "pry"
require "json"
require "unicode_utils/upcase"
require "I18n"
require_relative "./common"

I18n.available_locales = [:en]
def sanitize(str)
  I18n.transliterate(str).upcase
end

class Parser
  attr :result, :errors, :neighborhoods, :aliases

  def initialize
    @data = JSON.parse(File.read("vereadores.json"))
    @results = []
    @errors = []
    @neighborhoods = load_neighborhoods("neighborhoods.txt")
    @aliases = load_neighborhoods_aliases("neighborhoods_alias.txt")
    # mispelling
    @aliases["CAMPO GRADE"] = ["CAMPO GRANDE"]
    @aliases["CAMPO GRADNE"] = ["CAMPO GRANDE"]
    @aliases["PACIENICA"] = ["PACIENCIA"]
    @aliases["BRAZ DE PINA"] = ["BRAS DE PINA"]
    @aliases["SENADOR  VASCONCELOS"] = ["SENADOR VASCONCELOS"]
    @aliases["SENADOR VANSCONCELOS"] = ["SENADOR VASCONCELOS"]
    @aliases["CAROBINHA"] = ["SANTISSIMO"]
    @aliases["SANTA TEREZA"] = ["SANTA TERESA"]
  end

  def load_neighborhoods(filename)
    neighborhoods = []
    text = File.read(filename)
    text.each_line do |line|
      neighborhoods << sanitize(line).upcase.strip
    end
    neighborhoods
    # binding.pry
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
    text = sanitize(descr)
    @neighborhoods.each do |neigh|
      if text.include? neigh
        return neigh
      end
    end
    @aliases.keys.each do |neigh|
      if text.include? neigh
        return @aliases[neigh].join("+")
      end
    end
    return "ERROR"
  end

  def parse
    @indications = Hash.new { |hash, key| hash[key] = [] }
    @data.map do |counselor_name, counselor_data|
      unless counselor_data["indicacoes20132016"].nil?
        counselor_data["indicacoes20132016"].each do |indication|
          neighborhood = parse_address(indication["descr"]).strip
          if neighborhood != "ERROR"
            @results << {in: indication["descr"].strip, out: neighborhood}
            @indications[counselor_name] << {
              neighborhood: neighborhood,
              date: indication["date"]
            }
          else
            @errors << indication["descr"]
          end
        end
      end
    end
    # @data.each do |data|
    #   out = parse_address(data["description"])
    #   if out != "ERROR"
    #     @results << {
    #       in: data["description"].strip,
    #       out: out.strip
    #     }
    #   else
    #     @errors << data["description"]
    #   end
    # end
  end

  def print_results
    File.open("addr.txt", "w") do |f|
      f.puts "RESULTS #{@results.count} | ERRORS #{@errors.count} | TOTAL #{@data.count}"
      f.puts @errors.join("\n")
      f.puts "\n\nRESULTS" + ("#" * 20)
      f.puts @results.map { |r| "#{r[:in]}\n#{r[:out]}\n"}.join("\n")
    end
    File.open("indications.json", "w") do |f|
      f.puts JSON.pretty_generate(@indications)
    end
  end
end

def generate_indications_by_politicians
  indications_data = Common.load_data("indicacoes-2013-2016-1469924392.json")
  # indications_data.each do |data|
  # end
  binding.pry
end
generate_indications_by_politicians
