# city counselors = vereador
require 'harvestman'
require 'json'

class Crawler
  def initialize(name, url)
    @name = name
    @url = url
  end

  def fix_encoding(str)
    str.encode("iso-8859-1").force_encoding("utf-8")
  end

  def url_for_page(page)
    "#{@url}&Start=#{page}"
  end

  def crawl
    puts "- CRAWLING #{@name}"
    projects = self.start_crawling
    File.open("#{@name}-#{DateTime.now.to_time.to_i}.json", "w") do |f|
      f.puts JSON.pretty_generate(projects)
    end
  end

  # TODO: scrape the next url instead of adding 99... we're missing some data at the last page
  def crawl_page(page = 1)
    projects = []
    puts "- crawling URL: #{url_for_page(page)}"
    begin
      Harvestman.crawl url_for_page(page) do
        if !css("h2").empty?
          puts "- END OF CRAWLING"
          return []
        end
        css 'table[cellpadding="2"] tr[valign="top"]' do
          fix_encoding = -> (str) { str.encode("iso-8859-1").force_encoding("utf-8") }
          projects << {
            id: fix_encoding.call(css('a').inner_text),
            url: css('a')[0].attributes['href'].value,
            description: fix_encoding.call(css('font')[1].inner_text),
            date: fix_encoding.call(css('font')[2].inner_text),
            author: fix_encoding.call(css('font')[3].inner_text)
          }
        end
      end
      puts "- SUCCESS: #{projects.count} projects"
      return projects + self.crawl_page(page + 99)
    rescue Exception => msg
      puts "- ERROR: #{msg}"
      return []
    end
  end

  alias start_crawling crawl_page
end

crawlers = []

crawlers << Crawler.new("projeto-lei-simples-2013-2016","http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/LeiInt?OpenForm")
crawlers << Crawler.new("projeto-lei-compl-2013-2016","http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/LeiCompInt?OpenForm")
crawlers << Crawler.new("projeto-lei-org-2013-2016","http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/EmendaInt?OpenForm")
crawlers << Crawler.new("projeto-lei-decr-2013-2016", "http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/DecretoInt?OpenForm")

crawlers.each do |crawler|
  crawler.crawl
end
