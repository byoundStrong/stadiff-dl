import express from 'express'
const app = express();

import cors from 'cors'
app.use(cors())

class CivitAiResponse {
  constructor({ response, url }) { 
    if (response) {
      this.headers = response.headers   
    }
    if (url) {
      this.url = url 
    }
   

  }
  getFilename() {
    return this.headers
      .get('content-disposition')
      .split(';')
      .find(n => n.includes('filename='))
      .replace('filename=', '')
      .trim()
      .replaceAll('"','')
    
  }
  getFileCode() {
    const splittedUrl = this.url.split('/')
    return splittedUrl[splittedUrl.length - 1]
  }
  getFileExtension() { 
    const splittedUrl = this.headers
    .get('content-disposition')
    .split(';')
    .find(n => n.includes('filename='))
    .replace('filename=', '')
    .trim()
    .replaceAll('"','')
    .split('.')
    
    return splittedUrl[splittedUrl.length - 1]      

  }
}


app.get('/civitai/getDetails', (req, res) => {
  try {
      const params = req.query;
      if (Object.keys(params).length === 0 && params.constructor === Object) {
        throw new Error(JSON.stringify({
          name:'invalid url parameter',
          message: "url Parameters must be 'url'"
        })) 
      
      }

      const newUrl = new URL(params.url)
    const href = newUrl.href
    
      if (newUrl.hostname !== 'civitai.com') { 
        throw new Error(JSON.stringify({
          name:'invalid url hostname',
          message: "only accept 'civitai.com'"
        })) 
    }
    
    (async function (endp) {    
      const response = await fetch(endp)       
      const filename = new CivitAiResponse({response}).getFilename()
      const fileCode = new CivitAiResponse({ url:endp }).getFileCode()
      const fileExtension = new CivitAiResponse({ response }).getFileExtension()
      
      res.send({filename, fileCode, fileExtension}) 
    })(href)

  } catch (err) {

    const error = JSON.parse(err.message)
    console.log(err.message)
    res.send(error)

  }
            
  
})
app.listen(process.env.PORT || 3000)

