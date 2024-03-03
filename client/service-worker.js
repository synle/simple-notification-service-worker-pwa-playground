self.addEventListener('sync', function (event) {
  console.log('service-worker', 'sync data', new Date(), event)
  handleDataRequest();
  // if (event.tag === 'data-sync') {
  //   event.waitUntil(syncData());
  // }
});


function handleDataRequest() {
  const request = '/api/data'
  return fetch(request)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function (data) {
      if (data && data.length > 0) {
        showNotification(data[0].msg);
      }
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    })
    .catch(function (error) {
      console.error('Error fetching data:', error);
      // You can customize how to handle errors here
    });
}

function showNotification(message) {
  console.log('showNotification', message)
  if (Notification.permission === 'granted') {
    self.registration.showNotification('New Message', {
      body: message,
      icon: 'notification-icon.png' // Replace with your icon path
    });
  } else {
    Notification.requestPermission().then(function (permission) {
      if (permission === 'granted') {
        self.registration.showNotification('New Message', {
          body: message,
          icon: 'notification-icon.png' // Replace with your icon path
        });
      }
    });
  }
}

console.log('service-worker', 'init')
