//Incluimos un paquete que viene nativo en node, el http
const http = require('http');
let fs = require('fs');
const path = require("path");

// Creamos una función que maneja las request y las filtra
function releaseContent(req, res) {
    
    //Establezco tipo de cabecera y el header que va a ser común a todas
    res.setHeader("Content-type", "text/html");
    
    //Obtengo los valores que van a estar fijos
    let validUrls = ["/index", "/bio", "/servicios", "/contacto"];
    let allowHtml;
    let file;
    let body;
    
    //Preparo el contenidop
    const header = fs.readFileSync("./templates/header.html");
 
    if (req.url === "/" || req.url === "") {
        res.statusCode = 200;
        file = 'index.html';
        allowHtml = true;
        console.log("[ROOT]", "Sirviendo root");
    }
    else if (req.url.includes('css')) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/css");

        // Controlo que el rtecurso exista antes de devolverlo
        const existsFile = fs.existsSync('.'+req.url);

        if (!existsFile) {
            res.statusCode = 404;
            return res.end();
        } 
        
        // en caso de que exista, lo cargo
        file = fs.readFileSync('.'+req.url, {encoding: 'utf8'});

        // En caso de que me pidan algo que no requiera
        // concatenar varias partes (HTML)
        // devuelvo directamente el recurso
        return res.end(file);
        allowHtml = false;        
    }
    else if (req.url.includes('img')) { 
        res.statusCode = 200;
        res.setHeader("Content-Type", "image/*");
        // Mejor usar path.join que X + variable cuando son rutas
        // __dirname, es una variable del sistema que apunta a nuestra
        // carpeta del proyecto en la máquina que estemos
        file = fs.readFileSync(path.join(__dirname, req.url));
        return res.end(file);
        allowHtml = false; 
    }
    else if (req.url === "/img/favicon.ico" ) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "image/ico");
        file = fs.readFileSync('./img/favicon.ico');
        return res.end(file);
        allowHtml = false; 
    }
    else if (validUrls.indexOf(req.url) !== -1) {
        res.statusCode = 200;
        file = req.url+'.html';
        allowHtml = true;
    } 
    else {
        res.statusCode = 404; 
        file = '404.html'; 
        allowHtml = true;
    }
    
    if(allowHtml) {
        body = fs.readFileSync(`./templates/bodies/${file}`);
    }
    const footer = fs.readFileSync("./templates/footer.html");
     
    console.log("Llego hasta el final---------");
     
    //Establezco el footer y lanzo
    res.end(header + body + footer);
};
 

// Levantamos el server con la función 
const server = http.createServer((req, res) => {
    releaseContent(req, res);
});


server.listen(3000, "0.0.0.0", () => {
    console.log("Servidor corriendo en puerto 3000");
});