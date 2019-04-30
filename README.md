# Universal address

Giving solutions to addressing the world

# Content

 1. [Inspiration](#Inspiration)
 2. [Value proposition](#Value-proposition)
 3. [What it does](#What-it-does)
 4. [How we built it](#How-we-built-it)
 5. [Challenges we ran into](#Challenges-we-ran-into)
 6. [Accomplishments that we're proud of](#Accomplishments-that-we're-proud-of)
 7. [What we learned](#What-we-learned)
 8. [Install](#Install)

## Inspiration

The United Nation estimates that 4 billion people lack a reliable way to address their homes. They struggle to open bank accounts, register a birth or access electricity or water supplies, becoming invisible to the state. This [paper](http://www.upu.int/fileadmin/documentsFiles/activities/addressingAssistance/whitePaperAddressingTheWorldEn.pdf) states that is not actualy correct but we can that four billion people are excluded from the rule of law, and that one of the reasons is a lack of proper addressing.

The **Universal Address** goal is "addressing the world", so we would love to provide an *universal address (henceforth UA)* for everyone in the world. We also want a easy way to know what is my UA and how to locate an UA on a map. To acomplish all our objectives, we chose a very popular and easy to use Facebook tool, the [Facebook Messenger](). We created a Chat Bot that allows you to create an UA based on some location and also translating UA to geolocations on a map. It seems cool, right? Let's get continue and we will provide further information about our project :)

## Value proposition

Maybe you are wondering: *"What's the value proposition of this project? If I am in a situation that I don't have an address I can share my gps location"*. Well you can share your location whereas the applicaction has the feature to share it. But let's see some examples.

Let's suppose the followings situations and we are going to say how our iniciative is trying to solve every case:
* Mail deliveries (snail mail, supplying packages) by overland transport: let's suppose here that we have printed papers with instructions for the truck driver to ship packages. Many people, for example in Africa, usually don't have a real address, but we can use an UA. We know that the drivers need the exact location, so it is possible to use our application to know where is the UA located 
* Applying for a job / Open a bank account: in many countries (Argentina for example), you must have an address to apply for a job or open a back account. So with our project, everyone who do not have an address will be able to have a unique address and in that way apply for a job or open a bank account.

## What it does

As we were saying, our goal is *"addressing the world"*. It is definitely a hard work, but we wanted to make it simpler using Facebook tools. That's the reason we created a Bot for Facebook Messenger. We introduced a concept called "universal address" (UA) which it means, a way to express a specific locaction with human language (currently only in english). An UA has always the same structure, a word and a number, for example: *Apple 124*. What is really important here, and the key difference between the existing project "[what 3 words](https://what3words.com)" is that we generate an **unique address** per user.

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/0_introduce.PNG" width="350">

The bot basically has two features, you can ask for your UA or you can get information about another UA. If you ask for your UA and it is not created yet, the bot will invite you to create one. To use it, all you have to do is open *Facebook Messenger* and search for "Universal Address". Once a conversation is started, you will be able to choose:

* What's my UA?
* Get UA geolocation
* Help (it will explain you how to use the bot)

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/1_1_greeting.PNG" width="350">

## Option: What's my UA?

In case you don't have an UA yet, once you choose this option, you will see a button (Send Location) to share where you living location

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/1_2_generate_ua.PNG" width="350">

You can search for the locaction by address or drag a waypoint on map.

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/1_3_pick_location.PNG" width="350">

And that's it! You already have an UA for your user.

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/1_4_get_ua.PNG" width="350">

When you choose "What's my UA?" and you already have an UA, the bot will show you the details of your address

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/2_get_ua_again.PNG" width="350">

## Option: Get UA geolocation

When the options appear, you can choose the option *Get UA geolocation*. This option allows you to get the UA exact location and the bot will show you that location on a map.

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/3_1_greeting.PNG" width="350">

Just type the UA and bot will provide you an image with the exact location and a link to google maps

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/3_2_get_ua_location.PNG" width="350">

That's it! You have the exact location on a map and a link to google maps

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/3_3_get_location.PNG" width="350">

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screens/3_4_google_map_link.PNG" width="350">

## How we built it

This application was created using **NodeJS**. These are the main packages that we are using:

* [Facebook API](https://www.npmjs.com/package/fb)
* NodeJS
* MongoDB
* Google Maps
* MapQuest
* Express

## Challenges we ran into

Thanks to our technical experience, the challenge focused on how to give the best user experience, not just for the point of view of the common user, also taking care about developers using our API.

## Accomplishments that we're proud of

Based on our research and the great project [what3words](https://what3words.com/), we are proud of giving a way to solve a global problem.

## What we learned

Thanks to our multicultural team, we had the opportunity to know other kind of problems which are happening in the world and how to solve them with tech solutions.

## What's next for Universal Address

Some features we would like to add:
* Given some location, and considering some distance radius, we could show all the people who have an UA in that radius on a map
* Given a 3 word adderss, we could show all the people who have an UA in that portion of the planet.

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
now --public -e FB_TOKEN_MESSENGER="XXX" -e FB_TOKEN_PAGE="XXX" -e MONGO_USER="XXXX" -e MONGO_PASSWORD="XXXX" -e MAPQUEST_KEY="XXXX" && now alias
```

You can find it currently here:

[https://universal-address.now.sh](https://universal-address.now.sh)

## Database

We are currently using mLab to host the database. mLab is a free solution.

* [mLab](https://mlab.com/)

## License

Released under the terms of the MIT license.

# References

1. [Addressing the world paper](http://www.upu.int/fileadmin/documentsFiles/activities/addressingAssistance/whitePaperAddressingTheWorldEn.pdf), Universal Postal Union
2. [What 3 Words project](https://what3words.com/about)

# About Us

- [Ariel Rey](https://github.com/arielfr/)
- [Horacio Lopez](https://github.com/hdlopez/)
- [Daeyeol Ryu](https://github.com/yoobato/)