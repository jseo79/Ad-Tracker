function parseEasylist() {
	const fs = require('fs');
	let text = fs.readFileSync('easylist.txt');
	let arr = text.toString().split('\n');
	for (let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].slice(2).slice(0, -1);
	}
	return arr;
}

async function main() {
	parseEasylist();
}

main();
