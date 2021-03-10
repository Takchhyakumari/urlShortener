const express = require('express'),
	  mongoose = require('mongoose'),
	  ShortUrl = require('./models/shortUrl'),
	  app = express();

mongoose.connect('mongodb://localhost:27017/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/', async (req,res)=>{
	const shortUrls = await ShortUrl.find()
	res.render('main', {shortUrls: shortUrls});
})

app.post('/shortUrls', async (req,res)=>{
	await ShortUrl.create({full: req.body.fullUrl})
	res.redirect('/');
})

app.get('/:shortUrl', async (req,res)=>{
	const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
	if(shortUrl == null) return res.sendStatus(404)
	shortUrl.clicks++
	shortUrl.save()
	res.redirect(shortUrl.full)
})

app.listen(3000, function(){
	console.log("Sever has started!");
});