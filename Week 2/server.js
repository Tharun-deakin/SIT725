const express = require('express');
const app = express();
const port = 3000;

// Middleware to serve static files (HTML, JS, etc.)
app.use(express.static('public'));

// Generic operation handler
function calculate(op, a, b) {
    switch (op) {
        case 'add': return a + b;
        case 'subtract': return a - b;
        case 'multiply': return a * b;
        case 'divide':
            if (b === 0) return null;
            return a / b;
        default: return null;
    }
}

// Add operation endpoints
app.get('/api/:operation', (req, res) => {
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    const operation = req.params.operation;

    if (isNaN(a) || isNaN(b)) {
        return res.status(400).json({ error: 'Invalid input numbers' });
    }

    const result = calculate(operation, a, b);

    if (result === null) {
        return res.status(400).json({ error: 'Invalid operation or division by zero' });
    }

    res.json({
        result,
        operands: { a, b },
        operation
    });
});

// Start server
app.listen(port, () => {
    console.log(` Server running at http://localhost:${port} ⁠`)
});