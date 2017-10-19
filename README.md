
## Fivetaent realestate test app

This is a node.js application illustrating various features modeled for a real estate app listing app. Users can signi up using simple registrations, can create a listing, delete an listing and add features on the listing for later search (filtering).


## Testing
The app is running on heroku at [laughing-guacamole.herokuapp.com](http://laughing-guacamole.herokuapp.com).



## Install
The app lives on Github at [laughing-guacamole](https://github.com/thinq4yourself/laughing-guacamole)

```sh
$ git clone git://github.com/thinq4yourself/laughing-guacamole-demo.git
$ npm install
```

The app uses heroku environment variables [here](https://devcenter.heroku.com/articles/config-vars), but you can use local `.env` file to run locally.

## Run app

```sh
$ npm start
```

Then visit [http://localhost:3000/](http://localhost:3000/)

## Tests

```sh
$ npm test
```

## Database
The app uses Mongo as a service from  Mongolab to host a cloud version of Mongo. The app is configured to use a test instance for dev and test in `config/env`).

The account that dev uses is a read only mongo account - to show best practices in including keys in repo, they are read only. Heroky has write access account for Mongo as the ENV var `process.env.MONGOHQ_URL`. 

## License

GNU 3

See [LICENSE](LICENSE.txt)