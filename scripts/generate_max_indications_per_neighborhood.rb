require "json"

DATA_PATH = "../data"

def convert_to_kml_names(ind_name)
  ind_name.split('+').map do |word|
    word.split(' ').join('')
  end.map do |word|
    if (word === "GARDENIA")
      "GARDENIAAZUL"
    elsif (word === "LAPA")
      "CENTRO"
    elsif (word === "ILHADOGOVERNADOR")
      "GALEAO"
    elsif (word === "OSWALDOCRUZ")
      "OSVALDOCRUZ"
    elsif (word === "QUINTINO")
      "QUINTINOBOCAIUVA"
    elsif (word === "SULACAP")
      "JARDIMSULACAP"
    else
      word
    end
  end
end

def generate_max_indications_per_neighborhood
  indications_by_politician = JSON.parse(File.read(DATA_PATH + "/indications_by_politician.json"))
  max_indications_per_neighborhood = Hash.new { |hash, key| hash[key] = 0 }
  indications_by_politician.each do |poli, indications|
    count_per_neighborhood = Hash.new { |hash, key| hash[key] = 0 }
    indications.each do |ind|
      neighborhood_kml_names = convert_to_kml_names(ind["neighborhood"])
      neighborhood_kml_names.each do |kml_name|
        count_per_neighborhood[ kml_name ] += 1
      end
    end
    count_per_neighborhood.each do |kml_name, count|
      if count > max_indications_per_neighborhood[kml_name]
        max_indications_per_neighborhood[kml_name] = count
      end
    end
  end
  File.open("max_indications_per_neighborhood.json", "w") { |f| f.puts(JSON.pretty_generate(max_indications_per_neighborhood)) }
end
generate_max_indications_per_neighborhood
