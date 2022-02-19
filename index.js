const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
require('dotenv').config()
const flash = require('connect-flash');
const express = require('express')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access') 
const mongoose = require('mongoose') 
const path = require('path') 
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const authRoutes = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user')
const keys = require('./keys')


const app = express() 
const hbs = exphbs.create({
    defaultLayout:'main',
    extreme:'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const store = new MongoStore({
    collection: 'session', 
    uri: keys.MONGODB_URL
})
 
//Регистрация модуля как движка HTML страниц
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})) // Регистрация




app.set('view engine', 'hbs') // Использование
app.set('views', 'views') // 2. параметр это папка где хранятся шаблоны
 
//регистрация Routes
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)


app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders',ordersRoutes)
app.use('/auth', authRoutes)
 
 
//Установка порта и подключение к базе данных на сервере mongodb.net
const PORT = process.env.PORT || 3001
async function start() {
    try{
        await mongoose.connect(keys.MONGODB_URL, {
            useNewUrlParser:true
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }catch (e){
        console.log(e)
    }
}
 
start()


