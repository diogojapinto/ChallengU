var path = require('path');
module.exports = function(app){


app.get("/login", function(req, res) {
    res.sendfile(path.join(__dirname, '../html', 'login.html'));
});

app.get("/post-challenge", function(req, res) {
    res.sendfile(path.join(__dirname, '../html', 'challenge-submit.html'));
});

//entry point
app.get('*', function(req,res){
  res.sendfile(path.join(__dirname, '../../landing/html/landing.html'));
});
};
