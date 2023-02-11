const resultField = document.querySelector('.result');

const buttons = document.querySelectorAll('button');

const buttonNumbers = document.querySelectorAll('.number');
const buttonOperations = document.querySelectorAll('.operation');

const buttonDelete = document.querySelector('.delete');
const buttonClear = document.querySelector('.clear');
const buttonEqual = document.querySelector('.equal');


let isOperation = false;

function clear() {
    resultField.value = '';
    isOperation = false;
}

function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function division(a, b) {
    if(!b) {
        isOperation = false;
        return NaN;
    };
    return a / b;
}

function factorial(a) {
    if(!a) return 0;
    let total = 1;
    for(let i = a; i > 0; i--) {
        total *= i;
    }
    return total;
}

function pow(a, b) {
    return a ** b;
}

function compute(a, operator, b) {
    switch(operator) {
        case '+':
            return add(a, b);
        case '-':
            return sub(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return division(a, b);
        case '^':
            return pow(a, b);
        default:
            return;
    }
}

function computeTotal() {
    if(!isOperation) return;

    let arr = resultField.value.split(' ');
    let result;

    while(arr.length > 1) {
        console.log(parseFloat(arr[0]), arr[1], parseFloat(arr[2]));
        result = compute(parseFloat(arr[0]), arr[1], parseFloat(arr[2]));
        arr.splice(0, 3);
        arr.unshift(result);
    }
    if(result >= 10**12) {
        resultField.value = parseFloat(result).toExponential(2);
    } else {
        resultField.value = Math.round(arr[0] * 100) / 100;
    }
}

function checkDot() {
    let dotIndex = resultField.value.split('').reverse().indexOf('.');
    let operationIndex = resultField.value.split('').reverse().indexOf(' ');

    if(operationIndex === -1 && dotIndex > -1) return false;
    if(operationIndex !== -1 && dotIndex < operationIndex) {
        return false;
    }
    return true;
}

function checkMinus() {
    const lastElem = resultField.value[resultField.value.length - 1]
    if(!isNaN(lastElem) && lastElem !== ' ') return;
    let minusIndex = resultField.value.split('').reverse().indexOf('-');
    let operationIndex = resultField.value.split('').reverse().indexOf(' ');
    
    if(operationIndex === -1 && minusIndex > -1) return false;
    if(operationIndex !== -1 && minusIndex < operationIndex) {
        return false;
    }
    return true;
}

function removeTransition(e) {
    if(e.propertyName !== 'transform') return;
    this.classList.remove('clicked');
}

for(const button of buttons) {
    button.addEventListener('click', function() {
        this.classList.add('clicked');
    });
    button.addEventListener('transitionend', removeTransition);
}

for(const button of buttonNumbers) {
    if(!button.hasAttribute('id')) {
        button.setAttribute('id', `id-${button.textContent}`);
    }
    
    button.addEventListener('click', function(){

        if(this.textContent === '-x') {
            if(!checkMinus()) return;
            resultField.value += '-';
        } else if(this.textContent === '.') {
            if(!checkDot()) return;
            resultField.value += '.';
        } else {
            resultField.value += parseFloat(this.textContent);
            isOperation = true;
        }
    });
}

for(const button of buttonOperations) {
    button.addEventListener('click', function(){
        if (!isOperation) return;
        resultField.value += ` ${this.textContent} `;
        isOperation = false;
    });
}

buttonDelete.addEventListener('click', function() {
    if(!resultField.value.length) return;

    const lastElem = resultField.value[resultField.value.length - 1];
    if(lastElem === ' ') {
        resultField.value = resultField.value.slice(0, -3);
    } else {
        resultField.value = resultField.value.slice(0, -1);
    }

    if(resultField.value.length) {
        isOperation = (resultField.value[resultField.value.length - 1] !== ' ');
    } else {
        isOperation = false;
    }
});

buttonClear.addEventListener('click', clear);

buttonEqual.addEventListener('click', computeTotal);

document.addEventListener("keydown", function(event) {
    
    key = event.key;
    console.log(key);

    const e = new Event('click');

    if(key === '.') document.querySelector(`#dot`).dispatchEvent(e);
    else if(key === '+') document.querySelector(`#plus`).dispatchEvent(e);
    else if(key === '-') document.querySelector(`#minus`).dispatchEvent(e);
    else if(key === '*') document.querySelector(`#multiply`).dispatchEvent(e);
    else if(key === '/') document.querySelector(`#divide`).dispatchEvent(e);
    else if(key === '^') document.querySelector(`#exp`).dispatchEvent(e);
    else if(key === '_') document.querySelector(`#negative`).dispatchEvent(e);
    else if(key === 'Backspace') document.querySelector(`#Backspace`).dispatchEvent(e);
    else if(key === 'Enter') document.querySelector(`#Enter`).dispatchEvent(e);
    else if(!isNaN(key)) document.querySelector(`#id-${key}`).dispatchEvent(e);

});