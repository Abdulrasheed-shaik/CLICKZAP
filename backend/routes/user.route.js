import express from 'express'
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register,searchUsers, getFollowersOrFollowing, guestLogin } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'),editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/search').get(isAuthenticated, searchUsers);
router.route('/guest-login').post(guestLogin);

// Route to fetch followers or following
router.get("/:id/:type(followers|following)", getFollowersOrFollowing);

export default router