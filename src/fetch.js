'use strict'
const path = require('path')
const PRIVATE_DATA_URI = process.env.PRIVATE_GITHUB_REPO_RAW_URL
const fetch = require('node-fetch')
const parseResponse = async(obj)=>{
  try{
    let body
    if (res?.status?.toString().startsWith('2')){
      body = await res?.json()
      if(!body) body = res?.status
    }
    return body
  }catch(e){
    throw(e)
  }
}
module.exports = async(file, method = 'GET', body, headers)=>{
  try{
    let payload = { method: method, compress: true, timeout: 60000 }
    payload.headers = headers || {'Content-Type': 'application/json'}
    if(body){
      payload.body = JSON.stringify(body)
      payload.headers['Content-Type'] = 'application/json'
    }

    let obj = await fetch(path.join(PRIVATE_DATA_URI, file))
    return await parseResponse(obj)
  }catch(e){
    throw(e)
  }
}
