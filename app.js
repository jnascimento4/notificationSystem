const express = require('express');
const { NotificationSystem, SMSNotification, EmailNotification, PushNotification } = require('./models/notificationSystem');
const users = require('./data/users.json');
const fs = require('fs');

const app = express();
const notificationSystem = new NotificationSystem();

// Set up middleware to parse form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up static file serving
app.use(express.static('public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

const filePath = './logs/notifications.json';
fs.writeFileSync(filePath, '', { flag: 'w' });

// Home route
app.get('/', (req, res) => {
    let logs = [];
    const filePath = './logs/notifications.json';
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        logs = JSON.parse(fileContent);
        logs.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    res.render('index', { logs });
});

app.post('/', (req, res) => {
    const { category, message } = req.body;
    const messageType = `${category} message`;
    
    const subscribers = users.filter((user) => user.subscribed.includes(category));
    subscribers.forEach((subscriber) => {
        if (subscriber.channels.includes('SMS')) {
            notificationSystem.subscribe(category, new SMSNotification());
        }
        if (subscriber.channels.includes('Email')) {
            notificationSystem.subscribe(category, new EmailNotification());
        }
        if (subscriber.channels.includes('Push Notification')) {
            notificationSystem.subscribe(category, new PushNotification());
        }
        subscriber.date = new Date();
        subscriber.message = message;
        subscriber.categorySubmitted = category;
    });

    notificationSystem.sendNotification(category, message);
    notificationSystem.logNotification(category, messageType, subscribers);

    res.redirect('/');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
