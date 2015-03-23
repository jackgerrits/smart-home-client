document.addEventListener("DOMContentLoaded", function(event) { 
  mapInit();
  var feed = document.getElementById("feed");

  appendToFeed("Entered Bedroom");
  appendToFeed("Sat at desk");
  appendToFeed("Got out of bed");
  appendToFeed("Lights on", "2:08 AM");

});
/*
function appendToFeed(content){
	var d = new Date();
	var currentHour = d.getHours();
	var ampm = "AM";
	if(currentHour>12) {
		currentHour -=12;
		ampm="PM";
	}
	var currentMinutes = d.getMinutes();
	var time = currentHour +":" + currentMinutes + " " + ampm;

	var item = document.createElement('div');
	item.className = 'feedItem';

	var timeSpan = document.createElement('span');
	timeSpan.className = 'feedTime';
	timeSpan.innerHTML = time;

	item.appendChild(timeSpan);
	item.innerHTML += "<br />" + content;

	feed.appendChild(item);
}
*/

function appendToFeed(content, time){
	var feed = document.getElementById("feed");
	var d = new Date();
	var currentHour = d.getHours();

	if(time==null){
		var ampm = "AM";
		if(currentHour>12) {
			currentHour -=12;
			ampm="PM";
		}

		var currentMinutes = d.getMinutes();
		var time = currentHour +":" + currentMinutes + " " + ampm;
	}

	var item = document.createElement('feed-item');
	var timeSpan = document.createElement('h6');
	timeSpan.innerHTML = time;

	item.appendChild(timeSpan);
	item.innerHTML += content;

	feed.appendChild(item);
}