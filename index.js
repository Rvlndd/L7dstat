const express = require('express');
const path = require('path');
const app = express();
const port = 80;

let rcount = {};
const maxpath = 10;

app.use((req, res, next) => {
  const path = req.path;
  rcount[path] = (rcount[path] || 0) + 1;
  next();
});

app.use(express.static(path.join(__dirname, 'asset')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/api/stats', (req, res) => {
  const rvlnd = Object.entries(rcount)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, maxpath);

  const toppath = rvlnd.map(([path, count]) => ({ path, requests: count }));
  
  res.json({
    totalrps: Object.values(rcount).reduce((acc, count) => acc + count, 0),
    toppath: toppath,
  });
});

setInterval(() => {
  rcount = {};
}, 1000);

app.listen(port, () => {
  console.log(`dstat is running. - @Rvlnddddd`);
});
