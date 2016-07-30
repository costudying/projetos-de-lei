# city counselors = vereador
require 'harvestman'
require 'json'

def fix_encoding(str)
  str.encode("iso-8859-1").force_encoding("utf-8")
end

def url_for_page(page)
  "http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/LeiInt?OpenForm&Start=#{page}"
end

# TODO: scrape the next url instead of adding 99... we're missing some data at the last page

def scrape(num)
  projects = []
  puts "- crawling URL: #{url_for_page(num)}"
  begin
    Harvestman.crawl url_for_page(num) do
      if !css("h2").empty?
        puts "- END OF CRAWLING"
        return []
      end
      css 'table[cellpadding="2"] tr[valign="top"]' do
        projects << {
          id: fix_encoding(css('a').inner_text),
          url: css('a')[0].attributes['href'].value,
          description: fix_encoding(css('font')[1].inner_text),
          date: fix_encoding(css('font')[2].inner_text),
          author: fix_encoding(css('font')[3].inner_text)
        }
      end
    end
    puts "- SUCCESS: #{projects.count} projects"
    return projects + scrape(num + 99)
  rescue Exception => msg
    puts "- ERROR: #{msg}"
    return []
  end
end

all_projects = scrape(1)

File.open("law-projects-#{DateTime.now.to_time.to_i}.json", "w") do |f|
  f.puts JSON.pretty_generate(all_projects)
end
