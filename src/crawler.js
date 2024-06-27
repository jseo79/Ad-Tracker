const fs = require('fs');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const parseEasylist = require('./parser');

const trackingScript = parseEasylist();

const urls = JSON.parse(fs.readFileSync('data/urls.json'));
const urlsToTest = urls.urlsToTest;

// Extension location for AdBlockPlus
let adBlockPlusPath =
	'--load-extension=/Users/josephseo/Repos/Ad-Tracker/AdBlockPlus';

// Function to count cookies with AdBlockPlus disabled
async function getCookiesWithoutAdBlockPlus() {
	let driver = await new Builder().forBrowser('chrome').build();
	let cookieCounter = 0;

	try {
		for (let url of urlsToTest) {
			await driver.get(url);
			await driver.sleep(1000);
			let cookies = await driver.manage().getCookies();
			cookieCounter += cookies.length;
			// cookies.forEach((cookie) => console.log(`- ${cookie.name}`));
		}
		console.log('Number of cookies without AdBlockPlus:', cookieCounter);
	} finally {
		await driver.quit();
	}
}

// Function to count cookies with AdBlockPlus enabled
async function getCookiesWithAdBlockPlus() {
	let options = new chrome.Options();
	options.addArguments(adBlockPlusPath);

	let driver = await new Builder()
		.setChromeOptions(options)
		.forBrowser('chrome')
		.build();
	let cookieCounter = 0;

	try {
		await driver.sleep(5000);
		for (let url of urlsToTest) {
			await driver.get(url);
			await driver.sleep(1000);
			let cookies = await driver.manage().getCookies();
			cookieCounter += cookies.length;
		}
		console.log('Number of cookies with AdBlockPlus:', cookieCounter);
	} finally {
		await driver.quit();
	}
}

// Function to track scripts with AdBlockPlus disabled
async function trackScriptsWithoutAdBlockPlus() {
	let driver = await new Builder().forBrowser('chrome').build();
	let scriptCounter = 0;

	try {
		for (let url of urlsToTest) {
			await driver.get(url);
			await driver.sleep(1000);
			let pageSource = await driver.getPageSource();
			for (let script of trackingScript) {
				let regex = new RegExp(script);
				if (regex.test(pageSource)) {
					scriptCounter++;
				}
			}
		}
		console.log(
			'Number of tracking scripts found without AdBlockPlus:',
			scriptCounter
		);
	} finally {
		await driver.quit();
	}
}

// Function to track scripts with AdBlockPlus enabled
async function trackScriptsWithAdBlockPlus() {
	let options = new chrome.Options();
	options.addArguments(adBlockPlusPath);

	let driver = await new Builder()
		.setChromeOptions(options)
		.forBrowser('chrome')
		.build();
	let scriptCounter = 0;

	try {
		await driver.sleep(5000);
		for (let url of urlsToTest) {
			await driver.get(url);
			await driver.sleep(1000);
			let pageSource = await driver.getPageSource();
			for (let script of trackingScript) {
				let regex = new RegExp(script);
				if (regex.test(pageSource)) {
					scriptCounter++;
				}
			}
		}
		console.log(
			'Number of tracking scripts found with AdBlockPlus:',
			scriptCounter
		);
	} finally {
		await driver.quit();
	}
}

// Helper function to introduce delays
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function main() {
	await getCookiesWithoutAdBlockPlus();
	await sleep(5000);
	await getCookiesWithAdBlockPlus();
	await sleep(5000);
	await trackScriptsWithoutAdBlockPlus();
	await sleep(5000);
	await trackScriptsWithAdBlockPlus();
}

main()
	.then(() => console.log('Done'))
	.catch((err) => console.error(err));
