const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
    user: "c02a9eec0dbd47", 
    pass: "6bf4f8fb0336e6" 
  }
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000;
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: '"Prueba" <no-reply@melina.com>', 
            to: user.email, 
            subject: 'Recuperación de contraseña',
            text: `Para resetear tu contraseña, usa el siguiente token: ${resetToken}\n\nO haz clic en este enlace: ${resetUrl}\n\nEl token expira en 1 hora.`,

            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Recuperación de contraseña</h2>
                <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
                <p>Token: <strong>${resetToken}</strong></p>
                <p>O haz clic en el siguiente enlace:</p>
                <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
                <p style="color: #6b7280; font-size: 0.9rem; margin-top: 20px;">Este token expirará en 1 hora.</p>
              </div>
            `
          };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Token enviado al correo electrónico' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});


app.post('/reset-password', async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    try {
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        const user = await UserModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al resetear la contraseña' });
    }
})


app.listen(3001, () => {
    console.log('Server is running on port 3001');
})