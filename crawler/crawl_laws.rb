# city counselors = vereador
require "harvestman"
require "json"

class Crawler
  DATA_OUTPUT_PATH = "data"

  def log(msg)
    puts msg
    File.open(@name + ".log", "a") { |f| f.puts("[#{DateTime.now.to_s}] #{msg}") }
  end

  def initialize(name, url)
    @name = name
    @url = url

    if File.exists? temp_json_path(@name)
      @temp = load_json(temp_json_path(@name))
    else
      @temp = {
        "last_successfully_crawled_url" => nil,
        "crawled_data_by_url" => {}
      }
      save_json(temp_json_path(@name), @temp)
    end
  end

  def temp_json_path(name)
    File.join(DATA_OUTPUT_PATH, name + ".temp.json")
  end

  def fix_encoding(str)
    str.encode("iso-8859-1").force_encoding("utf-8")
  end

  def url_for_page(page)
    "#{@url}&Start=#{page}"
  end

  def save_json(name, obj)
    File.open(name, "w") { |f| f.puts(JSON.pretty_generate(obj)) }
  end

  def load_json(name)
    JSON.parse(File.read(name))
  end

  def crawl
    log "- CRAWLING #{@name}"
    projects = if @temp["last_successfully_crawled_url"].nil?
      self.start_crawling
    else
      self.start_crawling(url: @temp["last_successfully_crawled_url"])
    end
    path = File.join(DATA_OUTPUT_PATH, "#{@name}-#{DateTime.now.to_time.to_i}.json")
    Dir.mkdir(DATA_OUTPUT_PATH) unless Dir.exists? DATA_OUTPUT_PATH
    File.open(path, "w") do |f|
      f.puts JSON.pretty_generate(projects)
    end
  end

  def crawl_page(opts)
    url = if opts[:page]
      url_for_page(opts[:page])
    elsif opts[:url]
      opts[:url]
    else
      url_for_page(1)
      # raise ArgumentError, "Need to specify either 'page' or 'url' option."
    end
    projects = []
    log "- crawling URL: #{url}"
    begin
      next_page_url = Harvestman.crawl url do
        if !css("h2").empty?
          log "- END OF CRAWLING"
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

        # This didn't work once because of this page:
        # http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/LeiInt?OpenForm&Start=2375
        # The next link was broken (actually pointing to the same URL, and the next URLs were empty "No Documents Found")
        next_page_link = css("map:nth-of-type(2) > area:nth-child(4)").first
        path = next_page_link.attributes["href"].value
        current_uri.scheme + "://" + File.join(current_uri.host, path)
      end
      @temp["last_successfully_crawled_url"] = url
      @temp["crawled_data_by_url"][url] = projects
      save_json(temp_json_path(@name), @temp)
      log "- SUCCESS: #{projects.count} projects"
      if next_page_url === url
        log "- WARNING! Next URL is the same: #{next_page_url}"
        log "- sleeping for 5min..."
        sleep(5 * 60)
      else
        log "- next URL is OK: #{next_page_url}"
        log "- sleeping for 30sec..."
        sleep(30)
      end
      return projects + self.crawl_page({url: next_page_url})
    rescue Exception => msg
      log "- ERROR: #{msg}"
        log "- sleeping for 30sec..."
      sleep(30)
      return []
    end
  end

  alias start_crawling crawl_page
end

[
  Crawler.new("simples","http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/LeiInt?OpenForm"),
  # Crawler.new("compl","http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/LeiCompInt?OpenForm"),
  # Crawler.new("org","http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/EmendaInt?OpenForm"),
    # Crawler.new("projeto-lei-decr-2013-2016", "http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/DecretoInt?OpenForm"),
    # Crawler.new("projeto-lei-resol-2013-2016", "http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/ResolucaoInt?OpenForm"),
  # Crawler.new("ind", "http://mail.camara.rj.gov.br/APL/Legislativos/scpro1316.nsf/Internet/IndInt?OpenForm")
].each do |crawler|
  crawler.crawl
end
