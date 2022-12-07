const {register, login, getAllUsers, getCurrentUser} = require("../controllers/userController");
const {checkUser} = require("../Middleware/userMiddleware");
const router = require("express").Router();

router.post("/", checkUser)
router.post("/register",register);
router.post("/login", login);
router.get('/allUsers/:id', getAllUsers);
router.get('/currentUser/:id', getCurrentUser)
module.exports = router;