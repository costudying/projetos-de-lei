require "pry"
require "i18n"
require "json"

I18n.available_locales = [:en]
class String
  def counselorize
    "VEREADOR " + I18n.transliterate(self).upcase
  end
end

str = File.read("parties.txt").split("\n\n")
t = {}; str.each { |s| a=s.split("\n"); t[a.first] = a[1..-1].map(&:counselorize) }
party_for_author = {}; t.each { |k, v| v.each { |name| party_for_author[name] = k } }

# parties = Hash.new do |h, k|
#   h[k] = {
#     comp: Hash.new { |hsh, key| hsh[key] = [] },
#     simp: Hash.new { |hsh, key| hsh[key] = [] },
#     orga: Hash.new { |hsh, key| hsh[key] = [] }
#   }
# end

parties = Hash.new do |h, k|
  h[k] = Hash.new { |hash, key| hash[key] = 0 }
end

authors = JSON.parse(File.read("vereadores.json"))
authors.each do |author, laws|
  party = party_for_author[author]
  comp = laws["projetoleicompl20132016_count"]
  simp = laws["projetoleisimples20132016_count"]
  orga = laws["projetoleiorg20132016_count"]
  parties[party][:comp] += comp.nil? ? 0 : comp
  parties[party][:simp] += simp.nil? ? 0 : simp
  parties[party][:orga] += orga.nil? ? 0 : orga
end

pry
