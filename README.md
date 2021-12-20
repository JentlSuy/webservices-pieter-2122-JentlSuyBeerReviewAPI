# webservices-pieter-2122-JentlSuy

# BeerReview API - Jentl Suy

## Idea

The api provides a list of beers along with there breweries. The idea is that users can review their favorite beers by giving it a rating.

## What the data looks like

- A review is created by a _user_ and contains a _rating_ (0-5) of a beer, a _description_ explaining the review, a _date_ and the _beer_id_ of the _beer_ that is reviewed.
- A user has a _name_, an _email_-address, a hashed _password_ and a _role_ (USER or ADMIN).
- A beer contains a _name_, the _brewery_id_ of where the beer is brewed and an alcohol _percentage_.
- A brewery has a _name_ and _country_ of where the brewery is located.

| reviews               | users                   | beers               | breweries         |
| :-------------------- | :---------------------- | :------------------ | :---------------- |
| id : CHAR             | id : CHAR               | id : CHAR           | id : CHAR         |
| rating : INT          | name : VARCHAR          | name : VARCHAR      | name : VARCHAR    |
| description : VARCHAR | email : VARCHAR         | brewery_id : CHAR   | country : VARCHAR |
| date : DATETIME       | password_hash : VARCHAR | percentage : DOUBLE |                   |
| user_id : CHAR        | roles : JSON            |                     |                   |
| beer_id : CHAR        |                         |                     |                   |

##### Example data in MySQL:

```
select re.id as review_id, be.name as beer, br.name as brewery, rating, description, us.name as user, re.date from reviews re
join beers be on be.id = re.beer_id
join users us on us.id = re.user_id
join breweries br on br.id = be.brewery_id;
```

![image](https://user-images.githubusercontent.com/56795157/146791463-ab5e8deb-abb8-4a91-a228-a47d695a6964.png)

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

## Swagger

Note that Swagger is included with this API. To use Swagger, simply go to [http://localhost:9000/swagger](url) to view all the existing API-calls. _The published url will be added later._

## How to log-in

Every API-call in this application requires authentication. Use the _login_ call in Swagger or go to http://localhost:9000/api/users/login in Postman.

In order to login, you will need an email and password. You can create a new account using the _register_ call or use the credentials below:

ADMIN:

```
{
    "email": "jentl.suy@student.hogent.be",
    "password": "12345678"
}
```

USER:

```
{
    "email": "gdb@gmail.com",
    "password": "12345678"
}
```

You will receive a token as a response. Use this token as a bearerAuthentication token to get access to every other api-call in this application.

**Note**: only an ADMIN can access the user-related API-calls.

## Print-out of the Swagger API

![image](https://user-images.githubusercontent.com/56795157/146790791-beb6997f-a338-4507-8cf2-0fba6c4da7f2.png)

## About the test-files

There are currently 2 objects (reviews & beers) tested in the rest-folder that contain a total of 11 tests. Every existing call that is used with these 2 objects is tested. The coverage of these tests are above 80 % as you can see in the screenshot below:

![image](https://user-images.githubusercontent.com/56795157/146791929-453f5e7f-17d6-4da6-a3ae-d2664e69a7a4.png)

## Common errors

- Modules not found errors, try this and run again:

```
yarn install
```

- Migrations failed, try dropping the existing `beerreview` database and run again.
