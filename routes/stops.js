const { Router, query } = require("express");
const router = Router();
const { isAuthorized, isValidId } = require("./middleware.js")

const stopDAO = require('../daos/stops');

router.post("/",
    isAuthorized,
    async (req, res, next) => {
        const { groupId, stopId } = req.body;
        const newStop = await stopDAO.create(groupId, stopId);
        if (newStop) {
            res.json(newStop);
        } else {
            res.sendStatus(404);
        }
    }
);

router.get("/",
    isAuthorized,    
    async (req, res, next) => {
        let { groupId } = req.query;
        if (groupId) {
            const stops = await stopDAO.getByGroupId(groupId);
            if (stops) {
                res.json(stops);
            } else {
                res.sendStatus(404);
            }
        } else {
            const stops = await stopDAO.getAll();
            if (stops) {
                res.json(stops);
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
        const id = req.params.id;
        const stop = await stopDAO.getById(id);
        if (stop) {
            res.json(stop)
        } else {
            res.sendStatus(404);
        }
    }
);

router.put("/:id",
    isAuthorized,
    isValidId,
    async (req, res, next) => {
        const id = req.params.id;
        const {groupId, stopId} = req.body;
        const updatedStop = await stopDAO.updateById(id, groupId, stopId);
        if (updatedStop) {
            res.json(updatedStop)
        } else {
            res.sendStatus(404)
        }
    }
);

router.delete("/:id",
    isAuthorized,
    isValidId,
    async (req, res, next) => {
        const id = req.params.id;
        try {
            const success = await stopDAO.deleteById(id);
            res.sendStatus(success ? 200 : 400);
        } catch(e) {
            res.status(500).send(e.message);
        }
    }
);

module.exports = router;
