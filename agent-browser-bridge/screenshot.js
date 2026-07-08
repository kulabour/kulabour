const fs = require('fs');

fetch('http://localhost:9000/api/tabs/tab_1b2fc902162b9dda/screenshot', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer kbc_tkn_d521560af34f5bc20b4da7048e6a8334'
  }
})
.then(res => {
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.arrayBuffer();
})
.then(buffer => {
  fs.writeFileSync('C:\\Users\\JADAV ANIL\\.gemini\\antigravity\\brain\\e67291aa-44f7-4ded-8741-a4a859104a00\\hackernews_screenshot.png', Buffer.from(buffer));
  console.log('Screenshot saved successfully!');
})
.catch(err => console.error(err));
