const { Router, query } = require("express");
const router = Router();
const { isAuthorized, isValidId } = require("./middleware.js")

const groupDAO = require('../daos/groups');

router.post("/",
    isAuthorized,
    async (req, res, next) => {
        const { name, origin, destination, isDefault } = req.body;
        const newGroup = await groupDAO.create(req.userId, name, origin, destination, isDefault);
        if (newGroup) {
            res.json(newGroup);
        } else {
            res.sendStatus(404);
        }
    }
);

router.get("/",
    isAuthorized,
    async (req, res, next) => {
        let { query } = req.query;
        if (query) {
            const groups = await groupDAO.getByQuery(query);
            if (groups) {
                res.json(groups);
            } else {
                res.sendStatus(404);
            }
        } else {
            const groups = await groupDAO.getByUserId(req.userId);
            if (groups) {
                res.json(groups);
            } else {
                res.sendStatus(404);
            }
        }
    }
);

router.get("/:id",
    isAuthorized,
    isValidId,
    async (req, res, next) => {
        const groupId = req.params.id;
        const group = await groupDAO.getByIdAndUserId(groupId, req.userId);
        if (group) {
            res.json(group)
        } else {
            res.sendStatus(404);
        }
    }
);

router.put("/:id",
    isAuthorized,
    isValidId,
    async (req, res, next) => {
        const groupId = req.params.id;
        const storedUserId = await groupDAO.getUserIdFromGroupId(groupId);
        if (req.userId == storedUserId) {
            const {name, origin, destination, isDefault} = req.body;
            const updatedGroup = await groupDAO.updateById(groupId, name, origin, destination, isDefault);
            if (updatedGroup) {
                res.json(updatedGroup);
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(404);
        }
    }
);

router.delete("/:id",
    isAuthorized,
    isValidId,
    async (req, res, next) => {
        const groupId = req.params.id;
        const storedUserId = await groupDAO.getUserIdFromGroupId(groupId);
        if (req.userId == storedUserId) {
            try {
                const success = await groupDAO.deleteById(groupId);
                res.sendStatus(success ? 200 : 400);
            } catch(e) {
                res.status(500).send(e.message);
            }
        } else {
            res.sendStatus(404);
        }
    }
);

module.exports = router;
