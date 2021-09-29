const express = require('express');
const path = require('path');
const mongo = require('mongoose');
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');
const homeRouter = require('./routes/home');
const addRouter = require('./routes/add');
const cartRouter = require('./routes/cart');
const coursesRouter = require('./routes/courses');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorMiddleware = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const { MONGO_URI, DEFAULT_PORT, SECRET_SESSION } = require('./keys/index');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(handlebars),
  helpers: require('./utils/helpers'),
});

const store = new MongoStore({
  collection: 'sessions',
  uri: MONGO_URI,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
        defaultSrc: ["'self'"],
        blockAllMixedContent: [],
        fontSrc: ["'self'", 'https:', 'data:'],
        frameAncestors: ["'self'", 'https://accounts.google.com/'],
        frameSrc: ["'self'", 'https://accounts.google.com/'],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'self'", 'blob:'],
        mediaSrc: ["'self'", 'blob:', 'data:'],
        scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com/'],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        upgradeInsecureRequests: [],
        connectSrc: ["'self'", 'https://my-app.herokuapp.com'],
    },
  },
}));
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);
app.use('/', homeRouter);
app.use('/add', addRouter);
app.use('/cart', cartRouter);
app.use('/courses', coursesRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

app.use(errorMiddleware);


(async () => {
  try {
    await mongo.connect(MONGO_URI, {
      useNewUrlParser: true,
    });
    
    const PORT = process.env.PORT || DEFAULT_PORT;
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch(e) {
    console.log('🚀 ~ file: index.js ~ line 76 ~ e', e);
  }
})();