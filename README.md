# webservices-pieter-2122-JentlSuy
# BeerReview API - Jentl Suy

## Idea

The api provides a list of beers along with there breweries. The idea is that users can review their favorite beers.

## How to start

To start this API, check the `.env` file in the root of this folder.

```
NODE_ENV="development"
DATABASE_USERNAME="root"
DATABASE_PASSWORD="root"
```

Update the username and password with the credentials of your local database.

Run the app with `yarn start`.

## How to test

Test the app with `yarn test`.
Note that the app is tested with the `--runInBand` CLI flag to prevent Jest from testing in parallel. You can change this in the `package.json`.

## Common errors

* Modules not found errors, try this and run again:

```
yarn install
```

* Migrations failed, try dropping the existing `beerreview` database and run again.