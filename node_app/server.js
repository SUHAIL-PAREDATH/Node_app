const http = require('http');
const fs = require('fs');
const url = require('url');
const dotenv=require('dotenv');
const controller = require('./controller/controller');

const html = fs.readFileSync('./views/index.html','utf-8')
const proHtml = fs.readFileSync('./views/product.html','utf-8');
const addHtml = fs.readFileSync('./views/add.html','utf-8');
const updateHtml = fs.readFileSync('./views/update.html','utf-8')
let userList = JSON.parse(fs.readFileSync('./database/data.json','utf-8'));
let productListHtml = fs.readFileSync('./views/product.html','utf-8');

dotenv.config({path:'config.env'});
const PORT = process.env.PORT || 3000;


const server = http.createServer((req, res) => {
 
    if(req.method == 'GET' && req.url == '/'){

        
        let proHtmlArray = userList.map((prod)=>{
            let output = productListHtml.replace('{{%id%}}',prod.id);
            output = output.replace('{{%NAME%}}',prod.name);
            output = output.replace('{{%DEPARTMENT%}}',prod.department);
            output = output.replace('{{%PHONE%}}',prod.phone);
            output = output.replace('{{%did%}}',prod.id);
            return output;
        })

        let finalOutputHtml = html.replace('{{%CONTENT%}}',proHtmlArray.join(''));
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(finalOutputHtml);
    }
     if(req.method == 'GET' && req.url == '/add-user'){
        
      
        res.end(addHtml);
    }
    if(req.method == 'POST' && req.url == '/add-user/add'){
        controller.create(req,res);
      
        res.end(addHtml);
    }

    // update get value
     if(req.url.match(/\/update\/([0-9]+)/) && req.method  == 'GET'){
        const id = req.url.split("/")[2];

        const userData=controller.getUpdateDetails(id,res);
      
            let output = updateHtml.replace('{{%id%}}',userData.id);
            output = output.replace('{{%NAME%}}',userData.name);
            output = output.replace('{{%DEPARTMENT%}}',userData.department);
            output = output.replace('{{%PHONE%}}',userData.phone);

            res.writeHead(200, { "Content-Type": "text/html" });
            console.log("update");
            res.end(output);
    }
    // update
    if(req.url.match(/\/update\/([0-9]+)/) && req.method === "PUT"){
        const id = req.url.split("/")[2];
       controller.update(id,res,req);
        res.end();

    }
    //delete
    if(req.url.match(/\/delete\/([0-9]+)/) && req.method === "DELETE"){
        
        const id = req.url.split("/")[2];

       controller.delete(id,res,req);
        res.end();

    }
    
});

server.listen(PORT, () => {
  (console.log(`Server is running on http://localhost:${PORT}`));
});
