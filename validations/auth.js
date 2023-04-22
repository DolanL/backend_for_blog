import {body} from 'express-validator'

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  // password must be at least 5 chars long
  body('password', 'Пароль должен быть 5 симловов').isLength({ min: 5 }),
  body('fullName', 'Нужно 3 символа для полного имени').isLength({min: 3}),
  body('avatarURL', 'Неверная ссылка на аватарку').optional().isURL(),
]