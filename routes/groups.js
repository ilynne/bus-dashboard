const { Router, query, response } = require("express");
const router = Router();

const groupDAO = require('../daos/groups');

// Authentication middleware

// Routes
router.post("/",
    // authentication middleware, 
    async (req, res, next) => {
        const userId = req.user._id;
        const { origin, destination, isDefault } = req.body;
        const newGroup = await groupDAO.create(userId, origin, destination, isDefault);
        if (newGroup) {
            res.json(newGroup);
        } else {
            res.sendStatus(404);
        }
    }
);

router.get("/", 
    // authentication middleware, 
    async (req, res, next) => {
        let { origin, destination } = req.query;
        if (origin) {
            const groups = await groupDAO.getByOrigin(origin);
            if (groups) {
                res.json(groups);
            } else {
                res.sendStatus(404);
            }
        } else if (destination) {
            const groups = await groupDAO.getByDestination(destination);
            if (groups) {
                res.json(groups);
            } else {
                res.sendStatus(404);
            }
        } else if (origin && destination) {
            const groups = await groupDAO.getByOriginAndDestination(origin, destination);
            if (groups) {
                res.json(groups);
            } else {
                res.sendStatus(404);
            }
        } else {
            const userId = req.user._id;
            const groups = await groupDAO.getByUserId(userId);
            if (groups) {
                res.json(groups);
            } else {
                res.sendStatus(404);
            }
        }
    }
);

router.get("/:id",
    // authentication middleware, 
    async (req, res, next) => {
        const groupId = req.params.id;
        if (groupId) {
            const userId = req.user._id;
            const storedUserId = await groupDAO.getAssociatedUserId(userId);
            if (userId == storedUserId) {
                const group = await groupDAO.getById(groupId);
                res.json(group)
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(404);
        }
    }
);

router.put("/:id",
    // authentication middleware, 
    async (req, res, next) => {
        const groupId = req.params.id;
        if (groupId) {
            const userId = req.user._id;
            const storedUserId = await groupDAO.getAssociatedUserId(userId);
            if (userId == storedUserId) {
                const { origin, destination, isDefault } = req.body;
                const updatedGroup = await groupDAO.updateById(groupId, origin, destination, isDefault)
                if (updatedGroup) {
                    res.json(updatedGroup);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(404);
            }       
        } else {
            res.sendStatus(404);
        }
    }
);

router.delete("/:id",
    // authentication middleware, 
    async (req, res, next) => {
        const groupId = req.params.id;
        if (groupId) {
            const userId = req.user._id;
            const storedUserId = await groupDAO.getAssociatedUserId(userId);
            if (userId == storedUserId) {
                await groupDAO.deleteById(groupId);
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }            
        } else {
            res.sendStatus(404);
        }
    }
);

module.exports = router;
