const express = require("express")

const app = express()

let port = process.env.PORT || 3000

const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/home.html'))
})

app.use('/users', router)

app.listen(port, () => {
    console.log("listening on " + port)
})