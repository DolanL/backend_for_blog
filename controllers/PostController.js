import PostSchema from "../models/Post.js";


export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err)
    res.status(500).json(
      {message: 'Не удалось создать статью'}
    )
  }
}
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostSchema.findOneAndUpdate({
        _id: postId,
      },
      {
        $inc: {viewsCount: 1}
      },
      {
        returnDocument: 'after',
      }
    ).then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена',
        })
      }

      res.json(doc)
    }).catch((err) => {
      console.log(err)
      res.status(500).json(
        {message: 'Не удалось вернуть статью'}
      )
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(
      {message: 'Не удалось вернуть статью'}
    )
  }
}
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostSchema.findOneAndDelete({
        _id: postId,
      },
    ).then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена',
        })
      }

      res.json({
        success: true
      })
    }).catch((err) => {
      console.log(err)
      res.status(404).json(
        {message: 'Не удалось удалить статью'}
      )
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(
      {message: 'Не удалось удалить статью'}
    )
  }
}
export const create = async (req, res) => {
  try {
    const doc = new PostSchema({
      title: req.body.title,
      text: req.body.text,
      imageURL: req.body.imageURL,
      tags: req.body.tags,
      user: req.userId
    })

    const post = await doc.save()

    res.json(post);
  } catch (err) {
    console.log(err)
    res.status(500).json(
      {message: 'Не удалось создать статью'}
    )
  }
}
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostSchema.updateOne({
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageURL: req.body.imageURL,
        tags: req.body.tags,
        user: req.userId
      }
    )
    res.json({
      success: true
    })
  } catch (err) {
    console.log(err)
    res.status(500).json(
      {message: 'Не удалось создать статью'}
    )
  }
}