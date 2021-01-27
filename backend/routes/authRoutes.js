const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth, checkUser, checkadmin, checkSuperadmin, verifiedAccount } = require('../middleware/authMiddleware');

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

router.get('/adminSignup', requireAuth, checkSuperadmin, verifiedAccount, authController.adminSignup_get);
router.post('/adminSignup', requireAuth, checkSuperadmin, verifiedAccount, authController.adminSignup_post);

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);
router.get('/restricted', authController.restricted_get);

router.get('/userReg', requireAuth, verifiedAccount, authController.userReg_get);
router.post('/userReg', requireAuth, verifiedAccount, authController.userReg_post);

router.get('/confirmation/:id', requireAuth, authController.confirmation_Post);
//router.post('/resend', authController.resendToken_Post);

router.get('/tanks',requireAuth, verifiedAccount, authController.userData_get);

module.exports = router;