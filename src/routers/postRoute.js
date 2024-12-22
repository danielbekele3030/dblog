import { Router } from "express";
import {createPost,editPost,getPost,getPosts,deletePost,getCatagoryPosts,getPostsByAuthor,getUserPost} from '../controllers/postController.js'
import auth from '../middlwares/authMiddileWare.js'
const router=Router()

router.post('/create-post',auth,createPost)
router.get('/',getPosts)
router.get('/:id',getPost)
router.patch('/:postId',auth,editPost)
router.get('/catagory/:catagory',getCatagoryPosts)
router.get('/users/:id',getUserPost)
router.delete('/:id',auth,deletePost)
router.get('/:Author',getPostsByAuthor)





export default router