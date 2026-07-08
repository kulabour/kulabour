fetch('http://localhost:9000/api/tabs/tab_1b2fc902162b9dda/navigate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer kbc_tkn_d521560af34f5bc20b4da7048e6a8334',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ url: 'https://news.ycombinator.com/' })
})
.then(res => res.json())
.then(data => console.log('Navigation Result:', data))
.catch(err => console.error(err));
