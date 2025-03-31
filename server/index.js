const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/registerlogin')
    .then(() => console.log('Conexión a MongoDB exitosa'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

app.post('/register', async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
        const token = 'fake-jwt-token';
        res.status(201).json({ message: 'Usuario registrado con éxito', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
    
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        
        const token = 'fake-jwt-token';
        res.status(200).json({ message: 'Inicio de sesión exitoso', token, user });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
})