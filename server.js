// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["MongoNews"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

//......................................................

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

//.......................................................

// Scrape data from site and save to MongoDB
app.get("/scrape", (req,res) => {
  axios.get("https://www.theonion.com/c/news").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
    var $ = cheerio.load(response.data);
    var results = [];
    db.MongoNews.remove({}, function(err, data) {   //remove everything first

      $("article").each(function(i, element) {

        var title = $(element).find("h1.headline").text();
        var link = $(element).find("h1.headline").children("a").attr("href");
        var summary = $(element).find("div.excerpt").children("p").text(); 
      
       
        const scrape = {  // Save results in an object, push into results array
          title: title,
          link: link,
          summary: summary, 
          img: img
        };
        results.push(scrape);

      });

      db.MongoNews.insert(results, function (err, data) { 
        res.json(results);
      })

    })

  })
});

//...................................................

  // Retrieve all data from the MongoNews collection as a json 
  app.get("/all", (req,res) => {
    db.MongoNews.find({}, function(err, data) {
      if (err) return res.json(500, err);

      res.json(data);
    })
  });

//...................................................
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
