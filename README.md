# Universal address

Giving solutions to addressing the world

# Content

 1. [Inspiration](#Inspiration)
 2. [Value proposition](#Value-proposition)
 3. [What it does](#What-it-does)
    1. [About our Messenger Bot](#About-our-messenger-Bot)
    2. [About our API](#About-our-api)
 4. [How we built it](#How-we-built-it)
 5. [Challenges we ran into](#Challenges-we-ran-into)
 6. [Accomplishments that we're proud of](#Accomplishments-that-we're-proud-of)
 7. [What we learned](#What-we-learned)
 8. [Next steps for Universal Address](#Next-steps-for-Universal-Address)
 9. [Install](#Install)

## Inspiration

The United Nations estimates that 4 billion people lack a reliable way to address their homes. They struggle to open bank accounts, register a birth or access electricity or water supplies, becoming invisible to the state. This [paper](http://www.upu.int/fileadmin/documentsFiles/activities/addressingAssistance/whitePaperAddressingTheWorldEn.pdf) states that four billion people are excluded from the rule of law, and that one of the reasons is a lack of proper addressing.

The **Universal Address** goal is "addressing the world", so we would love to provide an *universal address (henceforth UA)* for everyone in the world. We also love to provide super easy way to generate UA and resolve loation on a map from UA. To acomplish all our objectives, we chose a [Facebook Messenger](https://www.messenger.com/) which is very popular and easy to use. We created a Chat Bot that allows user to create their own UA based on their location and also converting UA to geolocation. It seems cool, right? Let's get continue and we will give further information about our project :)

## Value proposition

Maybe you'll wondering: *"What's the main value of this project? If I'm a person who don't have an address, still I can share my geolocation using GPS"*. Well, you can share your geolocation, but it's hard to recognize and remember. The application even has the feature to share UA. Let's see some examples.

Let's suppose the following situations, and then we are going to say how we solves each case:
* **Mail deliveries** (e.g. snail mail, supplying packages): Let's suppose that we have printed papers with instructions for the delivery man to ship some packages. Many people, especially living in backwoods, usually don't have an address. In this case, they can generate UA. The UA is based on geolocation, so the delivery man can know the exact location.
* **Applying for a job / Open a bank account**: In many countries (Argentina for example), you must have an valid address to apply for a job or open a back account. With UA, everyone who don't have an address will be able have a unique address. In this way, they can apply for a job or open a back account.

## What it does

As we said, our goal is *"addressing the world"*. It was definitely a hard work, but we wanted to make it simpler with Facebook tools. That's the reason we created a Bot for Facebook Messenger. We've introduced a concept called "Universal Address" (UA). It's a way to express a specific locaction with human friendly languages like English. The UA always has the same structure, one word with one number, for example: *apple 124*. The key difference between the existing project "[what 3 words](https://what3words.com)" is that we generate an **unique address** per user.

![Introduce](https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/0_introduce.png)

### About our Messenger Bot

The bot basically has two features. First, you can ask for your UA. Also you can get a geolocation information about any UA. If you ask for your UA and you don't have one yet, the bot will invite you to create one. To use this, all you have to do is just open *Facebook Messenger* and search for "Universal Address". Once a conversation is started, you'll get a quick replies:

* What's my UA?
* Get UA geolocation
* Help (it will explain you how to use the bot)

![Greeting](https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/1_1_greeting.png)

## Option: What's my UA?

In case you don't have an UA yet, once you choose this option, you will see a button (Send Location) to share your living location.

![Generate UA](https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/1_2_generate_ua.png)

You can search for the locaction by address or just drag and drop a marker on the map.

![Pick Location](https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/1_3_pick_location.png)

And that's it! Now you have your own UA.

![Get UA](https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/1_4_get_ua.png)

If you already have an UA, but you cannot remember, just choose "What's my UA?". Then the bot will show your UA again.

![Get UA again](https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/2_get_ua_again.png)

## Option: Get UA geolocation

When the quick replies appear, you can choose the option *Get UA geolocation* to fetch geolocation information about some UAs you have. This allows you to get the exact geolocation of UA. The bot will gives you the map.

![Greeting](https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/3_1_greeting.png)

Just type the UA, then bot will provide you an map image with the exact location and a link to google maps.

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/3_2_get_ua_location.png"/>

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/3_3_get_location.png"/>

<img src="https://raw.githubusercontent.com/arielfr/universal-address/master/docs/screenshots/3_4_google_map_link.png"/>

### About our API

We also provide a public API that allows to empower companies and goverments. How? Our API allows you to search by UA and get geolocation informations. It's useful for organizations want to send packages like Fedex, DHL, USPS, etc.

You can also get the information about how many people is living in a certain area. This is really needed feature for goverments to measure the population by grid area in their countries.

More information about our API, [here](https://universal-address.now.sh/docs) is the technical information served with Swagger.

## How we built it

This application was created with **NodeJS**. These are the main packages that we are using:

* [Facebook API](https://www.npmjs.com/package/fb)
* [NodeJS](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/)
* [Google Maps](https://www.google.com/maps)
* [MapQuest](https://www.mapquest.com/)
* [Express](https://expressjs.com/)

## Challenges we ran into

Thanks to our technical experience, the challenge focused on how to give the best user experience, not just for the point of view from the common user, also taking care about developers using our API.

## Accomplishments that we're proud of

Based on our research and the great project [what3words](https://what3words.com/), we are proud of giving a way to solve a global problem related to [SDG 11](https://f82019.devpost.com/details/sdg11).

## What we learned

Thanks to our multi-cultural team, we had the opportunity to know other kind of problems which are happening in the world and how to solve them with tech solutions.

## Next steps for Universal Address

Some features we would like to add:
* Given some location, and considering some distance radius, we could show all the people who have an UA in that radius on a map
* Given a 3 word adderss, we could show all the people who have an UA in that portion of the planet.

## Install

### API server

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

This application is currently deployed on a Zeit ([now.sh](http://now.sh)). Configurations are on `now.json` file.

If you want to deploy it, what you need is just execute command following:

```bash
now --public -e FB_TOKEN_MESSENGER="XXX" -e FB_TOKEN_PAGE="XXX" -e MONGO_USER="XXXX" -e MONGO_PASSWORD="XXXX" -e MAPQUEST_KEY="XXXX" && now alias
```

Currently you can find it here:

[https://universal-address.now.sh](https://universal-address.now.sh)

## Database

We are currently using mLab to host the database. mLab is a free solution.

* [mLab](https://mlab.com/)

## License

Released under the terms of the [MIT license](LICENSE.md).

# References

1. [Addressing the world paper](http://www.upu.int/fileadmin/documentsFiles/activities/addressingAssistance/whitePaperAddressingTheWorldEn.pdf), Universal Postal Union
2. [What 3 Words project](https://what3words.com/about)

# About Us

- [Ariel Rey](https://github.com/arielfr/)
- [Horacio Lopez](https://github.com/hdlopez/)
- [Daeyeol Ryu](https://github.com/yoobato/)