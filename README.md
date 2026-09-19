# 🛕 TTD Auto Filler

A modern, fast, and secure Chrome Extension designed to automate the process of filling out pilgrim details on the TTD (Tirumala Tirupati Devasthanams) booking portal. 

By saving your details locally in your browser, this extension allows you to bypass the manual typing process during high-traffic ticket booking windows with a single click.

## ✨ Features

* **Modern UI:** A clean, popup interface built with crisp SVG vector icons and smooth hover animations.
* **Privacy First:** Your personal data (including ID numbers) is never sent to any external servers. Everything is stored strictly on your device using `chrome.storage.local`.
* **One-Click Fill:** Injects a floating action button (⚡) directly onto the TTD website for instant form filling.
* **Smart Dropdown Handling:** Automatically detects and selects complex dropdown menus (Gender, ID Type) even if the website experiences slight rendering delays.
* **Multi-Pilgrim Support:** Configurable for the primary user and an optional second pilgrim.

## 📂 Project Structure

* `manifest.json` - The configuration file detailing permissions and extension metadata (Manifest V3).
* `popup.html` - The HTML structure for the extension's configuration menu.
* `popup.css` - The styling for the modern UI interface.
* `popup.js` - Handles saving, clearing, and loading user data to and from local storage.
* `content.js` - The script injected into the TTD website that executes the DOM manipulation and form filling.

## 🚀 Installation (Developer Mode)

Since this extension is not currently published on the Chrome Web Store, you can install it locally:

1. Download or clone this repository to a folder on your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. In the top right corner, toggle **Developer mode** to **ON**.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing your extension files.
6. The TTD Auto Filler icon should now appear in your Chrome toolbar!

## 📖 How to Use

1. **Configure Your Data:** Click the extension icon in your Chrome toolbar. Fill in your general details, address, and pilgrim information (Aadhaar/Passport details).
2. **Save:** Click the **Save** button. You only need to do this once.
3. **Navigate to TTD:** Go to the official TTD booking portal and wait in the queue until you reach the pilgrim details form.
4. **Auto-Fill:** You can fill the form in two ways:
   * Click the floating red lightning bolt button (⚡) on the right side of the webpage.
   * *OR* open the extension popup and click **Auto Fill**.
5. Review the details quickly to ensure accuracy, and proceed to payment.

## ⚠️ Disclaimer & Maintenance

* **Dynamic Selectors:** This extension relies on specific HTML classes (e.g., `.pilDetails_mainContainer__HPFSL`) used by the TTD website. If TTD updates their website architecture, the extension may require an update to the CSS selectors in `content.js`.
* **Fair Use:** This tool is intended strictly for personal use to assist with typing speed. It does not bypass captchas, waiting rooms, or payment gateways. 

---
*Created for personal utility and faster form submissions.*
