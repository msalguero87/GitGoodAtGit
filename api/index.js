var express = require("express");
var body_parser = require('body-parser');
var fs = require('fs'); 
const git = require('simple-git');
const {nanoid} = require('nanoid');
const platform_path = require('path')

const path = './repos';

var app = express();app.listen(4000, () => {
 console.log("Server running on port 4000");
});

app.use(body_parser.urlencoded({extended:true}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var jsonParser = body_parser.json()

app.get("/remote", (req, res, next) => {
    let branch = req.query.branch;
    var remotePath = path + "/remote/" + req.query.repository +".git";
    if(!branch) branch = "master";
    var commands = ["ls-tree","-r",branch,"--name-only"];
    git(remotePath).raw(commands, (err, result) => {
 
        // err is null unless this command failed
        // result is the raw output of this command
        res.send(result.split("\n").filter(function(i){return i}));
      });
});

app.get("/branches", (req, res, next) => {
    var commands = ["branch"];
    git(path).raw(commands, (err, result) => {
 
        // err is null unless this command failed
        // result is the raw output of this command
        res.send(result);
      });
});

app.get("/file", (req, res, next) => {
    let name = req.query.name;
    let repository = req.query.repository;
    var localPath = path + "/local/" + repository + "/" + name;
    console.log(localPath);
    fs.readFile(localPath, "utf8", function read(err, data) {
        if (err) {
            throw err;
        }
        console.log(data);
        res.send(data);
    });
});

app.post('/command', jsonParser, function (req, res) {
    var localPath = path + "/local/" + req.body.repository;
    console.log(localPath);
    var commands = req.body.command.replace('git ', '').split(" ");
    if(commands && commands.length && commands[0] === "clone"){
        localPath = path + "/local";
        commands[1] = path + "/remote/" + commands[1];
        commands[1] = platform_path.resolve(commands[1]);
        console.log(commands[1]);
    }
    git(localPath).raw(commands, (err, result) => {
 
        // err is null unless this command failed
        // result is the raw output of this command
        if(err){
            res.send(err)
        }else{
            console.log(result);
            res.send(result);
        }
      });
});

app.post('/remote/new', jsonParser, function (req, res) {
    var remotePath = path + "/remote";
    var repoName = nanoid();
    var commands = ["init", "--bare", repoName + ".git"];
    git(remotePath).raw(commands, (err, result) => {
 
        // err is null unless this command failed
        // result is the raw output of this command
        res.send(repoName);
      });
});

app.post('/file', jsonParser, function (req, res) {
    var localPath = path + "/local/" + req.body.repository;
    console.log(localPath+ "/" + req.body.fileName);
    fs.open(localPath + "/" + req.body.fileName, 'w', function (err, file) {
        if (err) throw err;
        res.send("success");
    }); 
});

app.post('/folder', jsonParser, function (req, res) {
    var localPath = path + "/local/" + req.body.repository;
    console.log(localPath+ "/" + req.body.folderName);
    fs.mkdir(localPath + "/" + req.body.folderName,function(err){
        if (err) {
            throw err;
        }
        res.send("Directory created successfully!");
    });
});

app.post('/file/update', jsonParser, function (req, res) {
    var localPath = path + "/local/" + req.body.repository + "/";
    fs.appendFile(localPath + "/" + req.body.fileName, req.body.fileText, function (err) {
        if (err) throw err;
        res.send('Updated!');
      }); 
});

app.post('/file/delete', jsonParser, function (req, res) {
    var localPath = path + "/local/" + req.body.repository + "/";
    fs.unlink(localPath + "/" + req.body.fileName, function (err) {
        if (err) throw err;
        res.send('Deleted!');
      }); 
});