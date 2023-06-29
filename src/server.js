'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const PORT = process.env.PORT || 3000
const app = express()
let statCalc
app.use(bodyParser.json({
  limit: '1000MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression())
app.post('/roster', async(req, res)=>{
  try{
    let obj
    if(req?.body) obj = await statCalc.calcRosterStats(req?.body)
    if(obj){
      res.json(obj)
    }else{
      res.sendStatus(500)
    }
  }catch(e){
    res.sendStatus(500)
    console.error(e);
  }
})
module.exports = (statCalcModule)=>{
  try{
    statCalc = statCalcModule
    const server = app.listen(PORT, ()=>{
      console.log('stat server Listening on ', server.address().port)
    })
  }catch(e){
    throw(e);
  }
}
