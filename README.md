# Bus Dashboard API

Our proposal is to create a Node.js API for the Bus Dashboard React app that Lynne created for JS300. The Github repo for the app is at https://github.com/ilynne/bus-arrival-dashboard. It is currently hosted on https://intense-brushlands-86127.herokuapp.com/.

The current app uses Firebase for authentication and app data. It uses a Rails API for calls to the OneBusAway API because it requires an API key. All the data needed to authenticate and consume real time OneBusAway arrival data would be moved to a MongoDB database.

The bus dashboard displays groups of buses at stops. If you have a few stops close by that give you different options for routes, there is no central location to check them all. The Bus Dashboard fills that need.

## Deployed Application

The application is currently deployed to https://whispering-caverns-88263.herokuapp.com. There is no front end at this time, but most of the routes work. You can test them using Postman.

## Test this API

### Create an account

`POST` to https://whispering-caverns-88263.herokuapp.com/login/signup. Send:
```
{
  "email":<email>,
  "password":<password>
}
```

You will receive a `User` object.

### Get a token

`POST` to https://whispering-caverns-88263.herokuapp.com/login/signup. Send:
```
{
  "email":<email>,
  "password":<password>
}
```

You will receive a token. Use it to set a `Bearer Token` for the following.

### Create a Group

`POST` to https://whispering-caverns-88263.herokuapp.com/groups. Send:
```
{
  "userId":<userId>,
  "name":"My Group Name",
  "origin":"My Origin",
  "destination":"My Destination"
}
```

You will receive a `Group` object.

Other routes work as expected; see schema and routes below.

Completed items are checked below.

### One Bus Away Routes

`GET` https://whispering-caverns-88263.herokuapp.com/oba/routes/1. You will get data for all the routes for King County Metro.
`GET` https://whispering-caverns-88263.herokuapp.com/oba/routes/1_100252/stops. You will get stops for the route id. The sample is the 62.
`GET` https://whispering-caverns-88263.herokuapp.com/oba/stops/1_420/arrivals. You will get stops for the route id. The sample is the SE 3rd and Virginia.

### Authentication:

- [x] `/signup`
- [x] `/login`
- [x] `/logout`
- [ ] `/reset` -- This route will probably be added at a later date. It requires sending an email.

### App CRUD routes:

Groups:

- [x] POST `/groups`
- [x] GET `/groups` -- should allow `origin` and/or `destination` query params. If those params are sent, the endpoint should return all matching groups, ranked, not just the current user's matches. This would allow people to find groups that others had created and copy them to their own accounts. We should not identify the user that created the group.
- [x] GET `/groups/:id`
- [x] PUT `/groups/:id`
- [x] DELETE `/groups/:id`

Stops:

- [x] POST `/stops`
- [x] GET `/stops` -- [x] should allow a groupId query param to list only stops that belong to a single group.
- [x] GET `/stops/:id`
- [x] PUT `/stops/:id`
- [x] DELETE `/stops/:id`

Buses:

- [x] POST `/buses`
- [x] GET `/buses/` -- should allow a stopId query param to list only buses at a single stop and also a groupId query param to list only buses that belong to the group and stop.
- [x] GET `/buses/:id`
- [x] PUT `/buses/:id`
- [x] DELETE `/buses/:id`

### OneBusAway endpoints:

This data must be pulled from the OneBusAway API using an API key. It should not be stored in Mongo, but the MongoDB data above is necessary to use this data. We DO need to store an API environment API key to access these routes.

- [x] GET `/oba/routes`
- [x] GET `/oba/routes/:id/stops`
- [x] GET `/oba/stops/:id/arrivals`

### Migration:

- [ ] The current app does not have a default option for the group. It also uses one table for buses at stops. We will need to migrate these. We also need to migrate existing users, who will need to reset their passwords.

### Models

User:

- [x] email
- [x] password
- [x] passwordResetToken

Authentication:

- [x] userId
- [x] token

Group:

- [x] userId
- [x] origin
- [x] destination
- [ ] ~default -- boolean, only one default per user, this should be validated, default is false~ -- this attribute was deemed unnecessary

Stop:

- [x] groupId
- [x] stopId -- OneBusAway id, which should be unique to the group

Bus:

- [x] stopId
- [x] busId -- OneBusAway id, must be unique to the stop
