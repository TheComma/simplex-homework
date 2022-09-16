
# Tadas Simplex-Homework


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` - Application port to launch

`LOG_FORMAT` - Morgan log format type

`LOG_DIR` - Log file storage for winston

`EXCHANGE_RATE_API_URL` - URL for exchange rate 3rd party Application

`CACHE_MAX_SIZE` - Size of cache for rates to be stored

`TTL_FOR_CACHE_RECORD` - Time after which record must be evicted from cache in millis

Example values can be found in .env.sample.local

## Run Locally

Clone the project

```bash
  git clone https://github.com/TheComma/simplex-homework.git
```

Go to the project directory

```bash
  cd simplex-homework
```

Install dependencies

```bash
  yarn
```

Create file and set enviroment parameters
```
.env.development.local 
```

or 

```
.env.production.local 
```

Start the server

```bash
  yarn dev
```
or in case of production

```bash
  yarn start
```

