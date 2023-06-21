# Notification System Project

This project implements a notification system that allows sending messages to subscribers based on different categories and notification types. It is built using Node.js for the back-end, EJS for the front-end, and follows the Observer design pattern.

## Features

- Three message categories: Sports, Finance, and Movies
- Three notification types: SMS, E-Mail, and Push Notification
- Ability to subscribe users to specific categories and notification types
- Logging of sent notifications in a log file

## Installation

1. Clone the repository:

```bash
$ git clone https://github.com/your-username/notification-system.git
 
 #Install the dependencies:
 $ npm install

#Start the server
 $ node app.js

4. Open your browser and navigate to http://localhost:3000 to access the application.
```
## Usage

1. On the home page, you will find a submission form where you can enter the message category and the message content.
2. Select the desired category from the dropdown menu and enter the message in the text area.
3. Click the "Send" button to send the notification to the subscribers.
4. The sent notifications will be logged in the log history section on the same page.

## Project Structure

├── app.js
├── data
│   └── users.json
├── logs
│   └── notifications.log
├── models
│   └── notificationSystem.js
├── public
│   └── styles.css
├── tests
│   └── notificationSystem.test.js
└── views
    └── index.ejs
