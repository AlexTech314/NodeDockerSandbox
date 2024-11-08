const express = require('express');
const bodyParser = require('body-parser');
const vm = require('vm');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/execute', (req, res) => {
  const { code } = req.body;
  let logs = [];
  let result;

  // Custom console.log to capture logs
  const customConsole = {
    log: (...args) => {
      logs.push(args.join(' '));
    }
  };

  // Define the context with our custom console
  const context = { console: customConsole };
  vm.createContext(context); // Create a new VM context

  try {
    // Run the code directly without wrapping in a function
    result = new vm.Script(`(() => { ${code} })()`).runInContext(context, { timeout: 10000 });
    
    // Return both logs and the result
    res.send({ result, logs: logs.join('\n') });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
