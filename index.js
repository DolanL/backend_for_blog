import express from 'express'
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validations.js";
import {UserController, PostController} from './controllers/index.js'
import multer from "multer"
import {handleValidationErrors, checkAuth} from "./utils/index.js";

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage })

mongoose.connect('mongodb+srv://admin:admin@cluster0.ebhv9up.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => {
    console.log('Db  ok')
  }).catch((err) => {
  console.log('Db err', err)
})

app.use(express.json())

app.use('/uploads', express.static('uploads'))
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`
  });
});
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)


app.listen(4444, (err) => {
  if (err) {
    console.log(err)
  }

  console.log('server ok')
})
