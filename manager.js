import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import { error } from "console";

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

const index = fs.readFileSync(`${__dirname}/index.html`, "utf-8");
const product_genrate = fs.readFileSync(
  `${__dirname}/product_card_genrate.html`,
  "utf-8",
);
const product_skeleton = fs.readFileSync(
  `${__dirname}/product_card_skeleton.html`,
  "utf-8",
);
const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");

const dataobj = JSON.parse(data);
// console.log(data);
// console.log(index);
// console.log(product_genrate);

const server = http.createServer((req, res) => {
   
  const url = new URL(req.url, `http://${req.headers.host}`);
const pathname = url.pathname;
const query = url.searchParams;

// product_card_generate
if (pathname === "/" || pathname === "/product_here") {
  res.writeHead(200, { "content-type": "text/html" });

  const cardHtml = dataobj
    .map((el) => replaceCard(product_skeleton, el))
    .join("");

  const output = product_genrate.replace("{%product_card%}", cardHtml);
  res.end(output);

} else if (pathname === "/product") {
  res.writeHead(200, { "content-type": "text/html" });

  const product = dataobj[query.get("id")];
  const output = replaceCard(index, product);

  res.end(output);
}


  // 
  // const {query, pathname} = new URL(`http://${req.headers.host}`, req.url);

  // //product_card_genrate
  // if (pathname === "/" || pathname === "/product_here") {
  //   res.writeHead(200, { "content-type": "text/html" });
  //   const cardHtml = dataobj
  //     .map((el) => replaceCard(product_skeleton, el))
  //     .join("");
    
  //   const output = product_genrate.replace("{%product_card%}", cardHtml);
  //   res.end(output);
  // }else if(pathname === '/product'){
  //   res.writeHead(200, { "content-type": "text/html" });
  //   const product = dataobj[searchParams(id)];
  //   const output = replaceCard(index, product);
  //   res.end(output);
  // }
});

server.listen(8080, () => {
  console.log("8080 sever is run");
});
