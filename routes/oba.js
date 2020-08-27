const { Router, query } = require("express");
const router = Router();
const { isAuthorized } = require("./middleware.js")
const fetch   = require('node-fetch');

const BASE_URI = 'http://api.pugetsound.onebusaway.org'

router.get("/routes/:id/stops",
  async (req, res, next) => {
    const { id } = req.params;
    fetch(`${BASE_URI}/api/where/stops-for-route/${id}.json?key=${process.env.ONE_BUS_AWAY_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        res.send({ data });
      })
      .catch(err => {
        res.send(err);
      })
  }
);

router.get("/routes/:id",
  async (req, res, next) => {
    const { id } = req.params;
    fetch(`${BASE_URI}/api/where/routes-for-agency/${id}.json?key=${process.env.ONE_BUS_AWAY_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        res.send({ data });
      })
      .catch(err => {
        res.send(err);
      })
  }
);


router.get("/stops/:id/arrivals",
  async (req, res, next) => {
    const { id } = req.params;
    fetch(`${BASE_URI}/api/where/arrivals-and-departures-for-stop/${id}.json?key=${process.env.ONE_BUS_AWAY_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        res.send({ data });
      })
      .catch(err => {
        res.send(err);
      })
  }
);


module.exports = router;
