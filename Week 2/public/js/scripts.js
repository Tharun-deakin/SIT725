document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculateBtn').addEventListener('click', calculate);

    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculate();
        }
    });
});

async function calculate() {
    console.log("🟢 Calculate button clicked!");

    const num1 = document.getElementById('num1').value;
    const num2 = document.getElementById('num2').value;
    const operation = document.getElementById('operation').value;
    const resultDiv = document.getElementById('result');

    if (!num1 || !num2) {
        resultDiv.innerHTML = '<p style="color:red;">Please enter both numbers</p>';
        return;
    }

    try {
        const response = await fetch(⁠ /api/${operation}?a=${num1}&b=${num2} ⁠);
        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = ⁠ <p><strong>Result:</strong> ${data.result}</p> ⁠;
        } else {
            resultDiv.innerHTML = ⁠ <p style="color:red;">Error: ${data.error}</p> ⁠;
        }
    } catch (err) {
        resultDiv.innerHTML = ⁠ <p style="color:red;">Network error: ${err.message}</p> ⁠;
    }
}