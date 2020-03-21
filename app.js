const electron = require('electron');

const { app, BrowserWindow, ipcMain: ipc, dialog } = electron;
const path = require('path');

const fileHandler = require('./fileHandler');

let appWindow;
const _width = 1400, _height = 785

app.on("ready", () => {

	// create a new app window
	appWindow = new BrowserWindow({

		webPreferences: {
			nodeIntegration: true
		},
		resizable: false,
		width: _width,
		height: _height
	});

	loadWindow('instrWin');
	app.show();


	setUpCommunication();
});

function setUpCommunication() {
	ipc.on('exit', () => app.quit());

	ipc.on('open-sim-window', (event, args) => {
		console.log(args);
		fileHandler.saveToFile(args);
		fileHandler.runJavaProgram();

		loadWindow('simWindow', _width, 900);

		setTimeout(() => {
			event.sender.send('open-sim-window-reply', fileHandler.readTextFile(path.join(__dirname, '/assets/java/output.txt')))
		}, 1000);

	});

	ipc.on('open-file', (event, args) => {

		if (!args)
			return event.sender.send('open-file-reply', fileHandler.readTextFile());

		const filePaths = dialog.showOpenDialogSync({
			filters: [{
				name: "text",
				extensions: "txt"
			}]
		});

		return filePaths ? event.sender.send('open-file-reply', fileHandler.readTextFile(filePaths[0])) : 0
	})
}


function loadWindow(htmlName, width = _width, height = _height) {
	appWindow.loadURL(`file://${__dirname}/views/${htmlName}.html`);
	appWindow.setSize(width, height)
}

