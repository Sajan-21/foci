const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddlewares");
const setAccessController = (allowed) => {
    return (req, res, next) => {
        authMiddleware(req, res, allowed, next);
    }
}

router.post("/foci/user/updatename", setAccessController("admin, owner, manager, player"), userController.updateUserName);
router.post("/foci/user/updateavatar",setAccessController("admin, owner, manager, player"), upload.single('avatar'), userController.updateAvatar);

module.exports = router;