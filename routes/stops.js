const { Router, query } = require("express");
const router = Router();
const { isAuthorized, isValidId } = require("./middleware.js")

const stopDAO = require('../daos/stops');

router.post("/",
    isAuthorized,
    async (req, res, next) => {
        const { groupId, stopId } = req.body;
        try {
            const newStop = await stopDAO.create(groupId, stopId);
            res.json(newStop);
        } catch(e) {
            next(e);
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

// errors
router.use(async (error, req, res, next) => {
    if (error instanceof stopDAO.BadDataError) {
      res.status(409).send(error.message);
    } else {
      res.status(500).send('something went wrong');
    }
});

module.exports = router;
