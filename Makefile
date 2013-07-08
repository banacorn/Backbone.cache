compile:
	stylus --include test/client/stylesheets --include node_modules/nib/lib --out test/client/stylesheets test/client/stylesheets/style.styl
	# node node_modules/requirejs-preprocessor/main.js --compile

watch: 
	make -j stylus

go:
	node test/server/app.js

stylus:
	stylus -c --include test/client/stylesheets --include node_modules/nib/lib --out test/client/stylesheets --watch test/client/stylesheets/style.styl

.PHONY: build watch compile