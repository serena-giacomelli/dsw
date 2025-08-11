import {Request, Response} from 'express';
import { orm } from '../shared/db/orm.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuarios.entity.js';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-key';

const em =  orm.em


async function findAll(req: Request, res: Response) {
    try{
        const usuarios = await em.find(Usuario, {}) //el segundo parametro sonlos filtros, en este caso no tiene, no se como se hace cuanod los tenga
        res.status(200).json({message: 'found all usuarios', data:usuarios})
    } catch (error:any) {
        res.status(500).json({message: error.message})
}}

//si hay un error, en alguno de los controler que diga cannot access before initialization hay q ir a la entity donde haya error
// e importar rel que es orm y en la @Many to algo poner Rel<Clase> (eso se hace dentro del @Many)

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const usuario = await em.findOneOrFail(Usuario, { id })
        res.status(200).json({message: 'found one usuario', data: usuario})
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }}

    async function add(req: Request, res: Response) {
        try {
          const { password, ...data } = req.body;
      
          if (!password) {
            return res.status(400).json({ message: 'La contraseña es obligatoria' });
          }
      
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      
          const usuario = em.create(Usuario, {
            ...data,
            password: hashedPassword
          });
      
          await em.flush();
      
          res.status(201).json({ message: 'Usuario creado', data: usuario });
        } catch (error: any) {
          res.status(500).json({ message: error.message });
        }
      }

 
async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const usuario = em.getReference(Usuario, id )
        em.assign(usuario, req.body)
        await em.flush()
        res.status(200).json({message: 'usuario updated', data: usuario})
    }  catch(error:any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const usuario = em.getReference(Usuario, id)
        await em.removeAndFlush(usuario)
        res.status(200).send({message: 'usuario removed'})
    } catch (error:any) {
        res.status(500).json({message: error.message})
}}

async function login(req: Request, res: Response) {
    try {
      const { mail, password } = req.body;
      const usuario = await em.findOneOrFail(Usuario, { mail });
  
      if (usuario) {
        const isMatch = await bcrypt.compare(password, usuario.password);
  
        if (isMatch) {
          const token = jwt.sign(
            { id: usuario.id, mail: usuario.mail, tipoUsuario: usuario.tipoUsuario },
            JWT_SECRET,
            { expiresIn: '24h' } // Extendido a 24 horas
          );
          res
            .status(200)
            .json({ message: 'Usuario logueado', data: { usuario, token } });
        } else {
          res.status(401).json({ message: 'Contraseña incorrecta' });
        }
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

// Almacén temporal de códigos OTP (en producción usar base de datos o cache)
const emailOtps = new Map<string, { otp: string, usuarioData: any, expires: number }>();

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

async function register(req: Request, res: Response) {
    try {
        const { nombre, apellido, mail, password, dni, fechaNacimiento } = req.body;
        if (!nombre || !apellido || !mail || !password || !dni) {
            return res.status(400).json({ message: 'Faltan campos obligatorios.' });
        }

        const existe = await em.findOne(Usuario, { mail });
        if (existe) {
            return res.status(409).json({ message: 'El email ya está registrado.' });
        }

        // Hashea la contraseña pero NO guardes el usuario aún
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Genera OTP y almacena temporalmente los datos
        const otp = generateOtp();
        emailOtps.set(mail, {
            otp,
            usuarioData: {
                nombre,
                apellido,
                mail,
                password: hashedPassword,
                dni,
                fechaNacimiento: fechaNacimiento || '',
                tipoUsuario: 'user',
            },
            expires: Date.now() + 10 * 60 * 1000 // 10 minutos
        });

        // Envía el OTP por email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: mail,
            subject: 'Código de verificación',
            html: `<p>Hola ${nombre},</p>
                   <p>Tu código de verificación es: <b>${otp}</b></p>
                   <p>Este código es válido por 10 minutos.</p>`
        });

        res.status(200).json({ message: 'Código de verificación enviado al email.' });
    } catch (error: any) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: error.message });
    }
}

async function verifyOtp(req: Request, res: Response) {
    try {
        const { mail, otp } = req.body;
        const entry = emailOtps.get(mail);
        if (!entry) {
            return res.status(400).json({ message: 'No se solicitó código para este email.' });
        }
        if (entry.expires < Date.now()) {
            emailOtps.delete(mail);
            return res.status(400).json({ message: 'El código ha expirado.' });
        }
        if (entry.otp !== otp) {
            return res.status(400).json({ message: 'Código incorrecto.' });
        }

        // Crea el usuario definitivo
        const usuario = em.create(Usuario, entry.usuarioData);
        await em.flush();
        emailOtps.delete(mail);

        res.status(201).json({ message: 'Usuario verificado y registrado correctamente.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


export {findAll, findOne, add, update, remove, login, register, verifyOtp}

