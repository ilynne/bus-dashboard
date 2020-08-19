const { Router } = require("express");
const router = Router();

router.use("/", require('./authentication'))
router.use("/groups", require('./groups'));
router.use("/stops", require('./stops'));
router.use("/buses", require('./buses'));

module.exports = router;