const fs = require('fs');
const path = require('path');
const filepath = "./database/data.json";
const fileContents = fs.readFileSync(filepath, 'utf-8');
const data = JSON.parse(fileContents);
const querystring = require('querystring');

// created a list
exports.create = (req, res) => {

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    //  console.log(body);
    });
    
    req.on('end', () => {
        let item = {
            id: data.length + 1,
            name: querystring.parse(body).name,
            department: querystring.parse(body).department,
            phone: querystring.parse(body).phone
          };
      
        data.push(item);
        fs.writeFileSync(filepath, JSON.stringify(data));
       
      });  
}


// get update

exports.getUpdateDetails=(userId,res)=>{
    console.log(userId);
    const user = data.find((item) => item.id === parseInt(userId));
  
    if (user) {
      return user;
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `Requested ${userId} not found` }));
    }
  }

//   update

exports.update=(userId,res,req)=>{
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log(body);
      let item = {
        id:parseInt(userId),
        name: querystring.parse(body).name,
        department: querystring.parse(body).department,
        phone: querystring.parse(body).phone
      };
      console.log(item);
      const index = data.findIndex(d => d.id === parseInt(item.id));
      if (index !== -1)
      data[index] = item;
      fs.writeFileSync(filepath, JSON.stringify(data));
    })
}

// delete
exports.delete=(userId,res,req)=>{
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
        console.log(body);
        let item = {
          id:parseInt(userId),
          name: querystring.parse(body).name,
          department: querystring.parse(body).department,
          phone: querystring.parse(body).phone
        };
        console.log(item);
        const index = data.findIndex(d => d.id === parseInt(item.id));
        if (index !== -1)
        data.splice(index, 1);
        for (let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
          }
        fs.writeFileSync(filepath, JSON.stringify(data));
      });
}