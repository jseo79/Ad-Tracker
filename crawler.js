const { Builder } = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
const parser = require('./parser');

const trackingScript = parser();

// list of website urls to test for cookies and tracking scripts
let urlToTest = [
	'https://www.cnn.com',
	'https://www.youtube.com',
	'https://www.selenium.dev',
	'https://www.google.com',
	'https://www.tesla.com',
	'https://www.amazon.com',
	'https://www.espn.com',
	'https://www.stockx.com',
];

// extension location for AdBlockPlus
let abp = '--load-extension=/Users/josephseo/Repos/Ad-Tracker/AdBlockPlus';

// async function to count the number of cookies with AdBlockPlus disabled
async function getCookiesWithoutAdBlockPlus() {
	let driver = await new Builder().forBrowser('chrome').build();
	let ckCounter = 0;
	for (let i = 0; i < urlToTest.length; i++) {
		await driver.get(urlToTest[i]);
		await driver.sleep(1000);
		let cookies = await driver.manage().getCookies();
		ckCounter += cookies.length;
		//console.log(cookies);
		//print the domain name of the cookies
		// for (let j = 0; j < cookies.length; j++) {
		// 	console.log(cookies[j].domain);
		// }
	}
	console.log('Number of cookies without AdBlockPlus: ', ckCounter);
	await driver.quit();
}

// async function to count the number of cookies with AdBlockPlus enabled
async function getCookiesWithAdBlockPlus() {
	let options = new chrome.Options();
	options.addArguments(abp);

	let driver = await new Builder()
		.setChromeOptions(options)
		.forBrowser('chrome')
		.build();

	let ckCounter2 = 0;

	await driver.sleep(5000);
	for (let i = 0; i < urlToTest.length; i++) {
		await driver.get(urlToTest[i]);
		await driver.sleep(1000);
		let cookies = await driver.manage().getCookies();
		ckCounter2 += cookies.length;
	}
	console.log('Number of cookies with AdBlockPlus: ', ckCounter2);
	await driver.quit();
}

// async function to track scripts with AdBlockPlus disabled
async function trackScriptWithoutABP() {
	let driver = await new Builder().forBrowser('chrome').build();
	let counter = 0;

	for (let i = 0; i < urlToTest.length; i++) {
		await driver.get(urlToTest[i]);
		await driver.sleep(1000);
		let page = await driver.getPageSource();
		let index = 0;
		while (index < trackingScript.length) {
			let regex = new RegExp(trackingScript[index]);
			if (regex.test(page)) {
				counter++;
				index++;
			} else {
				index++;
			}
		}
	}
	console.log('Number of tracking scripts found without ABP: ', counter);
	await driver.quit();
}

// async function to track scripts with AdBlockPlus enabled
async function trackScriptWithABP() {
	let options = new chrome.Options();
	options.addArguments(abp);
	let driver = await new Builder()
		.setChromeOptions(options)
		.forBrowser('chrome')
		.build();

	let scrCounter = 0; // counter for number of ad scripts blocked
	await driver.sleep(5000);

	for (let i = 0; i < urlToTest.length; i++) {
		await driver.get(urlToTest[i]);
		await driver.sleep(1000);
		let page = await driver.getPageSource();
		let index = 0;
		while (index < trackingScript.length) {
			let regex = new RegExp(trackingScript[index]);
			if (regex.test(page)) {
				scrCounter++;
				index++;
			} else {
				index++;
			}
		}
	}
	console.log('Number of tracking scripts found with ABP: ', scrCounter);
	await driver.quit();
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function main() {
	await getCookiesWithoutAdBlockPlus();
	await sleep(5000);
	await getCookiesWithAdBlockPlus();
	await sleep(5000);
	await trackScriptWithoutABP();
	await sleep(5000);
	await trackScriptWithABP();
}

main().then((r) => console.log('Done'));
