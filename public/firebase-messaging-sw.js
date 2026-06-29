importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDKka-u0KI7DNsDPB8fotkcFTWK1eT5GO8',
  authDomain: 'ordino-notifications.firebaseapp.com',
  projectId: 'ordino-notifications',
  storageBucket: 'ordino-notifications.firebasestorage.app',
  messagingSenderId: '811967005762',
  appId: '1:811967005762:web:55eda318f70c2a310499db',
});

const messaging = firebase.messaging();

const notificationChannel = new BroadcastChannel('notifications');

messaging.onBackgroundMessage((payload) => {
  const { title = 'New message', body = '' } = payload.notification ?? {};

  self.registration.showNotification(title, {
    body,
    icon: '/images/icons/notifications-unread.png',
    data: payload.data,
  });

  notificationChannel.postMessage({ type: 'NEW_NOTIFICATION' });
});
