import express from'express' 
import bodyParser from 'body-parser'
import {CHAT}  from './chat.js'

const app = express();
app.use(bodyParser());

app.get('/test',(req,res) =>{
    //console.log(req)
    res.send("测试成功")
})

app.post('/chat', (req, res) => {
    param = req.body
    CHAT(param,'POST')
    res.send("success")
});

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`服务器正在监听端口号 ${port}`);
});
