const fs = require('fs');
const path = require('path');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const parseEasylist = require('./parser');
const trackingScript = parseEasylist();

const urls = JSON.parse(fs.readFileSync('data/urls.json'));
const urlsToTest = urls.urlsToTest;

const resultsDir = path.join(__dirname, '../results');
if (!fs.existsSync(resultsDir)) {
	fs.mkdirSync(resultsDir);
}

// Extension location for AdBlockPlus
let adBlockerExtensionPath =
	'--load-extension=/Users/josephseo/Repos/Ad-Tracker/AdBlockPlus';

// Function to count cookies with AdBlockPlus disabled
async function getCookiesWithoutAdBlockPlus() {
	let driver = await new Builder().forBrowser('chrome').build();
	let cookieCounter = 0;
	let cookiesList = [];

	try {
		for (let url of urlsToTest) {
			await driver.get(url);
			await driver.sleep(1000);
			let cookies = await driver.manage().getCookies();
			cookieCounter += cookies.length;
			cookies.forEach((cookie) => cookiesList.push(cookie.name));
		}
		fs.writeFileSync(
			path.join(resultsDir, 'cookies_without_adblock.txt'),
			`Number of cookies: ${cookieCounter}\n${cookiesList.join('\n')}`
		);
		console.log('Number of cookies without AdBlockPlus:', cookieCounter);
	} finally {
		await driver.quit();
	}
}

// Function to count cookies with AdBlockPlus enabled
async function getCookiesWithAdBlockPlus() {
	let options = new chrome.Options();
	options.addArguments(adBlockerExtensionPath);

	let driver = await new Builder()
		.setChromeOptions(options)
		.forBrowser('chrome')
		.build();
	let cookieCounter = 0;
	let cookiesList = [];

	try {
		await driver.sleep(1000);
		for (let url of urlsToTest) {
			await driver.get(url);
			await driver.sleep(1000);
			let cookies = await driver.manage().getCookies();
			cookieCounter += cookies.length;
			cookies.forEach((cookie) => cookiesList.push(cookie.name));
		}
		fs.writeFileSync(
			path.join(resultsDir, 'cookies_with_adblock.txt'),
			`Number of cookies: ${cookieCounter}\n${cookiesList.join('\n')}`
		);
		console.log('Number of cookies with AdBlockPlus:', cookieCounter);
	} finally {
		await driver.quit();
	}
}

// Function to track scripts with AdBlockPlus disabled
async function getScriptsWithoutAdBlockPlus() {
	let driver = await new Builder().forBrowser('chrome').build();
	let scriptCounter = 0;
	let scriptsList = [];

	try {
		for (let url of urlsToTest) {
			await driver.get(url);
			await driver.sleep(1000);
			let pageSource = await driver.getPageSource();
			for (let script of trackingScript) {
				let regex = new RegExp(script);
				if (regex.test(pageSource)) {
					scriptsList.push(script);
					scriptCounter++;
				}
			}
		}
		fs.writeFileSync(
			path.join(resultsDir, 'scripts_without_adblock.txt'),
			`Number of tracking scripts: ${scriptCounter}\n${scriptsList.join(
				'\n'
			)}`
		);
		console.log(
			'Number of tracking scripts found without AdBlockPlus:',
			scriptCounter
		);
	} finally {
		await driver.quit();
	}
}

// Function to track scripts with AdBlockPlus enabled
async function getScriptsWithAdBlockPlus() {
	let options = new chrome.Options();
	options.addArguments(adBlockerExtensionPath);

	let driver = await new Builder()
		.setChromeOptions(options)
		.forBrowser('chrome')
		.build();
	let scriptCounter = 0;
	let scriptsList = [];

	try {
		await driver.sleep(1000);
		for (let url of urlsToTest) {
			await driver.get(url);
			await driver.sleep(1000);
			let pageSource = await driver.getPageSource();
			for (let script of trackingScript) {
				let regex = new RegExp(script);
				if (regex.test(pageSource)) {
					scriptsList.push(script);
					scriptCounter++;
				}
			}
		}
		fs.writeFileSync(
			path.join(resultsDir, 'scripts_with_adblock.txt'),
			`Number of tracking scripts: ${scriptCounter}\n${scriptsList.join(
				'\n'
			)}`
		);
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
	await sleep(1000);
	await getCookiesWithAdBlockPlus();
	await sleep(1000);
	await getScriptsWithoutAdBlockPlus();
	await sleep(1000);
	await getScriptsWithAdBlockPlus();
}

main()
	.then(() => console.log('Done'))
	.catch((err) => console.error(err));
