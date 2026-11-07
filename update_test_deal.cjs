const http = require('http');

function updateStage(dealId, newStage, prob) {
  const data = JSON.stringify({ stage: newStage, probability: prob });
  const options = {
    hostname: '127.0.0.1',
    port: 5005,
    path: `/api/deals/${dealId}/stage`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('UPDATE STATUS:', res.statusCode);
      console.log('UPDATE BODY:', body);
    });
  });

  req.on('error', console.error);
  req.write(data);
  req.end();
}

updateStage('deal-1793712426545', 'Needs Analysis', 20);
