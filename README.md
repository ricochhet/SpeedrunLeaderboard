***This project is no longer actively being developed.***
## SpeedrunLeaderboard
Speedrunning Leaderboard Template

## Installation & Deployment

### Production

- Change `.env.example` to `.env`.
- Edit `.env` with your options of choice.

- Open a terminal and execute the following commands:

```bash
npm i --save
cd client
npm run build
```

- To run, open a terminal and execute the following command:

```bash
node main
```

### Development

- Change `.env.example` to `.env`.
- Edit `.env` with your options of choice.

- Open a terminal and execute the following command:

```bash
node main
```
- Open a second terminal and execute the following commands:

```bash
npm i --save
cd client
npm run serve
```

## Features
- Easy to use API.
- Secure login & authentication system.
- Submission form with sanitization and validation checks.
- Dashboard (for logged in users) to approve and/or decline submissions.
 
## TODO
- ~~Login / Auth system.~~
- ~~Submission approval admin page. (Still needs to be worked on)~~
- ~~Config option to differentiate between production and development version. (Likely x000 port)~~
- ~~Include main monster to complete quest in data table. (For sorting).~~
- ~~API can sort between different categories, (runner, weapon, quest, monsters, ruleset, etc).~~
- **Move auth username / password to .ENV**
