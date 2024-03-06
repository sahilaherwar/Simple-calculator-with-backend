const express = require('express');
const app = express();
const port = 3000;

let history = [];

app.use(express.static('public'));
app.use(express.json());

app.get('/history', (req, res) => {
    res.json(history);
});

app.post('/history', (req, res) => {
    const entry = req.body;
    console.log('Received history entry:', entry); 
    history.push(entry);
    console.log('Updated history:', history);
    res.sendStatus(201);
});
app.get('/history.csv', (req, res) => {
    let csv = '';
    csv += 'operation,solution\n'; 
    history.forEach(entry => {
        csv += `${entry.operation},${entry.solution}\n`; 
    });
    res.set('Content-Type', 'text/csv');
    res.set('Content-Disposition', 'attachment; filename="history.csv"');
    res.send(csv);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
