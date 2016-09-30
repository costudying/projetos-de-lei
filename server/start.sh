./FileChangeListener.rb "public/templates/" "sh build.sh"  &> /dev/null
pwd | xargs static-http 
