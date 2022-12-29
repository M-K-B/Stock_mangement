const express =require('express');
const router = express.Router();
const session = require('express-session');
const db = require('./db');
const bcrypt = require('bcryptjs');
const multer = require('multer')
const path = require('path');
const bodyParser = require('body-parser')


router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

router.use(session({
    secret : 'webslesson',
    resave : true,
    saveUninitialized : true
  }));

function requireLogin(req, res, next) {
    if (req.cookies.userId) {
      // User is logged in, proceed to the next middleware function or route handler
      res.locals.loggedInUser = req.cookies.user;
      res.locals.idNum = req.cookies.userId.id;
      next()
    } else {
      // User is not logged in, redirect to the login page
      res.redirect('/login');
    }
  }



router.get('/', requireLogin,(req, res)=>{
    console.log('/GET HOME AUTHORISED')
    console.log(res.locals.loggedInUser)
    console.log(res.locals.idNum)

    let sql = ` SELECT * FROM stock`;
    
    db.query(sql, (error, results) => {
      if (error) {
        // if there is an error, render an error page
        res.render('error');
      } else {
        // if there is no error, render the template and pass the data to it
        //console.log(results)
        res.render('home', { data: results });
      }
    });
      
});

router.get('/login', (req, res, next)=>{
    if(req.cookies.userId){
        console.log('/GET HOME AUTHORISED')
        res.redirect('/')
    }else{
        res.render('login')
        console.log('/GET lOGIN')
    }
    
});

router.post('/login', async (req, res)=>{
  console.log('/POST lOGIN')
    const { username, password } = req.body;

    // Look up the user in the database
    db.query(`
      SELECT * FROM accounts WHERE user = ?
    `, [username], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).end();
      } else if (results.length === 0) {
        // No user found
        return res.render('login', {
            message : "user not found"
        })
      } else {
        // User found, compare passwords
        const user = results[0];
        bcrypt.compare(password, user.pass, (err, same) => {
          if (err) {
            console.error(err);
            return res.render('login', {
                message : "Passwords don't match or doesnt exits"
            })
          } else if (same) {
            // Passwords match, log the user in
            res.cookie('userId', user)
            res.cookie('user',  {
              username: req.body.username})
            res.redirect('/');
          } else {
            // Passwords don't match
            return res.render('login', {
                message : "Passwords don't match or doesnt exits"
            })
          }
        });
      }
    });
})

router.get('/register',(req, res)=>{
    if(req.cookies.userId){
        console.log('/GET HOME AUTHORISED')
        res.redirect('/')
        
    }else{
        res.render('register')
        console.log('/GET REGISTER')
    }
    
});


router.post('/register', async(req, res, next) => {

    

    const {username , password } = req.body
    console.log('/POST REGISTER')
    console.log(username, password)
    
    db.query('SELECT user FROM accounts WHERE user = ?', [username], async (error, results) => {
        if(error){
            console.log(error)
        }


        if(results.length > 0){
            console.log(`user exits already`)
            return res.render('register', {
                message : 'That user already exists'
            })
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)

        db.query('INSERT INTO accounts SET ?', {user: username, pass: hashedPassword}, (error, results)=>{
            if(error){
                console.log(error)
            }else{
                console.log(results)
                res.redirect('login')
            }
        });
        
        });
    
        

    
        })
        ;

router.get('/addStock', async(req, res)=>{
    if(req.cookies.userId){
        res.render('addStock')
        console.log('/GET ADD STOCK')
    }else{
        res.redirect('login')
        console.log('/GET LOGIN NOT AUTHORISED')
    }
})







const storage = multer.diskStorage({
  destination: './public/stockImg/',
  filename: function (req, file, cb) {
    return cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`)
  }
  
});

const upload = multer({ storage: storage }).array("image");




router.post('/addStock', requireLogin, upload, async(req, res)=>{



    console.log(req.files)
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj)
    
    const fileName = req.files[0].filename;
    const {name, barcode, price, quanity , aisle, location } = obj
    

    const now = new Date().toISOString()
    console.log (`ISO Date string: ${now}`)
    const date = now.slice(0,19).replace('T', ' ')
    
    console.log('/POST ADD STOCK')
    console.log(name, fileName, barcode, price, quanity, aisle, location, date)


    let sql = `INSERT INTO stock(creator, barcode, name, photo, Aisle, Location, price, quanity, added)\
                VALUES(${res.locals.idNum}, "${barcode}","${name}","${fileName}","${aisle}", "${location}", "${price}", "${quanity}", "${date}")`
    db.query(sql, (error, results)=>{
      if(error){
          console.log(error)
          res.status(500).end();
      }else{
          console.log(results)
          res.redirect('/')
      }
  });
})

router.get('/logout', (req, res) => {
    
    req.session.destroy((err) => {
        if (err) {
          console.error(err);
          res.status(500).end();
        } else {
          // Clear the userId cookie
          console.log('/GET LOGOUT')
          res.clearCookie('userId');
          res.clearCookie('user');
          res.redirect('/login')
        }
      });
          });
         

module.exports = router;