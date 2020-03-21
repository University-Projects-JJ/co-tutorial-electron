const fs = require('fs');
const path = require('path');

const { exec } = require('child_process');

class FileHandler {

	static saveToFile(instructions) {
		fs.writeFileSync(path.join(__dirname, '/assets/java/input.txt'), instructions.join('\n'));
	}

	static readTextFile(filePath) {
		return filePath ? fs.readFileSync(filePath, 'utf-8').split('\n') :
			fs.readFileSync(path.join(__dirname, '/assets/java/default.txt'), 'utf-8').split("\n");
	}

	static runJavaProgram() {
		const programPath = path.join(__dirname, '/assets/java/program.java');

		exec(`javac ${programPath} && java ${programPath}`, (err, stdout, stderr) => {
			if (err)
				console.log(err);
			console.log(stdout, stderr);
		});
	}
}


module.exports = FileHandler;