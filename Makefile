CHROME ?= /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
SRC := store-assets/src
OUT := store-assets
SHOT = "$(CHROME)" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
	--force-device-scale-factor=1 --virtual-time-budget=2000

.PHONY: zip store-assets site clean

# Package the extension for upload to the Chrome Web Store.
zip:
	rm -f cors-toggle.zip
	cd extension && zip -qr ../cors-toggle.zip . -x "*.svg" -x ".*"
	@echo "Wrote cors-toggle.zip"

# Render the store images from the HTML sources (they embed the real options page).
store-assets:
	$(SHOT) --window-size=1280,800 --screenshot=$(OUT)/screenshot-1-on-1280x800.png $(SRC)/screenshot-1-on.html
	$(SHOT) --window-size=1280,800 --screenshot=$(OUT)/screenshot-2-off-1280x800.png $(SRC)/screenshot-2-off.html
	$(SHOT) --window-size=1280,800 --screenshot=$(OUT)/screenshot-3-console-1280x800.png $(SRC)/screenshot-3-console.html
	$(SHOT) --window-size=440,280 --screenshot=$(OUT)/promo-small-440x280.png $(SRC)/promo-small.html
	$(SHOT) --window-size=1400,560 --screenshot=$(OUT)/promo-marquee-1400x560.png $(SRC)/promo-marquee.html

# Copy the images the landing page uses into site/.
site: store-assets
	mkdir -p site/assets
	cp $(OUT)/screenshot-1-on-1280x800.png $(OUT)/screenshot-3-console-1280x800.png site/assets/
	cp extension/icons/icon-on-128.png extension/icons/icon-on-32.png site/assets/

clean:
	rm -f cors-toggle.zip
