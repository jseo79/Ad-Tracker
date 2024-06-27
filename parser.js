const fs = require('fs');

function parser() {
	let text = fs.readFileSync('easylist.txt');
	let arr = text.toString().split('\n');
	for (let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].slice(2).slice(0, -1);
	}
	return arr;
}

module.exports = parser;
