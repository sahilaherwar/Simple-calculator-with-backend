let history = [];
const display = document.getElementById("display");

function appendToDisplay(input){
    display.value += input;
}

function clearDisplay(){
    display.value = ""
}

function back() {
    var b = display.value;
    display.value = b.substr(0, b.length - 1);
}


async function calculate() {
    let expression = document.getElementById('display').value;
    let result = evaluateExpression(expression);
    if (expression.includes('%')) {
        const inputs = expression.split('%');
        if (inputs.length === 2) {
            const value = parseFloat(inputs[0]);
            const percentage = parseFloat(inputs[1]);
            if (!isNaN(value) && !isNaN(percentage)) {
                result = (value * percentage) / 100;
            } else {
                alert('Invalid input format. Please enter two numbers separated by % symbol.');
                return;
            }
        } else {
            alert('Invalid input format. Please enter two numbers separated by % symbol.');
            return;
        }
    } else {
        try {
            result = eval(expression);
        } catch (error) {
            alert('Invalid expression.');
            return;
        }
    }
    document.getElementById('display').value = result;
    history.push(expression + ' = ' + result); 

    await fetch('/history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ operation: expression, solution: result })
    });
}

async function addHistory(expression, result) {
    const response = await fetch('/history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expression, result })
    });

    if (!response.ok) {
        throw new Error('Failed to add history');
    }
}

function evaluateExpression(expression) {
    let tokens = expression.split(/([+\-*\/])/);
    let operand1 = parseFloat(tokens[0]);
    let operator = tokens[1];
    let operand2 = parseFloat(tokens[2]);

    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
    }
}

async function updateHistory() {
    try {
        const response = await fetch('/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(history[history.length - 1]) // Send the latest calculation
        });
        if (!response.ok) {
            throw new Error('Failed to update history');
        }
    } catch (error) {
        console.error('Error updating history:', error);
    }
}

async function downloadHistory() {
    const response = await fetch('/history.csv');
    const csv = await response.text();

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'history.csv';
    link.click();
}

function showHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';
    history.forEach(entry => {
        const p = document.createElement('p');
        p.textContent = entry;
        historyDiv.appendChild(p);
    });
    historyDiv.classList.toggle('show');
    history.push({ operation: expression, solution: result });
    updateHistory();
}