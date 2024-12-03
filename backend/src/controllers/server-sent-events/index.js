const clients = [];

/**
 * Handle the server-sent events
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const handleSSE = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    clients.splice(clients.indexOf(res), 1);
  });
};

const sendEvent = (event, data) => {
  console.log('Sending event', event);
  console.log('Sending data', data);

  clients.forEach(client => {
    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

module.exports = {
  handleSSE,
  sendEvent,
};