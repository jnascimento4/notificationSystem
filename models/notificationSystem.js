const fs = require('fs');

class NotificationSystem {
    constructor() {
        this.subscribers = {};
    }

    subscribe(category, subscriber) {
        if (!this.subscribers[category]) {
            this.subscribers[category] = [];
        }
        this.subscribers[category].push(subscriber);
    }

    sendNotification(category, message) {
        if (!this.subscribers[category]) {
            return; // No subscribers for this category
        }
        const subscribers = this.subscribers[category];
        subscribers.forEach((subscriber) => {
            subscriber.notify(message);
        });
    }

    writeToLog(log) {
        fs.appendFileSync('./logs/notifications.json', log + '\n');
    }

    logNotification(category, messageType, userData) {       
    
        // Ler o arquivo JSON existente e converter em um objeto JavaScript
        let existingData = [];
        try {
            const fileContent = fs.readFileSync('./logs/notifications.json', 'utf-8');
            existingData = fileContent ? JSON.parse(fileContent) : undefined;
        } catch (error) {
            console.error('Error reading existing log:', error);
        }
    
        // Adicionar o novo log à lista existente
        if(existingData != undefined){
            userData.forEach(user => existingData.push(user))            
        }else{
            existingData = userData;
        }
        
    
        // Escrever o objeto JavaScript atualizado no arquivo JSON
        try {
            fs.writeFileSync('./logs/notifications.json', JSON.stringify(existingData, null, 2));
        } catch (error) {
            console.error('Error writing log:', error);
        }
    }
    
}

class SMSNotification {
    notify(message) {
        // Logic to send SMS notification
        console.log('Sending SMS notification:', message);
    }
}

class EmailNotification {
    notify(message) {
        // Logic to send email notification
        console.log('Sending email notification:', message);
    }
}

class PushNotification {
    notify(message) {
        // Logic to send push notification
        console.log('Sending push notification:', message);
    }
}

module.exports = {
    NotificationSystem,
    SMSNotification,
    EmailNotification,
    PushNotification,
};
