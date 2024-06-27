# Ad-Tracker

JS based web crawler built to test and measure the quantity of cookies and scripts a browser instance interacts with on two conditions - one without any sort of ad blocking and one with an ad blocker extension installed and enabled within the instance.

I tested AdBlock Plus but other users may test other ad blockers by doing the following -
1. Installing a different ad blocker chrome extension to their local project directory
2. Editting the adBlockerExtensionPath variable in src/crawler.js to correspond to their new ad blocker
