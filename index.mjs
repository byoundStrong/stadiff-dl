import expres from 'express'
const app = expres();
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
    ;
  }
  getFileCode() {
    const splittedUrl = this.url.split('/')
    const fileCode = splittedUrl[splittedUrl.length - 1]

    return fileCode;
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
      
      res.send({filename, fileCode}) 
    })(href)

  } catch (err) {

    const error = JSON.parse(err.message)
    console.log(err.message)
    res.send(error)

  }
            
  
})
app.listen(process.env.PORT || 3000)


// const url = new URL('https://civitai.com/api/download/models/19084')

// console.log(url.pathname)