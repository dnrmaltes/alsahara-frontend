const { Router } = require("express");
const authCtrl = require("../controllers/auth.controller");
const router = Router();

router.post("/register", authCtrl.register);
router.post("/login",    authCtrl.login);
router.post("/recover",  authCtrl.recover);
router.post("/reset",    authCtrl.reset);

module.exports = router;