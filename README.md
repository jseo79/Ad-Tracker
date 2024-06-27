# Ad-Tracker

JS based web crawler built to test and measure the quantity of cookies and scripts a browser instance interacts with on two conditions - one without any sort of ad blocking and one with an ad blocker extension installed and enabled within the instance.

## Prerequisites
Install Latest NodeJS and Google Chrome versions

## Instructions
1. Clone the Repo
2. Open in your preferred IDE
3. Open terminal in the root folder of the project
5. Run `npm install` to install all required packages/modules
6. Run `npm start` to run the program

   
I tested AdBlock Plus, but users may test other ad blockers by doing the following -

1. Installing a different ad blocker chrome extension to their local project directory
2. Editing the adBlockerExtensionPath variable in src/crawler.js to correspond to their new ad blocker

Websites you want to test may also be changed by modifying the urlsToTest in data/urls.json
