# Bus Dashboard API

Our proposal is to create a Node.js API for the Bus Dashboard React app that Lynne created for JS300. The Github repo for the app is at https://github.com/ilynne/bus-arrival-dashboard. It is currently hosted on https://intense-brushlands-86127.herokuapp.com/.

The current app uses Firebase for authentication and app data. It uses a Rails API for calls to the OneBusAway API because it requires an API key. All the data needed to authenticate and consume real time OneBusAway arrival data would be moved to a MongoDB database.

The bus dashboard displays groups of buses at stops. If you have a few stops close by that give you different options for routes, there is no central location to check them all. The Bus Dashboard fills that need.

## Planned routes

### Authentication:

- `/signup`
- `/login`
- `/logout`
- `/reset`

### App CRUD routes:

Groups:

- POST `/groups`
- GET `/groups` -- should allow `origin` and/or `destination` query params. If those params are sent, the endpoint should return all matching groups, ranked, not just the current user's matches. This would allow people to find groups that others had created and copy them to their own accounts. We should not identify the user that created the group.
- GET `/groups/:id`
- PUT `/groups/:id`
- DELETE `/groups/:id`

Stops:

- POST `/stops`
- GET `/stops` -- should allow a groupId query param to list only stops that belong to a single group.
- GET `/stops/:id`
- PUT `/stops/:id`
- DELETE `/stops/:id`

Buses:

- POST `/buses`
- GET `/buses/` -- should allow a stopId query param to list only buses at a single stop and also a groupId query param to list only buses that belong to the group and stop.
- GET `/buses/:id`
- PUT `/buses/:id`
- DELETE `/buses/:id`

### OneBusAway endpoints:

This data must be pulled from the OneBusAway API using an API key. It should not be stored in Mongo, but the MongoDB data above is necessary to use this data. We DO need to store an API environment API key to access these routes.

- GET `/oba/routes`
- GET `/oba/routes/:id/stops`
- GET `/oba/stops/:id/arrivals`

### Migration:

The current app does not have a default option for the group. It also uses one table for buses at stops. We will need to migrate these. We also need to migrate existing users, who will need to reset their passwords.

### Models

User:

- email
- password
- passwordResetToken

Authentication:

- userId
- token

Group:

- userId
- origin
- destination
- default -- boolean, only one default per user, this should be validated, default is false

Stop:

- groupId
- stopId -- OneBusAway id, which should be unique to the group

Bus:

- stopId
- busId -- OneBusAway id, must be unique to the stop
