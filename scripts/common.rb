# TODO
require "json"
require "i18n"
I18n.available_locales = [:en]

module Common
  DATA_PATH = "../data"
  def load_data filename
    JSON.parse(File.read(filename))
  end
end
