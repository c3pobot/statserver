'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const PORT = process.env.PORT || 3000
const app = express()
let server
const statCalc = require('statcalc')
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
app.post('/guild', async(req, res)=>{
  try{
    let obj
    if(req?.body) obj = await statCalc.calcGuildStats(req?.body)
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
app.get('/healthz', (req, res)=>{
  res.sendStatus(204)
})
const setGameData = async(gameData = {})=>{
  try{
    let status = await statCalc.setGameData(gameData.data)
    if(status) console.log('gameData set to '+gameData.version)
    return status
  }catch(e){
    throw(e)
  }
}
const startServer = async(gameData)=>{
  try{
    let status = await setGameData(gameData)
    if(status){
      server = app.listen(PORT, ()=>{
        console.log('stat server Listening on ', server.address().port)
      })
      return status
    }else{
      setTimeout(()=>startServer(gameData), 5000)
    }
  }catch(e){
    console.error(e);
    setTimeout(()=>startServer(gameData), 5000)
  }
}
module.exports.start = startServer
module.exports.setGameData = setGameData
