
//Grab the articles as a json
$.getJSON("/articles", function(data) {   
    for (var i = 0; i < data.length; i++) {
      // Display information on the page
      $("#articles").append("<p id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
  
