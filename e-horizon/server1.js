const port = 81;
const express = require('express');
const bodyParser = require('body-parser'); 
const app = express();
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const ejs = require('ejs');
const { MongoClient } = require('mongodb');
const {spawn} = require('child_process');

const file1 = require('./message');
const { NONAME } = require('dns');
let parsedList;

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379, });

  redisClient.connect().catch(console.error);
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'eren139', 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 
    }
  }));

  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  let db;
  

  client.connect()
    .then(() => {
      db = client.db('student');
      console.log('Connected successfully to MongoDB');
      app.listen(port, () => {
        console.log(`App is running on port ${port}`);
      });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
  
 


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

var user_name,email;



app.get('/', (req, res) => {
    res.render('index'); 
});

app.post('/l',async (req, res) => {
    user_name = req.body.name;
    email = req.body.email;
    try {
            const collection = db.collection('main');
            const data = await collection.find({"name":user_name,"dob":email}).toArray();
            if(data.length==1){
              req.session.data={
                username:user_name,
                email:email
                };
                console.log("user-Authenticated:");
                console.log(req.session.data);
                if( (user_name=="admin")&&(email=="2024-03-13"))
                {
                  res.sendFile(__dirname+"/views/admin.html");
                }
                else{
                res.redirect('/home');}
            }

            
            else{
              console.log(email);
              res.send("you are not authenticated");}      
        }

   catch (error) {
            console.error('Database operation error:', error);
            res.status(500).send('Internal Server Error');
      }

    
});

app.get("/home",(req,res)=>{
    if(req.session.data==undefined)
   {
   console.log("Un-Authenticated user");
   res.render('index'); 
  }
else{

    res.render('home.ejs',{name:user_name});
}
})

app.get('/message',async(req,res)=>{
  
  if(req.session.data==undefined)
  {
  console.log("Un-Authenticated user");
  res.render('index'); 
}
else{
  try {
    const result = await runPythonScript();
    console.log(result);
    parsedList=result;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  res.render(__dirname + '/views/1.ejs',{ parsedList,name:user_name+email,email:email,profile:undefined});

  
}

});
file1.someFunction();

app.get("/payment",(req,res)=>{
  res.sendFile(__dirname +'/views/depay.html');
});

//for main-bus details
app.get("/admin-bus",async(req,res)=>{

if(req.session.data.username=="admin")
{
  try {
    const collection = db.collection('busdetails');
    const data = await collection.find().toArray();
    if(data.length>=1){
     var a=[];
       for(let i=0;i<data.length;i++)
       {
          a.push(data[i]['busno']);
       }
        
       console.log(a);
       res.json(a);
    }
     
}

catch (error) {
    console.error('Database operation error:', error);
    res.status(500).send('Internal Server Error');
}
}

});

//for bus-sub
app.get("/bus/:id",(req,res)=>{
  const id = req.params.id;
  res.render('bus-sub.ejs',{bus_no:id});

});



app.get("/bus-no/:id",async(req,res)=>{
  const id = req.params.id;

  if(req.session.data.username=="admin")
  {
    try {
      const collection = db.collection('busdetails');
      const data = await collection.find({"busno":id}).toArray();
      
         
         res.json(data);
      
       
  }
  
  catch (error) {
      console.error('Database operation error:', error);
      res.status(500).send('Internal Server Error');
  }
  }


});

app.get("/student-bus/:id",async(req,res)=>{


  const id = req.params.id;

  if(req.session.data.username=="admin")
  {
    try {
      const collection = db.collection('main');
      const data = await collection.find({"bus-no":id},{ projection: { _id: 0, 'name': 1,'stopping':1,'allowed':1} }).toArray();
      
         
         res.json(data);
      
       
  }
  
  catch (error) {
      console.error('Database operation error:', error);
      res.status(500).send('Internal Server Error');
  }
  }


});


app.get("/profile/:id",async(req,res)=>{
  const id = req.params.id;
  var a1,a2,a3,a4,a5,a6,a7;
  if((req.session.data.username=="admin")||(user_name==req.session.data.username))
  {
    try {
      const collection = db.collection('main');
      const data = await collection.find({"name":id}).toArray();
      if(data.length==1)
      {
        a1=(data[0]['name']); 
        a2=data[0]['dob'];
        a3=data[0]['bus-no'];
        a4=data[0]["validity"];
        a5=data[0]["expire"];
        a6=data[0]['stopping'];
        if(a7==true)
        {
          a7="payed";
        }
        else{
          a7="not-payed";
        }
        
      }
         res.render("profile.ejs",{name:id,dob:a2,bus:a3,expire:a5,stopping:a6,allowed:a7});
      
       
  }
  
  catch (error) {
      console.error('Database operation error:', error);
      res.status(500).send('Internal Server Error');
  }
  }
});

app.post('/payment-form',async(req,res)=>{
  console.log(req.body);
  const filter = {
    "bus-no": req.body.bus_no,
    "name": req.body.rollno,
    "dob": req.body.dob
};

const updateDocument = {
    $set: {
        'validity':req.body.current_date,
        'expire':req.body.expiry_date,
        'allowed':true
    }
};
  try {
    const collection = db.collection('main');
    const data = await collection.find({"bus-no":req.body.bus_no,"name":req.body.rollno,"dob":req.body.dob}).toArray();
    console.log(data);
    if (data.length == 1) {
      if (data[0].allowed) {
          try {
            const resul = await collection.updateOne(filter, updateDocument);
            const data = await collection.find({"bus-no":req.body.bus_no,"name":req.body.rollno,"dob":req.body.dob}).toArray();
              const result = await generate(JSON.stringify(data[0]));
              console.log(result);
              parsedList = result;
              
          } catch (error) {
              res.status(500).json({ error: error.message });
          }
          var img_src='qr/'+req.body.rollno+".png";
          res.render('paymnet_success.ejs',{src:img_src,name:req.body.rollno});
      } else {
          res.send("you already paid");
      }
  } else {
      res.send("your information is invalid");
  }
  
    
     
}

catch (error) {
    console.error('Database operation error:', error);
    res.status(500).send('Internal Server Error');
}
});

function generate(a)
{
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('bash', ['-c', `"source /home/sudharsan/myenv/bin/activate && python3 /home/sudharsan/projects/e-horizon/gen.py ${a}"`], { shell: true });
    let dataBuffer = '';

    pythonProcess.stdout.on('data', (data) => {
      dataBuffer += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const parsedData = JSON.parse(dataBuffer);
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Error parsing JSON: ${error.message}`));
        }
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(new Error(`stderr: ${data}`));
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to spawn Python process: ${error.message}`));
    });
  });
}


function runPythonScript() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('bash', ['-c', `"source /home/sudharsan/myenv/bin/activate && python3 /home/sudharsan/projects/e-horizon/script.py "`], { shell: true });
    let dataBuffer = '';

    pythonProcess.stdout.on('data', (data) => {
      dataBuffer += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const parsedData = JSON.parse(dataBuffer);
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Error parsing JSON: ${error.message}`));
        }
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(new Error(`stderr: ${data}`));
    });

    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to spawn Python process: ${error.message}`));
    });
  });
}
