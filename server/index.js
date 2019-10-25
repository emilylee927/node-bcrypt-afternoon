require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
const authCtrl = require("./controllers/authController.js");
const treasureCtrl = require("./controllers/treasureController.js");
const auth = require('./middleware/authMiddleware.js');




const {SESSION_SECRET, CONNECTION_STRING} = process.env;

const app = express();


massive(process.env.CONNECTION_STRING).then(dbInstance=>{
    app.set('db',dbInstance)
    console.log("Database Connected")
  });
  


app.use(session({
    resave: false,
    saveUninitialized:true,
    secret:SESSION_SECRET,

}))


app.use(express.json());

app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.get("/auth/logout",authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.userOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.userOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.userOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);



app.listen(4000,()=>{
    console.log("Listening on 4000")
});

