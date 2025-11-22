// Calculator Module - Dual Mode (Normal & Scientific)

class Calculator {
    constructor() {
        this.display = document.getElementById('result');
        this.expressionDisplay = document.getElementById('expression');
        this.memory = 0;
        this.memoryDisplay = document.getElementById('memoryDisplay');
        this.memoryValue = document.getElementById('memoryValue');
        this.currentValue = '0';
        this.expression = '';
        this.isScientificMode = false;
        this.angleMode = 'DEG'; // DEG or RAD
        this.waitingForOperand = false;
        this.pendingOperator = null;
        this.pendingValue = null;
        
        this.init();
    }
    
    init() {
        // Mode toggle
        document.getElementById('modeToggle').addEventListener('click', () => {
            this.toggleMode();
        });
        
        // Angle mode toggle
        document.getElementById('angleToggle').addEventListener('click', () => {
            this.toggleAngleMode();
        });
        
        // Number buttons
        document.querySelectorAll('.btn-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = e.target.dataset.value;
                this.inputDigit(value);
            });
        });
        
        // Operator buttons
        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleOperator(action);
            });
        });
        
        // Memory buttons
        document.querySelectorAll('.btn-memory').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleMemory(action);
            });
        });
        
        // Scientific function buttons
        document.querySelectorAll('.btn-function').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleScientificFunction(action);
            });
        });
        
        // Clear button
        document.querySelector('.btn-clear').addEventListener('click', () => {
            this.clear();
        });
        
        // Equals button
        document.querySelector('.btn-equals').addEventListener('click', () => {
            this.calculate();
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    toggleMode() {
        this.isScientificMode = !this.isScientificMode;
        const scientificPanel = document.getElementById('scientificPanel');
        const modeText = document.getElementById('modeText');
        const angleToggle = document.getElementById('angleToggle');
        
        if (this.isScientificMode) {
            scientificPanel.style.display = 'grid';
            modeText.textContent = 'Normal';
            angleToggle.style.display = 'flex';
        } else {
            scientificPanel.style.display = 'none';
            modeText.textContent = 'Scientific';
            angleToggle.style.display = 'none';
        }
    }
    
    toggleAngleMode() {
        this.angleMode = this.angleMode === 'DEG' ? 'RAD' : 'DEG';
        document.getElementById('angleMode').textContent = this.angleMode;
    }
    
    inputDigit(digit) {
        if (this.waitingForOperand) {
            this.currentValue = String(digit);
            this.waitingForOperand = false;
        } else {
            if (this.currentValue === '0') {
                this.currentValue = String(digit);
            } else if (digit === '.' && this.currentValue.includes('.')) {
                return; // Prevent multiple decimal points
            } else {
                this.currentValue += String(digit);
            }
        }
        this.updateDisplay();
    }
    
    handleOperator(operator) {
        switch (operator) {
            case 'backspace':
                this.backspace();
                break;
            case '%':
                this.percentage();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                this.performOperation(operator);
                break;
        }
    }
    
    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }
    
    percentage() {
        const value = parseFloat(this.currentValue);
        this.currentValue = String(value / 100);
        this.updateDisplay();
    }
    
    performOperation(nextOperator) {
        const inputValue = parseFloat(this.currentValue);
        
        if (this.pendingValue === null) {
            this.pendingValue = inputValue;
        } else if (this.pendingOperator) {
            const result = this.performCalculation(this.pendingValue, inputValue, this.pendingOperator);
            this.currentValue = String(result);
            this.pendingValue = result;
        }
        
        this.waitingForOperand = true;
        this.pendingOperator = nextOperator;
        this.expression = `${this.pendingValue} ${this.getOperatorSymbol(nextOperator)}`;
        this.updateDisplay();
    }
    
    calculate() {
        if (!this.pendingOperator || this.waitingForOperand) {
            return;
        }
        
        const inputValue = parseFloat(this.currentValue);
        const result = this.performCalculation(this.pendingValue, inputValue, this.pendingOperator);
        
        this.currentValue = String(result);
        this.expression = '';
        this.pendingValue = null;
        this.pendingOperator = null;
        this.waitingForOperand = true;
        this.updateDisplay();
    }
    
    performCalculation(firstValue, secondValue, operator) {
        switch (operator) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                if (secondValue === 0) {
                    return 'Error';
                }
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    }
    
    handleMemory(action) {
        const currentNum = parseFloat(this.currentValue);
        
        switch (action) {
            case 'mc':
                this.memory = 0;
                this.memoryDisplay.style.display = 'none';
                break;
            case 'mr':
                this.currentValue = String(this.memory);
                this.waitingForOperand = true;
                break;
            case 'm+':
                this.memory += currentNum;
                this.updateMemoryDisplay();
                break;
            case 'm-':
                this.memory -= currentNum;
                this.updateMemoryDisplay();
                break;
        }
        this.updateDisplay();
    }
    
    updateMemoryDisplay() {
        if (this.memory !== 0) {
            this.memoryDisplay.style.display = 'block';
            this.memoryValue.textContent = this.memory;
        } else {
            this.memoryDisplay.style.display = 'none';
        }
    }
    
    handleScientificFunction(func) {
        const value = parseFloat(this.currentValue);
        let result;
        
        try {
            switch (func) {
                case 'sin':
                    result = Math.sin(this.toRadians(value));
                    break;
                case 'cos':
                    result = Math.cos(this.toRadians(value));
                    break;
                case 'tan':
                    result = Math.tan(this.toRadians(value));
                    break;
                case 'log':
                    result = Math.log10(value);
                    break;
                case 'ln':
                    result = Math.log(value);
                    break;
                case 'sqrt':
                    result = Math.sqrt(value);
                    break;
                case 'square':
                    result = Math.pow(value, 2);
                    break;
                case 'cube':
                    result = Math.pow(value, 3);
                    break;
                case 'power':
                    // For power function, we'll need to get the exponent
                    this.pendingValue = value;
                    this.pendingOperator = 'power';
                    this.waitingForOperand = true;
                    this.expression = `${value} ^`;
                    this.updateDisplay();
                    return;
                case 'exp':
                    result = Math.exp(value);
                    break;
                case 'factorial':
                    result = this.factorial(Math.floor(value));
                    break;
                case 'pi':
                    result = Math.PI;
                    break;
                case 'e':
                    result = Math.E;
                    break;
                case 'inv':
                    result = 1 / value;
                    break;
            }
            
            // Round to avoid floating point errors
            result = Math.round(result * 1e10) / 1e10;
            this.currentValue = String(result);
            this.waitingForOperand = true;
            this.updateDisplay();
        } catch (error) {
            this.currentValue = 'Error';
            this.updateDisplay();
        }
    }
    
    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    toRadians(angle) {
        return this.angleMode === 'DEG' ? (angle * Math.PI) / 180 : angle;
    }
    
    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }
    
    clear() {
        this.currentValue = '0';
        this.expression = '';
        this.pendingValue = null;
        this.pendingOperator = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.display.textContent = this.currentValue;
        this.expressionDisplay.textContent = this.expression;
    }
    
    handleKeyboard(e) {
        // Only handle keyboard when calculator tab is active
        if (!document.getElementById('calculator').classList.contains('active')) {
            return;
        }
        
        e.preventDefault();
        
        const key = e.key;
        
        if (/^[0-9.]$/.test(key)) {
            this.inputDigit(key);
        } else if (key === 'Backspace') {
            this.backspace();
        } else if (key === 'Escape') {
            this.clear();
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (['+', '-', '*', '/'].includes(key)) {
            this.performOperation(key);
        } else if (key === '%') {
            this.percentage();
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
