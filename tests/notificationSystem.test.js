const fs = require('fs');
const { NotificationSystem, SMSNotification, EmailNotification, PushNotification } = require('../models/notificationSystem');

describe('NotificationSystem', () => {
  let notificationSystem;

  beforeEach(() => {
    notificationSystem = new NotificationSystem();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should subscribe a subscriber to a category', () => {
    const subscriber = new SMSNotification();
    notificationSystem.subscribe('sports', subscriber);

    expect(notificationSystem.subscribers).toEqual({ sports: [subscriber] });
  });

  test('should send notification to subscribers of a category', () => {
    const subscriber1 = new SMSNotification();
    const subscriber2 = new EmailNotification();

    notificationSystem.subscribe('sports', subscriber1);
    notificationSystem.subscribe('sports', subscriber2);

    const notifySpy1 = jest.spyOn(subscriber1, 'notify');
    const notifySpy2 = jest.spyOn(subscriber2, 'notify');

    notificationSystem.sendNotification('sports', 'New sports update');

    expect(notifySpy1).toHaveBeenCalledTimes(1);
    expect(notifySpy1).toHaveBeenCalledWith('New sports update');

    expect(notifySpy2).toHaveBeenCalledTimes(1);
    expect(notifySpy2).toHaveBeenCalledWith('New sports update');
  });

  test('should not send notification if there are no subscribers for the category', () => {
    const subscriber = new PushNotification();
    notificationSystem.subscribe('finance', subscriber);

    const notifySpy = jest.spyOn(subscriber, 'notify');

    notificationSystem.sendNotification('sports', 'New sports update');

    expect(notifySpy).not.toHaveBeenCalled();
  });

  test('should log notification', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue('');
    jest.spyOn(fs, 'writeFileSync');

    const category = 'sports';
    const messageType = 'SMS';
    const userData = [{ id: 1, name: 'John' }];

    notificationSystem.logNotification(category, messageType, userData);

    expect(fs.readFileSync).toHaveBeenCalledWith('./logs/notifications.json', 'utf-8');
    expect(fs.writeFileSync).toHaveBeenCalledWith('./logs/notifications.json', expect.any(String));
  });
});

describe('SMSNotification', () => {
  test('should send SMS notification', () => {
    const smsNotification = new SMSNotification();
    console.log = jest.fn();

    smsNotification.notify('New message');

    expect(console.log).toHaveBeenCalledWith('Sending SMS notification:', 'New message');
  });
});

describe('EmailNotification', () => {
  test('should send email notification', () => {
    const emailNotification = new EmailNotification();
    console.log = jest.fn();

    emailNotification.notify('New message');

    expect(console.log).toHaveBeenCalledWith('Sending email notification:', 'New message');
  });
});

describe('PushNotification', () => {
  test('should send push notification', () => {
    const pushNotification = new PushNotification();
    console.log = jest.fn();

    pushNotification.notify('New message');

    expect(console.log).toHaveBeenCalledWith('Sending push notification:', 'New message');
  });
});
