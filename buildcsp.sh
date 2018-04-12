#!/bin/bash
set -e
build_folder="build/es6-bundled";
build_folder_src="build/es6-bundled/src"
fh_app="fh-stundenplan-app"
echo "start csp build!"
echo "//blob" > "src/$fh_app/fh-stundenplan-app-tmp.js"
polymer build
echo "now running crisper:"
./node_modules/.bin/crisper --source "$build_folder_src/$fh_app/fh-stundenplan-app.html" --html "$build_folder_src/$fh_app/fh-stundenplan-app.html" --js "$build_folder_src/$fh_app/fh-stundenplan-app.js" 
rm "src/$fh_app/fh-stundenplan-app-tmp.js"
rm "$build_folder_src/$fh_app/fh-stundenplan-app-tmp.js"
sed "s/fh-stundenplan-app-tmp.js/fh-stundenplan-app.js/" "$build_folder/service-worker.js" > "$build_folder/service-worker-tmp.js" 
mv "$build_folder/service-worker-tmp.js" "$build_folder/service-worker.js"

echo "done"


