import fs from "fs";
import path from "path";
import url from "url";
import { error } from "console";
import express from "express";
  let count = 0;


const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replaceCard = (card, product) => {
  let output = card;
  output = output.replace(/{%productName%}/g, product.productName);
  output = output.replace(/{%image%}/g, product.image);
  output = output.replace(/{%price%}/g, product.price);
  output = output.replace(/{%from%}/g, product.from);
  output = output.replace(/{%nutrients%}/g, product.nutrients);
  output = output.replace(/{%quantity%}/g, product.quantity);
  output = output.replace(/{%description%}/g, product.description);
  output = output.replace(/{%id%}/g, product.id);

  return output;
};

const index = fs.readFileSync(`${__dirname}/info.html`, "utf-8");
const product_genrate = fs.readFileSync(
  `${__dirname}/Homepage_title_card.html`,
  "utf-8",
);
const product_skeleton = fs.readFileSync(
  `${__dirname}/Home_page_fillup.html`,
  "utf-8",
);
const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");

const dataobj = JSON.parse(data);
// console.log(data);
// console.log(index);
// console.log(product_genrate);





// product_card_generate
app.get("/", (req, res) => {
  
  res.writeHead(200, { "content-type": "text/html" });

  const cardHtml = dataobj
    .map((el) => replaceCard(product_skeleton, el))
    .join("");

  const output = product_genrate.replace("{%product_card%}", cardHtml);
  res.end(output);

  console.log("all is well", ++count);

 
  

});

//product info
app.get("/product", (req,res)=>{
    const url = new URL(req.url, `http://${req.headers.host}`);
  const query = url.searchParams;

  res.writeHead(200, { "content-type": "text/html" });

  const product = dataobj[query.get("id")];
  const output = replaceCard(index, product);

  res.end(output);
});

app.post("/", (req, res) => {
  // res.end("undercontration");
  // req.url("/product")

  console.log(req.body);
  res.send('done');
});





app.listen(8080, () => {
  console.log("8080 sever is run");
});
