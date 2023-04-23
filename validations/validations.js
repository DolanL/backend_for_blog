import {body} from 'express-validator'

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  // password must be at least 5 chars long
  body('password', 'Пароль должен быть 5 симловов').isLength({ min: 5 }),
  body('fullName', 'Нужно 3 символа для полного имени').isLength({min: 3}),
  body('avatarURL', 'Неверная ссылка на аватарку').optional().isURL(),
]

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  // password must be at least 5 chars long
  body('password', 'Пароль должен быть 5 симловов').isLength({ min: 5 }),
]

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3}).isString(),
  // password must be at least 5 chars long
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageURL', 'Неверная ссылка на изображение').optional().isString(),
]

