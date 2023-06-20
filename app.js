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

// Home route
app.get('/', (req, res) => {
    const logs = fs.readFileSync('./logs/notifications.log', 'utf-8').split('\n').filter(Boolean).reverse();
    res.render('index', { logs });
});

// Notification submission route
app.post('/', (req, res) => {
    const { category, message } = req.body;
    const messageType = `${category} message`;

    // Logic to find subscribers based on category from the users.json file
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
    });

    notificationSystem.sendNotification(category, message);
    notificationSystem.logNotification(category, messageType, subscribers);

    res.redirect('/');
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
