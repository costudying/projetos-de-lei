./FileChangeListener.rb "public/templates/" "sh build.sh"  &> /dev/null &
cd public
pwd | xargs static-http 
