const express = require('express');
const bodyParser = require('body-parser'); // Middleware to parse JSON bodies

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Parse JSON bodies

app.get('/', (req, res) => {
  res.send('App running...');
});

app.post('/execute', (req, res) => {
  const { code } = req.body;
  let output = [];
  let result = null;

  // Override console.log to capture output
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    output.push(args.join(' '));
    originalConsoleLog.apply(console, args);
  };

  try {
    // Execute the code and capture the result
    result = eval(`
      (() => {
        ${code}
      })()
    `);

    // Restore the original console.log and return the output
    console.log = originalConsoleLog;
    res.send({ result, logs: output.join('\n') });
  } catch (error) {
    // Restore the original console.log in case of error
    console.log = originalConsoleLog;
    res.status(400).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
