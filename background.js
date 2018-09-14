/*****************************************************\
 *  Chrome OS Public Sessions - Idle Screen Blanker  *  
\*****************************************************/
const timeout = 1 * 15;
lastTab = undefined;
tab = undefined;

/*
chrome.tabs.query({ url: 'https://chrome.google.com/webstore/*' }, function (tabs) {
	console.log(tabs);
	if (tabs.length > 0) {
		chrome.tabs.update(tabs[0].id, { active: true, highlighted: true }, function (current_tab) {
			current_tab.title = 'WEBSTORE';
			chrome.windows.update(current_tab.windowId, { focused: true });
		});
	} else {
		chrome.tabs.create({ url: (hash !== undefined) ? options_url + '#' + hash : options_url });
	}
});
*/

chrome.idle.setDetectionInterval(timeout);

chrome.idle.onStateChanged.addListener(function (newState) {
	console.log(new Date(), newState);
	if (newState === 'active') {
		if (tab) {
			console.log('remove tab');
			chrome.windows.update(tab.windowId, { state:'maximized' }, function() {
				chrome.tabs.remove(tab.id, function() {
					tab = undefined;
					if (lastTab) {
						chrome.windows.update(lastTab.windowId, { focused: true });
						chrome.tabs.update(lastTab.id, { active: true, highlighted: true });
						lastTab = undefined;
					}
				});
			});
		}
	}
	if (newState === 'idle') {
		chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
			lastTab = (tabs.length > 0) ? tabs[0] : undefined;
			if (!tab) {
				console.log('create tab');
				chrome.tabs.create({url:chrome.extension.getURL("blank.html")} , function(t) {
					tab = t;
					chrome.windows.update(tab.windowId, { state:'fullscreen' });
				});
			}
			});
	}
});
