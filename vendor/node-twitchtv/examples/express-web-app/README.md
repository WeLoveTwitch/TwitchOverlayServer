# Using ExpressJS + NodeJS + Twitch API

This directory is an example application built with NodeJS and Express to render out
a number of games with game covers.

![Screenshot of the app](https://raw.github.com/jbueza/node-twitchtv/master/examples/express-web-app/ScreenShot.png)


### Install module dependencies

```
npm install
```

### Run the app!

```
node app.js
```

[View it on localohost](http://localhost:3000)


## Deployment on Heroku?

No problem! Add a Procfile to the root of your application:

```
web: node app.js
```

Then push to heroku!

```
git push heroku master
```

## Depoyment on Windows Azure?

No problem! Ensure that when you create a new Windows Azure Website, add the "azure" remote!

```
git remote add azure GENERATED_FROM_AZURE
```

Then push to Azure (remember to put in your credentials)!

```
git push azure master
```


## Questions?

[Feel free to reach out!](mailto:jbueza@gmail.com?subject=TwitchTV NodeJS Client)