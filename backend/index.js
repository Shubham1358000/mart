import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
app.use(cors());
const port = 1358;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "..","frontend");



const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data.json"), "utf-8")

);
console.log(products)


app.use(express.static(__dirname));

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/product", (req, res) => {
  res.sendFile(path.join(frontendPath, "product.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});