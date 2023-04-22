var express = require("express");
var router = express.Router();

// Adicionado
var fs = require("fs");
var bodyParser = require("body-parser"); // npm install body-parser --save
var multer = require("multer"); // npm install multer --save

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Multer storage option
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/"); // cb(null, "tmp/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); //  + "-" + Date.now() + ".pdf"
  },
});

/*
  Cria um objeto de armazenamento para especificar onde 
  os arquivos serão salvos e como os nomes serão gerenciados. 
  Isso permite um controle mais preciso sobre a forma como os 
  arquivos são armazenados, como os nomes são gerados e 
  como eles são processados antes de serem armazenados.
*/
var upload = multer({ storage: storage });

/* 
  No caso abaixo o multer simplesmente salva os arquivos 
  na pasta especificada e gera nomes aleatórios para eles. 
  Isso pode ser útil se você não precisar processar os 
  arquivos antes de salvá-los, mas quer apenas salvar os 
  arquivos em uma pasta temporária para, posteriormente,
  processá-los e mover para um local permanente.
*/
// var upload = multer({ dest : 'temp/'})

/*
  Conclusão se você precisar de mais controle sobre 
  como os arquivos são armazenados, use { storage: storage }. 
  Se você não precisar de nenhum processamento adicional, pode usar { dest: 'temp/' }.
*/

router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(upload.single("file")); // upload.single("image")

router.post("/file_upload", function (req, res) {

  console.log(req.file.filename);
  console.log(req.file.path);
  console.log(req.file.filename);

  var file = __dirname + '/../public/images/' + req.file.filename;

  fs.readFile(req.file.path, function (err, data) {
    fs.writeFile(file, data, function (err) {
      if (err) {
        console.log(err);
      } else {
        response = {
          message: "File uploaded successfully",
          filename: req.file.filename,
        };
      }

      console.log(response);
      res.end(JSON.stringify(response));
    });
  });
});

module.exports = router;
