const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(path.resolve(__dirname, "../", "public")));

const port = 3000;
app.listen(port, function () {
  console.log(`listening on port ${port}!`);
});

app.get("/template", function (req, res) {
  const fileDirectory = path.resolve(__dirname, '../', 'public/src');
  res.sendFile('index.html', { root: fileDirectory }, (err) => {
    res.end();
    if (err) throw (err);
  });
});
