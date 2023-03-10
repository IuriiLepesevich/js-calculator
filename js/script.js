const resultField = document.querySelector('.result');

const buttons = document.querySelectorAll('button');

const buttonNumbers = document.querySelectorAll('.number');
const buttonOperations = document.querySelectorAll('.operation');

const buttonDelete = document.querySelector('.delete');
const buttonClear = document.querySelector('.clear');
const buttonEqual = document.querySelector('.equal');

let isOperation = false;
let isNumber = false;
let isDot = false;

const importance = {
    '^': 1,
    '*': 2,
    '/': 2,
    '+': 3,
    '-': 3,
}

function clear() {
    resultField.value = '';
    isOperation = false;
    isNumber = false;
    isDot = false;
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

    for(let i = 1; i < 4; i++) {
        let operators = [];
        for(property in importance) {
            if(importance[property] === i) operators.push(property);
        }
        const isOperator = (elem) => operators.includes(elem);
        while(arr.findIndex(isOperator) !== -1) {
            let index = arr.findIndex(isOperator);
            result = compute(parseFloat(arr[index - 1]), arr[index], parseFloat(arr[index + 1]));
            arr.splice(index - 1, 3, result);
        }
    }

    if(result >= 10**12) {
        resultField.value = parseFloat(result).toExponential(2);
    } else {
        resultField.value = Math.round(arr[0] * 10000) / 10000;
    }
}

function checkDot() {
    const dotIndex = resultField.value.split('').reverse().indexOf('.');
    const operationIndex = resultField.value.split('').reverse().indexOf(' ');

    if(((operationIndex !== -1 && dotIndex < operationIndex) || 
    (operationIndex === -1)) && dotIndex !== -1) {
        return false;
    }
    isDot = true;
    return true;
}

function operateNumber(number) {
    isOperation = true;
    const lastElem = resultField.value[resultField.value.length - 1];
    
    if(lastElem === '0' && number === '0' && !isNumber && !isDot) return;
    if(lastElem === '0' && number !== '0' && !isNumber && !isDot) {
        isNumber = true;
        resultField.value = resultField.value.slice(0, -1) + parseFloat(number);
        return;
    }
    if(number !== '0') isNumber = true;
    resultField.value += parseFloat(number);
}

function operateMinus() {
    if(resultField.value[resultField.value.length - 1] === '-') {
        let arr = resultField.value.split('');
        arr.pop();
        resultField.value = arr.join('');
        return;
    }
    let arr;
    if(resultField.value.indexOf(' ') === -1) {
        arr = Array(resultField.value);
    } else {
        arr = resultField.value.split(' ');
    }
    const length = arr.length;
    if(!isNaN(arr[length - 1]) && arr[length - 1]) {
        arr[length - 1] = parseFloat(arr[length - 1] * -1);
        resultField.value = arr.join(' ');
        return;
    };
    
    resultField.value += '-';
    return;
}

function removeTransition(e) {
    if(e.propertyName !== 'transform') return;
    this.classList.remove('clicked');
}

function activate(selector, event) {
    const elem = document.querySelector(selector);
    const timeout = parseFloat(window.getComputedStyle(elem)
                    .transitionDuration) * 1000;
    
    elem.dispatchEvent(event);
    elem.classList.add('clicked');

    setTimeout(() => {
        elem.classList.remove('clicked');
    }, timeout);
}



for(const button of buttonNumbers) {
    if(!button.hasAttribute('id')) {
        button.setAttribute('id', `id-${button.textContent}`);
    }
    
    button.addEventListener('click', function(){

        text = this.textContent;
        if(text === '-x') {
            operateMinus();
        } else if(text === '.') {
            if(!checkDot()) return;
            resultField.value += '.';
        } else {
            operateNumber(text);
        }
    });
}

for(const button of buttonOperations) {
    button.addEventListener('click', function(){
        if (!isOperation) return;
        resultField.value += ` ${this.textContent} `;
        isOperation = false;
        isNumber = false;
        isDot = false;
    });
}

buttonDelete.addEventListener('click', function() {
    if(!resultField.value.length) return;

    const lastElemBefore = resultField.value[resultField.value.length - 1];

    if(isNaN(lastElemBefore) && lastElemBefore !== ' ' && lastElemBefore !== '.') {
        clear();
        return;
    }
    if(lastElemBefore === ' ') {
        resultField.value = resultField.value.slice(0, -3);
    } else {
        resultField.value = resultField.value.slice(0, -1);
    }

    const lastElemAfter = resultField.value[resultField.value.length - 1];

    if(resultField.value.length) {
        isOperation = (lastElemAfter !== ' ' && lastElemAfter !== '.');
        if(lastElemAfter === '0') {
            const dotIndex = resultField.value.split('').reverse().indexOf('.');
            const numberIndex = resultField.value.split('').reverse().join('').search(/[1-9]+/i);
            if(numberIndex < dotIndex && dotIndex !== -1) isDot = true;
        }
        if(lastElemAfter === ' ') {
            isOperation = false;
            isDot = false;
            isNumber = false;
        }
    } else {
        isOperation = false;
        isNumber = false;
        isDot = false;
    }
});

buttonClear.addEventListener('click', clear);

buttonEqual.addEventListener('click', computeTotal);

document.addEventListener("keydown", function(event) {
    
    key = event.key;
    const e = new Event('click');

    if(key === '.') activate(`#dot`, e);
    else if(key === '+') activate(`#plus`, e);
    else if(key === '-') activate(`#minus`, e);
    else if(key === '*') activate(`#multiply`, e);
    else if(key === '/') activate(`#divide`, e);
    else if(key === '^') activate(`#exp`, e);
    else if(key === '_') activate(`#negative`, e);
    else if(key === 'Backspace') activate(`#Backspace`, e);
    else if(key === 'Enter') activate(`#Enter`, e);
    else if(!isNaN(key)) activate(`#id-${key}`, e);

});