require "harvestman"
require "pry"

def main
  target_url = "http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/IndInt?OpenForm&Start=10528"
  Harvestman.crawl(target_url) do
    binding.pry
  end
end
main
