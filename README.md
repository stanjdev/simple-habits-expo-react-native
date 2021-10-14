# Simple Habits
![Logo](https://d1wp6m56sqw74a.cloudfront.net/~assets/cbd310dcfd48bf9b4f6479258eb66749)
Simple Habits is an iOS and Android mobile app for tracking habits. It uses push notifications to prompt a user to mark if they did or did not complete a habit for that day. A user's interaction with the notification writes a row of data into a Google Sheet.

## Installation
On iPhone, download [Expo Go](https://apps.apple.com/us/app/expo-go/id982107779) (Expo may not load this app on iPhone due to Apple's restrictions)

On Android, download [Expo](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US)

Using your phone camera, scan the QR Code at https://expo.dev/@stan.dev/Simple-Habits to install the app onto your device.

<img width="1532" alt="Screen Shot 2021-10-14 at 4 20 51 PM" src="https://user-images.githubusercontent.com/61481150/137408329-e41e35ad-1ffe-4067-91b3-f6dc31576759.png">

## Usage
Navigate to the `Add Habits` screen to add a habit to track, the frequency of days to track it, and the time at which you want to be reminded with a push notification.

Navigate to the `Saved Habits` screen to see the habits you are currently tracking. Swipe left on any of the habits to delete. 

Press on a habit to launch a notification. Press and hold on a notification to reveal the `DONE` and `DONE + ADD NOTE` options. Any interaction will write a row of data onto this [Google Sheet](https://docs.google.com/spreadsheets/d/1Z5V7z8_UtTlr0oNe1ljyQBhOCBvtOjh-rYA5Dr_meBM/edit#gid=900287353).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
