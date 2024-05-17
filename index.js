const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const users = [
    {
        id: 1,
        name: 'Eduardo',
        email: 'johndoe@example.com'
    },
    {
        id: 2,
        name: 'John',
        email: 'johndoe@example.com'
    }
]

const puerto = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).send('BIENVENIDO A MI API REST');
})

// Rutas de Express
app.post('/user', (req, res) => {
    const username = req.body.username;
    //prueba de conexion
    //res.send(`El usuario logueado es ${username}`);

    //logica de busqueda de datos en la DB
    //Si se encuentra en la base de datos entonces le creamos un JWT.
    if (username === 'Eduardo') {
        const token = jwt.sign({username}, process.env.CLAVE_SECRETA, {expiresIn: 30});

        res.status(202).send({token});
    }else{
        res.status(401).send({error: 'usuario no registrado'});
    }
});

app.get('/user', auth, (req, res) => {
    res.send(req.user);
})

function auth(req, res, next) {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        jwt.verify(token, process.env.CLAVE_SECRETA);

        req.token = token;

        //Peticion o busqueda de informacion relacionada con el usuario para enviarla a la peticion.
        const decodificarUsername = jwt.decode(token, process.env.CLAVE_SECRETA);
        //buscar los datos del usuario en la BD
        const user = users.filter(user => user.name === decodificarUsername.username);

        req.user = user[0];

        next()
    } catch (error) {
        res.status(401).send({error: 'usuario no autenticado'});
    }
}

app.listen(puerto, () => console.log(`servidor desplegado en el puerto ${puerto}`));