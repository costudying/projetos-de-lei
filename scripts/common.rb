# TODO
require "json"
require "i18n"
I18n.available_locales = [:en]

module Common
  DATA_PATH = "../data/"
  def self.load_data filename
    JSON.parse(File.read(DATA_PATH + filename))
  end
end
