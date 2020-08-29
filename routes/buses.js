const { Router, query } = require("express");
const router = Router();
const { isAuthorized, isValidId } = require("./middleware.js")

const busDAO = require('../daos/bus');

router.post("/",
    isAuthorized,
    async (req, res, next) => {
        const { stopId, busId } = req.body;
        try {
            const newBus = await busDAO.create(stopId, busId);
            res.json(newBus);
        } catch(e) {
            next(e);
        }
    }
);

router.get("/",
    isAuthorized,    
    async (req, res, next) => {
        let { stopId, groupId } = req.query;
        if(stopId) {
            const buses = await busDAO.getByStopId(stopId);
            if (buses) {
                res.json(buses);
            } else {
                res.sendStatus(404);
            }
        } else if (stopId && groupId) {
            const buses = await busDAO.getByStopAndGroup(stopId, groupId);
            if (buses) {
                res.json(buses);
            } else {
                res.sendStatus(404);
            }
        } else {
            const buses = await busDAO.getAll();
            if (buses) {
                res.json(buses);
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
        const bus = await busDAO.getById(id);
        if (bus) {
            res.json(bus)
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
        const { stopId, busId } = req.body;
        const updatedBus = await busDAO.updateById(id, stopId, busId);
        if (updatedBus) {
            res.json(updatedBus)
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
            const success = await busDAO.deleteById(id);
            res.sendStatus(success ? 200 : 400);
        } catch(e) {
            res.status(500).send(e.message);
        }
    }
);

// errors
router.use(async (error, req, res, next) => {
    if (error instanceof busDAO.BadDataError) {
      res.status(409).send(error.message);
    } else {
      res.status(500).send('something went wrong');
    }
});

module.exports = router;
