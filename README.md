# SpeedrunLeaderboard
Speedrunning Leaderboard Template

### Installation:
A couple of dependencies you will need: [NodeJS](https://nodejs.org/en/download/) - A JavaScript runtime, it also has NPM built-in.

Once NodeJS is installed, install the NPM dependencies.

- `cd <root directory>`
- `npm i --save`

Rename the `.env.example` to `.env` and configure it accordingly.

```
API_PORT=MY-API-PORT
```

### Running the API:
Running the API is quite simple.

- `cd <root directory>`
- `node .` or `node main`

### Running the Tests:
Running the tests is easy as well. 

- `cd <root/tests/>`
- `node database.test.js`

or

- `node examples/database.test.js`