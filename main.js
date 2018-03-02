const pushNotificationPublicKey = 'BBMLkY9uGZhFnU7S_UyTweHVaYNJbR70EMFc9iXnDhLA1eU7axYbNVWDtJnePLEBwmQncA21uR0LNq7x0r5P154';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function showNotificationBell() {
  document.querySelector('.bell-container').classList.add('show');
  document.querySelector('#subscribe').classList.add('hide');
}

function initialisePushNotification(swRegistration) {
  swRegistration.pushManager.getSubscription().then(subscription => {
    console.log("Your subscription ", subscription);
    localStorage.setItem('pushSubscription', JSON.stringify(subscription));
    if(subscription === null) {
      console.log("user not subscribed");
    } else {
      console.log("user subscribed");
      showNotificationBell();
    }
  });
}

if("serviceWorker" in navigator && "PushManager" in window) {
  console.log("Service worker and Push Notification supported");
  navigator.serviceWorker.register('sw.js').then((serviceworker) => {
    console.log("Service Worker registered", serviceworker);
    sw = serviceworker;
    initialisePushNotification(serviceworker);
  }, (err) => {
    console.log("service worker not registered");
  });
} else {
  console.log("Service worker or Push Notification not supported");
}

document.querySelector('#subscribe').addEventListener('click', function() {
  sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(pushNotificationPublicKey)
  }).then(function(subscription) {
    console.log("subscription is ", subscription);
    localStorage.setItem('pushSubscription', JSON.stringify(subscription));
    showNotificationBell();
  },function(err) {
    console.log("some error in subscription", err);
  });
});

document.querySelector('#bell').addEventListener('click', function() {
  document.querySelector('#popup-content').innerHTML = localStorage.getItem('pushSubscription');
  let popupContainerClassList = document.querySelector('.popup-container').classList;
  if(popupContainerClassList.value.includes('show')) {
    popupContainerClassList.remove('show');
  } else {
    popupContainerClassList.add('show');
  }

});
