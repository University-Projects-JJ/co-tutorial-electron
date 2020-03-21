const ipc = require('electron').ipcRenderer;

const tableRows = document.querySelector('tbody');
let currentSelection;



setUpInstructions();
setUpTable();
setUpApplication();


function generateInstructionHTML(instruction, option) {

	if (option === 'table')
		return `
			<tr>
				<td>${instruction.name}</td>
				<td>
				${instruction.src1}, ${instruction.src2 ? instruction.src2 + ", " : ""} ${instruction.dst}
				</td>
			</tr>
		`;

	const line = instruction.split(" ");
	return `
			<tr>
				<td>${line[0]}</td>
				<td>${line.splice(1).join(" ")}</td>
			</tr>
	`;
}

function setUpInstructions() {

	// instruction select
	const instructionSelectBtn = document.querySelector('#instructionSelect');
	const instructionSelectOptions = [...document.querySelectorAll('.dropdown-item')];
	const clearInstructionBtn = document.querySelector('#btn-i-clear');
	const addInstructionBtn = document.querySelector('#btn-i-add');


	const src1 = document.querySelector('.src-1');
	const src2 = document.querySelector('.src-2');
	const dst = document.querySelector('.dst');

	const r_format = ['add'];
	const i_format = ['addi', 'get'];

	const fields = [src1, src2, dst]

	let firstLoad = true;

	instructionSelectOptions.forEach(opt => {

		opt.addEventListener('click', () => {

			if (firstLoad) {
				fields.forEach(f => {
					f.style.opacity = 1;
					firstLoad = false;
				})
			}

			instructionSelectBtn.textContent = opt.textContent;
			clearFields();

			if (opt.classList.contains('i-format'))
				src2.style.display = 'none';

			if (opt.classList.contains('r-format'))
				src2.style.display = 'block'
		})
	});

	clearInstructionBtn.addEventListener('click', clearFields);
	addInstructionBtn.addEventListener('click', addInstruction)



	function clearFields() {
		fields.forEach(f => f.querySelector('input').value = "")
	}

	function addInstruction() {

		let instruction = {
			name: instructionSelectBtn.textContent.trim() !== "Instruction" ? instructionSelectBtn.textContent.trim() : undefined,
			src1: src1.querySelector('input').value,
			src2: src2.querySelector('input').value ? src2.querySelector('input').value : undefined,
			dst: dst.querySelector('input').value
		}

		let isCorrect = isCorrectInstruction(instruction);
		if (isCorrect === true) {
			instruction = generateInstructionHTML(instruction, 'table');
			tableRows.insertAdjacentHTML("afterbegin", instruction);
			clearFields();
		}
		else
			alert(isCorrect);
	}

	function isCorrectInstruction(instruction) {

		if (!instruction.name)
			return "Please select an instruction";

		if (r_format.includes(instruction.name)) {
			if (!instruction.src1 || !instruction.src2 || !instruction.dst)
				return "Missing register values"

			if (instruction.dst === 'r0')
				return "r0 cannot be a destination register"
		}

		return true;
	}
}

function setUpTable() {
	const removeTableBtn = document.querySelector('#btn-t-remove');
	const clearTableBtn = document.querySelector('#btn-t-clear');


	clearTableBtn.addEventListener('click', clearTable);


	tableRows.addEventListener('click', (e) => {

		const parent = e.target.parentNode;

		if (parent.tagName === 'TR') {
			[...tableRows.querySelectorAll('tr')].forEach(row => row.classList.remove('active'));
			parent.classList.add('active');
			currentSelection = parent;
		}
	})

	removeTableBtn.addEventListener('click', removeRow)

	function clearTable() {
		tableRows.innerHTML = "";
	}

	function removeRow() {
		currentSelection ? currentSelection = currentSelection.remove() : tableRows.firstElementChild.remove();
	}
}

function setUpApplication() {
	const defBtn = document.querySelector('#btn-def');
	const impBtn = document.querySelector('#btn-imp');

	const nextBtn = document.querySelector('#btn-next');
	const exitBtn = document.querySelector('#btn-exit');

	nextBtn.addEventListener('click', () => {
		if (!tableRows.hasChildNodes())
			alert("please add at least 1 instruction")
		else
			ipc.send('open-sim-window', tableRows.innerText.split('\n'));
	})
	exitBtn.addEventListener('click', () => ipc.send('exit'));
	defBtn.addEventListener('click', () => ipc.send('open-file'));
	impBtn.addEventListener('click', () => ipc.send('open-file', 'import'));

	ipc.on('open-file-reply', (event, args) => {
		tableRows.innerHTML = "";
		args.forEach(instr => tableRows.insertAdjacentHTML('afterbegin', generateInstructionHTML(instr)))
	})



}