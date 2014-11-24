function inject(script) {
	var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL(script);
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head||document.documentElement).appendChild(s);
}
inject('MouseHunt AutoBot.user.js');
inject('MouseHunt AutoBot Additional thing.user.js');