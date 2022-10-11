(function changeClock(){
    var clockElement = document.getElementById('clock');
    console.log(clockElement);

    function updateClock(clock) {
        let currentDate= new Date();
        let cDay = currentDate.getDate();
        let cMonth = currentDate.getMonth() + 1;
        let cYear = currentDate.getFullYear();
        clock.innerHTML = `${cDay}/${cMonth}/${cYear}
        ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
    }
    setInterval(function(){
        updateClock(clockElement);
    }, 1000);
}());
var counterContainer = document.querySelector(".website-counter");
var visitCount = localStorage.getItem("page_view");

// Check if page_view entry is present
if (visitCount) {
  visitCount = Number(visitCount) + 1;
  localStorage.setItem("page_view", visitCount);
} else {
  visitCount = 1;
  localStorage.setItem("page_view", 1);
}
counterContainer.innerHTML = visitCount;
(function changeLocation(){
  var locationElement = document.getElementById('location');
  function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else { 
        locationElement.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
    function showPosition(position) {
      locationElement.innerHTML = "Location: " + position.coords.latitude + ", "
       + position.coords.longitude;
    }
    setInterval(getLocation,1000);
  
}());


