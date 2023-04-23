import bcrypt from "bcrypt";
import UserSchema from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
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

export const login = async (req, res) => {
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
}

export const getMe = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      })
    }

    const {passwordHash, ...userSchema} = user._doc

    res.json(userSchema)

  } catch (err) {
    return res.status(403).json({
      message: 'Нет доступа'
    })
  }
}