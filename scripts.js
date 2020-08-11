class Calculator {
	constructor(history, result) {
		this.history = history;
		this.result = result;
		this.clear();
	}

	clear() {
		this.currentOperand = '';
		this.previousOperand = '';
		this.operation = undefined;
		this.ifReset = false;
	}

	delete() {
		this.currentOperand = this.currentOperand.toString().slice(0, -1);
		if (this.currentOperand === '') {
			this.currentOperand = this.previousOperand;
			this.previousOperand = '';
			this.operation = undefined;
		}
	}

	appendNumber(number) {
		if (number === '.' && this.currentOperand.includes('.')) return;
		this.currentOperand = this.currentOperand.toString() + number.toString();
	}
	checkPercent() {
		if (this.previousOperand !== '' && this.currentOperand !== '') {
			this.currentOperand = this.currentOperand * this.previousOperand / 100;
		} else if (this.currentOperand !== '') {
			this.currentOperand = this.currentOperand / 100;
		} else return;
	}

	chooseOperation(operation) {
		if (this.currentOperand === '') return;
		if (this.currentOperand !== '' && this.previousOperand !== '') this.compute();
		this.operation = operation;
		this.previousOperand = this.currentOperand;
		this.currentOperand = '';
	}
	inverse() {
		if (this.currentOperand === '') return;
		this.currentOperand = -this.currentOperand;
	}

	compute() {
		let computation;
		const prev = parseFloat(this.previousOperand);
		const current = parseFloat(this.currentOperand);
		if (isNaN(prev) || isNaN(current)) return;
		switch (this.operation) {
			case '+':
				computation = prev + current;
				break;

			case '-':
				computation = prev - current;
				break;

			case '*':
				computation = prev * current;
				break;

			case '÷':
				computation = prev / current;
				break;

			default:
				return;
		}
		this.ifReset = true;
		this.currentOperand = computation;
		this.operation = undefined;
		this.previousOperand = '';
	}
	formatNumber(num) {
		let a = num.toString();
		let b = parseFloat(a.split('.')[0]);
		let c = a.split('.')[1];
		let z;
		if (isNaN(b)) {
			z = '';
		} else {
			z = b.toLocaleString('fi-FI', { maximumFractionDigits: 0 });
		}
		if (c != null) {
			return `${z}.${c}`;
		} else {
			return z;
		}
	}

	updateDisplay() {
		this.result.innerText = this.formatNumber(this.currentOperand);
		if (this.operation != null) {
			this.history.innerText = `${this.formatNumber(this.previousOperand)} ${this.operation}`;
		} else {
			this.history.innerText = '';
		}
	}
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const history = document.querySelector('[data-history]');
const result = document.querySelector('[data-result]');
const negative = document.querySelector('[data-negative]');
const percent = document.querySelector('[data-percent]');

const calculator = new Calculator(history, result);

allClearButton.addEventListener('click', () => {
	calculator.clear();
	calculator.updateDisplay();
});

numberButtons.forEach((button) => {
	button.addEventListener('click', () => {
		if (calculator.previousOperand === '' && calculator.currentOperand !== '' && calculator.ifReset) {
			calculator.currentOperand = '';
			calculator.ifReset = false;
		}
		calculator.appendNumber(button.innerText);
		calculator.updateDisplay();
	});
});

operationButtons.forEach((button) => {
	button.addEventListener('click', () => {
		calculator.chooseOperation(button.innerText);
		calculator.updateDisplay();
	});
});

equalsButton.addEventListener('click', (button) => {
	calculator.compute();
	calculator.updateDisplay();
});
percent.addEventListener('click', (button) => {
	calculator.checkPercent();
	calculator.updateDisplay();
});

deleteButton.addEventListener('click', (button) => {
	calculator.delete();
	calculator.updateDisplay();
});
negative.addEventListener('click', (button) => {
	calculator.inverse();
	calculator.updateDisplay();
});
