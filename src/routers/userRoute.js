import { Router } from "express";
import {userRegister,loginUser,chageAvater,getAuthors,editeUser,getUser} from '../controllers/userController.js'
import auth from '../middlwares/authMiddileWare.js'
const router=Router()

router.post('/register',userRegister)
router.post('/login',loginUser)
router.post('/change-avater',auth,chageAvater)
router.get('/:id',getUser)
router.patch('/edit-user/:id',auth,editeUser)
router.post('/authors',getAuthors)
export default router