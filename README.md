# Universal address

Giving solutions to addressing the world

# Content

 1. [Inspiration](#Inspiration)
 2. [What it does](#What-it-does)
 3. [How we built it](#How-we-built-it)
 4. [Challenges we ran into](#Challenges-we-ran-into)
 5. [Accomplishments that we're proud of](#Accomplishments-that-we're-proud-of)
 6. ...
 7. ...
 8. [Install](#Install)

## Inspiration

Sadly, in the world what we are living we have many disasters and problems around the world. For instance, disasters like floods, earthquakes, wars, and so many others, force people to evacuate their homes. In that situations, people and organtizations around the world want to help sending medicines, food, clothes, and other things, but, what is the 'address' of those people? In many situations, they do not have an address, and that simple problem is actually a big problem. That's only an example, but there are many others example, like people living in Africa who don't have any address.

**Universal Address** project's aim is "addressing the world", so we would love to provide a new concept, an *universal address (henceforth UA)* for every place in the world. We also want a easy way to know what is my UA and how to locate an UA on a map. To acomplish all our objectives, we chose a very popular and easy to use Facebook tool, the [Facebook Messenger](). We created a Chat Bot that allows you to create an UA based on some location and also translating UA to geolocations on a map. It seems cool, right? Let's get continue and we will provide further information about our project :)

## Value proposition

Maybe you are wondering: *"What's the value proposition of this project? If I am in a situation that I don't have an address I can share my gps location"*. Well you can share your location whereas the applicaction has the feature to share it. But let's see some xamples.

Let's suppose followings situations and we are going to tell you how our iniciative is trying to solve every case:
* Places with weak GPS signal: if you are in place that GPS does not work well, although you can share your location, it is useless. Our project, based an UA can translate it to exact location on a map, and you can get it as an image or a link to google maps
* Suppling packages (medicines, food or clothes) by overland transport to a refugees´s camp: let's suppose here that we have printed papers with instructions for the truck driver to ship our packages to the camp. Refugees's camps usually don't have a real address, but we can use an UA. We know that the drivers need the exact location of the camp, so it is possible to use our application to know that location based on an UA adresss. 



## What it does
TBD

## How we built it
This application was created using **NodeJS**. These are the main packages that we are using:

- [Facebook API](https://www.npmjs.com/package/fb)
- NodeJS
- MongoDB
- Google Maps
- MapQuest
- Express

## Challenges we ran into

Thanks to our technical experience, the challenge focused on how to give the best user experience, not just for the point of view of the common user, also taking care about developers using our API.

## Accomplishments that we're proud of

Based on our research and the great project [what3words](https://what3words.com/), we are proud of giving a way to solve a global problem.

## What we learned

Thanks to our multicultural team, we had the opportunity to know other kind of problems which are happening in the world and how to solve them with tech solutions.

## What's next for Universal Address

## Install

### Application

Just clone the repository and type in a console:

```bash
npm install
```

Done!

### Database

To run a MongoDB locally we encourage to use Docker:

```bash
docker run --name mongo -p 27017:27017 -d mongo
```

### Hosts

If you wan't to run the "main" page locally, you need to add the next entry on `/etc/hosts`:

```bash
127.0.0.1           XXXXXXXXX.com
```

#### Start (Production)

```bash
npm start
```

#### Start (Development)

If you start the application this way, you are not going to be posting messages on Facebook

```bash
npm start-dev
```

## Deployment

This application is currently deployed on a Zeit ([now.sh](http://now.sh)). It already have the configurations on `now.json` file.

If you want to deploy it, you just need to execute:

```bash
now
```

You can find it currently here:

[https://universal-address.now.sh](https://universal-address.now.sh)

## Database

We are currently using mLab to host the database. mLab is a free solution.

- [mLab](https://mlab.com/)

## License

Released under the terms of the MIT license.

# About

- [Ariel Rey](https://github.com/arielfr/)
- [Horacio Lopez](https://github.com/hdlopez/)
- [Daeyeol Ryu](https://github.com/yoobato/)
