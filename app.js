const express = require('express');
const path =require('path');
const bodyParser=require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage =require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride=require('method-override');



const app =express();

//meddle ware
app.use(bodyParser.json());
app.use(methodOverride('_method'))

//Mongoo Uri

const mongoURI='mongodb+srv://basu_12:basu12@cluster0-auzs2.mongodb.net/mongoUploads?retryWrites=true&w=majority';

//connection 
const conn=mongoose.createConnection(mongoURI);

//init gf
let gfs;

conn.once('open',() => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
  });


// crate storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });




app.set('view engine', 'ejs');

app.get('/',(req,res) => {
    res.render('index');
});


app.post('/upload',upload.single('file'),(req,res) =>{
    //res.json({file:req.file});
    res.redirect('/');
});

const port =5000;

app.listen(port,() => console.log(`Server started om port ${port}`));
