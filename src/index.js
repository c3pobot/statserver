'use strict'
const PRIVATE_DATA_URI = process.env.PRIVATE_GITHUB_REPO_RAW_URL
const fetch = require('./fetch')
let gameVersion
const server = require('./server')
const Start = async()=>{
  try{
    let obj = await fetch('gameData.json')
    if(obj?.data && obj?.version){
      let status = await server.start(obj)
      if(status) gameVersion = obj.version
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
    let versions = await fetch('versions.json')
    if(versions?.gameVersion && versions?.gameVersion !== gameVersion) await GetNewData(versions?.gameVersion)
    setTimeout(StartSync, 5 * 60 * 1000)
  }catch(e){
    console.error(e);
    setTimeout(StartSync, 5000)
  }
}
const GetNewData = async(version) =>{
  try{
    let obj = await fetch('gameData.json')
    if(obj?.data && obj?.version && obj?.version === version){
      let status = await server.setGameData(obj)
      if(status) gameVersion = obj.version
    }
  }catch(e){
    throw(e)
  }
}
Start()
