const { Router } = require("express");
const router = Router();

router.use("/login", require('./login'));
router.use("/groups", require('./groups'));
router.use("/stops", require('./stops'));
router.use("/buses", require('./buses'));
router.use("/oba", require('./oba'));

module.exports = router;
