const express = require("express");
const mongoose = require("mongoose");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Configuracion de vistas y Motor de plantillas EJS
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/static"));

//////////////////////////////////////
// Conectarse a la BD con Mongoose
mongoose.connect("mongodb://localhost/nutriasDB", { useNewUrlParser: true });
// Creacion del esquema
const OtterSchema = new mongoose.Schema({
  name: String,
  age: Number,
  weight: Number,
  location: String,
});
// crea un objeto que contenga métodos para que Mongoose interactúe con MongoDB
const Otter = mongoose.model("Otter", OtterSchema);
//////////////////////////////////////

// 1. Ruta pantalla principal
app.get("/nutria", (req, res) => {
  Otter.find().then((otter) => {
    console.log("Consultando todas las Otter");
    //console.log(otter);
    res.render("index", { otters: otter });
  });
});

// 2. Ruta Formulario de Ingreso y Edición
app.get("/form_nutria", (req, res) => {
  res.render("form_nutria", {});
});

// 3. Ruta Agregar nutria en BD y redirige a listado general
app.post("/new_nutria", (req, res) => {
  const otter = new Otter();
  //console.log(req.body);
  otter.name = req.body.name;
  otter.age = req.body.age;
  otter.weight = req.body.weight;
  otter.location = req.body.location;
  otter
    .save()
    .then((newOtterData) => console.log("otter created:", newOtterData))
    .catch((err) => console.log(err));

  res.redirect("/nutria");
});

// 4. Edita los datos de una Nutria
app.get("/edit/:id", (req, res) => {
  console.log("Entro a editar");
  const otter = new Otter();

  Otter.findOne({ _id: req.params.id })
    .then((otter) => {
      console.log("encontrado : " + otter);
      res.render("form_nutria", { otter: otter });
      //res.redirect("/form_nutria");
    })
    .catch((err) => res.json(err));
});

// 5. Elimina una Nutria
app.get("/delete/:id", (req, res) => {
  console.log("Entro a delete");
  let id = req.params.id;
  // ...elimina un documento que coincida con el criterio de objeto de la consulta
  Otter.deleteOne({ _id: id })
    .then((deletedOtter) => {
      // lógica (si la hay) con el objeto deletedUser eliminado con éxito
      console.log("eliminado: " + deletedOtter);
      res.redirect("/nutria");
    })
    .catch((err) => res.json(err));
});

app.listen(7778, () => {
  console.log("Escuchando en el puerto 7778");
});
