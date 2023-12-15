const mysql = require("mysql2");
const express = require('express');
const bodyParser = require('body-parser')
const urlparser = bodyParser.urlencoded({extended: false});
const Sequelize = require('sequelize');
const app = express();
app.use(express.static('public'))

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "blog",
    password: ""
  });

    app.set("view engine", "hbs")
const sequelize = new Sequelize("blog", "root", "", {
    dialect: 'mysql',
    host: 'localhost',
});

// Define the Posts model
const Post = sequelize.define('posts', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descript: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date_post: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    tag: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

// Post.hasOne(Tag, { onDelete: "cascade" });

app.get('/blogs',  function(req, res) {
    pool.query("SELECT * FROM posts", function(err, data) {
        if(err) return console.log(err);
        res.render("blogs.hbs", {
            posts: data
        });
      });
    // Post.findAll({raw: true, 
        // include: [{
        //             model: Tag,
        //             attributes: ['name'], 
        //          }],
    // }).then((date)=>{
    //     console.log(date)
    //     res.render('blogs.hbs', {posts: date})
    // })
});
// возвращаем форму для добавления данных
app.get("/create", function(req, res){
    res.render("create.hbs");
});
// получаем отправленные данные и добавляем их в БД 
app.post("/create", urlparser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const descript = req.body.descript;
    const tag = req.body.tag;
    const date_post = req.body.date_post;

    Post.create({
        name: name,
        descript: descript,
        date_post: date_post,
        tag: tag
    }).then((date)=>{
            console.log(date)
            res.redirect('/blogs')
    });
    // pool.query("INSERT INTO posts (name, descript, tag, date_post) VALUES (?,?,?,?)", [name, descript, tag, date_post], function(err, data) {
    //   if(err) return console.log(err);
    //   res.redirect("/blogs");
    // });
});
 
// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:id", function(req, res){
  const id = req.params.id;
  

  pool.query("SELECT * FROM posts WHERE id=?", [id], function(err, data) {
    if(err) return console.log(err);
    console.log(data[0]);
     res.render("edit.hbs", {
        post: data[0]
    });
    // res.render("create.hbs", { posts: data })
  });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit", urlparser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const descript = req.body.descript;
  const tag = req.body.tag;
  const date_post = req.body.date_post;
  const id = req.body.id;
   
  Post.update({
    name: name,
    descript: descript,
    date_post: date_post,
    tag: tag
},{where: {
    id: id,
}

}).then((date)=>{
        console.log(date)
        res.redirect('/blogs')
});
});
 
// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", function(req, res){
          
  const id = req.params.id;
  pool.query("DELETE FROM posts WHERE id=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/blogs");
  });
});

app.get('/works', function(req, res) {
    res.render('works.hbs');
});

app.get('/work-detailed', function(req, res) {
    res.render('work-detailed.hbs');
});

app.get('/', function (req, res){
    res.render("index.hbs")
});

app.get('/edit', function (req, res){
    res.render("edit.hbs")
});
app.get('/create', function(req, res){
    res.render("create.hbs");
});
sequelize.sync().then(() => {
    app.listen('3000');
})


