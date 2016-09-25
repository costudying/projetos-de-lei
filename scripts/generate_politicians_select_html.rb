require 'json'
require 'pry'

def parse_party(url)
  url.split('/').last.gsub('.jpg', '').upcase
end

def main
  politicians = JSON.parse(File.read("../dadosVereadores/dados.json"))
  name_to_id = JSON.parse(File.read("name_to_id.json"))
  data_by_id = {}
  html = politicians.map do |politician|
    name = politician["vereador"]
    id = name_to_id[name]
    party = parse_party(politician["partido"]).strip
    phone = politician["sala"].strip
    email = politician["telefone"].strip
    data_by_id[id] = {name: name, party: party, phone: phone, email: email}
    # "<option value=\"#{id}\" data-phone=\"#{phone}\" data-email=\"#{email}\" data-party=\"#{party}\">#{name}</option>"
    "<option value=\"#{id}\">#{name}</option>"
  end
  puts html
  puts '-'*50
  puts JSON.pretty_generate(data_by_id)
end
main
