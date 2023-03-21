import expres, { json, text, urlencoded } from 'express'
const app = expres();
import cors from 'cors'


app.use(cors())

app.use(json())
app.use(text())


class CivitAiResponse {
  constructor({ response, url }) { 
    if (response) {
      this.headers = response.headers   
    }
    this.url = url

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
      (async function () { 
        const url = req.query.url
        const response = await fetch(url)      
        const filename = new CivitAiResponse({response, url}).getFilename()
        const fileCode = new CivitAiResponse({ url }).getFileCode()
        
        res.send({filename, fileCode}) 
      })()
    } catch (error) {
      console.error(error)
    }          
  ;
})
app.listen(process.env.PORT || 3000)