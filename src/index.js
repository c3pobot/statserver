'use strict'
const PRIVATE_DATA_URI = process.env.PRIVATE_GITHUB_REPO_RAW_URL
const statCalc = require('statcalc')
const fetch = require('./fetch')
let gameVersion
const server = require('./server')
const Start = async()=>{
  try{
    let obj = await fetch('gameData.json')
    if(obj?.data){
      await statCalc.setGameData(obj.data)
      console.log('gameData set to version '+obj.version+'...')
      server(statCalc)
      StartSync()
    }else{
      setTimeout(Start, 5000)
    }
  }catch(e){
    console.error(e);
    setTimeout(Start, 5000)
  }
}
const StartSync = async()=>{
  try{
    let versions = await fetch('version.json')
    if(versions?.gameVersion && versions?.gameVersion !=== gameVersion) await GetNewData()
    setTimeout(StartSync, 5 * 60 * 1000)
  }catch(e){
    console.error(e);
    setTimeout(StartSync, 5000)
  }
}
const GetNewData = (gameVersion) =>{
  try{
    let obj = await fetch('gameData.json')
    if(obj?.data && obj?.version && obj?.version === gameVersion){
      gameVersion = obj.version
      await statCalc.setGameData(obj.data)
      console.log('gameData set to version '+obj.version+'...')
    }
  }catch(e){
    throw(e)
  }
}
Start()
