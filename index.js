const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');

// 配置，地址和端口
const config = {
    host: '0.0.0.0',
    port: 3300
}

const app = express();
const csvResult = [];

app.get('/:uid?', async (req, res) => {
    var uid = req.params.uid;
    var utime = new Date().setHours(0,0,0,0);
    var fortuneResult = await getfortune();
    var xb = ((utime/1000 + uid)*2333)%fortuneResult.length;
    
    if(uid && uid!=0) {
        
        res.json(fortuneResult[xb]);
    }
    else res.send('[ERROR]>请填写UID参数http(s)://yourdomain.com:port/uid')
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('[ERROR]>寄掉惹QAQ发生甚么事了');
});

app.listen(config.port, config.host, () => {
    console.log(`启动成功，请访问http://${config.host}:${config.port}`);
});

async function getfortune() {
    return new Promise((res,rej) => {
        fs.createReadStream('./jrystable.csv')
        .pipe(csv())
        .on('data', (data) => csvResult.push(data))
        .on('end', () => {
            res(csvResult);
        });
    })
}
// 浏览器访问http://localhost:3300/1234