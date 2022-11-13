npx uglifyjs-folder dist --pattern "**/*.js" -eo mini -x .js;
npx uglifyjs-folder dist --pattern "**/*.mjs" -eo mini -x .mjs;
npx uglifyjs-folder dist --pattern "**/*.cjs" -eo mini -x .cjs;
cp -r src/static mini;
cp -r src/public mini;