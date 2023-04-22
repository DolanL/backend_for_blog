import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import {registerValidation} from "./validations/auth.js";
import {validationResult} from 'express-validator'
import UserSchema from "./models/User.js";
import bcrypt from 'bcrypt'
import checkAuth from "./utils/checkAuth.js";

const app = express()

mongoose.connect('mongodb+srv://admin:admin@cluster0.ebhv9up.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => {
    console.log('Db  ok')
  }).catch((err) => {
  console.log('Db err', err)
})

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Heфывllo world')
})

app.post('/auth/login', async (req, res) => {
  try {
    const user = UserSchema.findOne({email: req.body.email})

    if (!user) {
      return res.status(404).json({message: 'Пользователь не найден'})
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({message: 'Неверный логин или пароль'})
    }

    const token = jwt.sign({
        _id: user._id,
      }, 'secret',
      {
        expiresIn: '30d'
      }
    )

    const {passwordHash, ...userSchema} = user._doc

    res.json({...userSchema, token})



  } catch (err) {
    console.log(err)
    res.status(500).json(
      {message: 'Не удалось авторизоваться'}
    )
  }
})

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array())
      }

      const password = req.body.password
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      const doc = new UserSchema({
        email: req.body.email,
        passwordHash: hash,
        fullName: req.body.fullName,
        avatarURL: req.body.avatarURL
      })

      const user = await doc.save()

      const token = jwt.sign({
          _id: user._id,
        }, 'secret',
        {
          expiresIn: '30d'
        }
      )


      const {passwordHash, ...userSchema} = user._doc

      res.json({...userSchema, token})
    } catch (err) {
      console.log(err)
      res.status(500).json(
        {message: 'Не удалось зарегистрироваться'}
      )
    }
  }
)

app.get('/auth/me', checkAuth, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.userId)

    if (!user) {
      return res.status(404).json( {
        message: 'Пользователь не найден',
      })
    }

    const { passwordHash, ...userSchema } = user._doc

    res.json(userSchema)

  } catch (err) {
    return res.status(403).json({
      message: 'Нет доступа'
    })
  }
})


app.listen(4444, (err) => {
  if (err) {
    console.log(err)
  }

  console.log('server ok')
})
