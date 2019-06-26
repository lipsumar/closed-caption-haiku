
## Setup

```bash
$ npm install
$ npm start
```

## Dev

Create a mongo db locally:

```bash
$ docker run -p 27017:27017 mongo
```

Setup env file. example:

```
GOOGLE_CUSTOM_SEARCH_API_KEY=...
GOOGLE_CX=...
MONGO_URL=mongodb://localhost:27017
```


## Backup

### Create a backup

```bash
$ npm run backup:create
```

### Restore backup remotely

```bash
scp backups/<some-backup> dokku:/root/
ssh dokku 'dokku mongo:import cchaiku < <some-backup>'
```

### Restore a backup locally:

```bash
$ docker run -p 27017:27017 -v /Users/emmanuelpire/dev/closed-caption-haiku/backups:/backups mongo
```

then bash into the container:

```bash
$ docker exec -it <containerID> bash
```

and import any backup:

```bash
$ mongorestore --host localhost:27017 --gzip --db cchaiku --archive=/backups/cchaiku-dump-<date>.gz
```
