process.env.PWD = process.cwd()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {spawn} = require('child_process');
const args = process.argv.slice(2);
let l;
let parsedList;
let jsonList;
let v;
let profile_path;
const multer = require('multer');
const path = require('path');
const { Console } = require('console');
    console.log(`Arguments : ${args}`);
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, '/home/sudharsan/projects/e-horizon/uploads/');
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname); // Set file name as current timestamp + original file extension    
        }
  });
  
  const upload = multer({ storage: storage });
  app.use(express.static('/home/sudharsan/projects/gui-webchat/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(process.env.PWD + '/public'));


app.get('/public/index.ejs', (req, res) => {

  res.render(__dirname + '/public/index.ejs');
});


app.post('/l',upload.single('image'),(req,res) =>{
  v = req.body.name;
  l=req.body.email;
  if (req.file) {
    console.log('Image uploaded:', req.file);
    profile_path="/profile/"+l.split('.')[0]+".png";
  }
    else{
      console.log('default-image');
      profile_path="profile.png";
    }
  
 
  });

  






app.listen(3002, () => {
  console.log('Server is running on http://localhost:81/public/index.ejs');

  });
 