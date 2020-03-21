const ipc = require('electron').ipcRenderer;

let output = [];

const pcTable = document.querySelector('#table-pc tbody');
const registersTable = [...document.querySelector('#table-registers tbody').children];
const mbrTable = document.querySelector('#table-mbr tbody');
const memTable = document.querySelector('#table-mem tbody');

setUpApp();

function addAnimation(element) {
	element.classList.add('highlight')
	setTimeout(() => element.classList.remove('highlight'), 300);
}

function setUpApp() {
	const exitBtn = document.querySelector('#btn-exit');
	const simBtn = document.querySelector('#btn-sim');

	exitBtn.addEventListener('click', () => ipc.send('exit'))

	simBtn.addEventListener('click', () => {
		simBtn.disabled = true;
		exitBtn.disabled = true;

		let t = setInterval(() => {

			let out = output.splice(0, 13);

			if (out.length === 0) {
				exitBtn.disabled = false;
				return clearInterval(t);
			}
			else {

				let pc = out.splice(0, 1);
				let instr = out.splice(0, 1);
				let registers = out.splice(0, 9);
				let mbr = out.splice(0, 1);
				let mem = out.splice(0, 1);
				addElementsToTables(pc, instr, registers, mbr, mem)
			}
		}, 750);

	});

	// receiving 
	ipc.on('open-sim-window-reply', (even, args) => {
		simBtn.disabled = false;
		output = args;
	});

	function addElementsToTables(pc, instr, registers, mbr, mem) {

		// upating pc values
		pc = pc[0].split(" ")[1];
		instr = instr[0];

		if (pc) {
			// create pc element
			let pcElementTemp = `
				<tr>
					<td id="pc-value">${pc}</td>
					<td id="pc-instr">${instr}</td>
				</tr>
			`

			let newPcElement = document.createElement('TR');
			newPcElement.innerHTML = pcElementTemp;
			pcTable.prepend(newPcElement);
			addAnimation(newPcElement);

			registersTable.forEach((reg, ind) => {
				let register = registers.splice(0, 1)[0].split(" ");
				let binValue = register[1];
				let intValue = register[2];

				if (parseInt(reg.querySelector("#reg-int-value").innerText) !== parseInt(intValue)) {
					reg.innerHTML = `
						<td id="reg-${ind}">r${ind}</td>
						<td id="reg-bin-value">${binValue}</td>
						<td id="reg-int-value">${intValue}</td>
					`
					addAnimation(reg);
				}
			})
		}
	}


}