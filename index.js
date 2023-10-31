import {CHAT} from './chat'
const express = require('express');

const app = express();

app.get('/test',(req,res) =>{
    console.log(req)
})

app.post('/chat', (req, res) => {
    
});

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`服务器正在监听端口号 ${port}`);
});
