const http = require('http');

const deal = {
  name: "Enterprise Cloud Migration Deal",
  accountName: "TechCorp India",
  contactName: "Rajesh Sharma",
  amount: 450000,
  stage: "Qualification",
  probability: 10,
  closingDate: "2026-11-20",
  owner: "Aman Kumar",
  type: "New Business",
  leadSource: "Web Form"
};

const data = JSON.stringify(deal);

const options = {
  hostname: '127.0.0.1',
  port: 5005,
  path: '/api/deals',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('RESPONSE:', body);
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
});

req.write(data);
req.end();
