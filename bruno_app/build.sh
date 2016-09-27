tsc ./app/main.ts -out www/source_code.js
find ./app/views/ -name "*.html.ejs" -type f |xargs  ruby -e "puts ARGV.map{|b| \"#{b} Templates #{b.gsub(/^.*views\//,\"\").gsub(/\..*\$/,\"\")}\"}"| xargs -L 1 ./Parser.rb > ./www/template_code.js
cat ./www/source_code.js ./www/template_code.js > ./www/code.js
cp ./app/index.html ./www/

