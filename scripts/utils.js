var charts = new Array();

document.addEventListener("DOMContentLoaded", function(event) { 
	mapInit();
	var feed = document.getElementById("feed");

	reqServer();
	reqSensors();
	setInterval(updateCharts, 1000);
});

function reqSensors(){
	var ajaxReq = new XMLHttpRequest();
	ajaxReq.onreadystatechange = function() {
		if (ajaxReq.readyState==4) {
			if (ajaxReq.status==200) {
				var sensors = JSON.parse(ajaxReq.responseText).sensors;
				console.log(sensors);
				createCharts(sensors);
			}
		}
	}
	ajaxReq.open('GET',
		'https://localhost:7777/data/sensors', true, "admin", "cheese");
	ajaxReq.send();
}

function updateChart(chartObj){
	var ajaxReq = new XMLHttpRequest();
	ajaxReq.onreadystatechange = function() {
		if (ajaxReq.readyState==4) {
			if (ajaxReq.status==200) {
				var data = JSON.parse(ajaxReq.responseText);
				chartObj.chart.addData([data.value],chartObj.counter++);
				console.log(data);
				console.log(data.value);
			}
		}
	}
	ajaxReq.open('GET',
		'https://localhost:7777/data/sensors/'+chartObj.name, true, "admin", "cheese");
	ajaxReq.send();
}

function updateCharts() {
	for (var i = 0; i < charts.length; i++) {
		updateChart(charts[i]);
	}
}

function createCharts(sensors){
	for (var i = 0; i < sensors.length; i++) {
		console.log(sensors[i]);

		var container = document.createElement("div");
		container.className = "chartContainer";

		var t = document.createElement("div");
		t.innerHTML = sensors[i];
		t.className = "chartTitle";

		var chart = document.createElement("canvas");
		chart.width = 250;
		chart.height = 200;
		chart.id = sensors[i];

		startingData = {
			labels: [0],
			datasets: [
			{
				fillColor: "rgba(220,220,220,0.2)",
				strokeColor: "rgba(220,220,220,1)",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#fff",
				data: [1]
			}]
		}

		container.appendChild(t);
		container.appendChild(chart);

		document.getElementById("sensors").appendChild(container);
		var ctx = chart.getContext("2d");
		var chartObj = new Chart(ctx).Line(startingData);

		var item = {
			name: sensors[i],
			chart: chartObj,
			counter: 0
		}
		charts.push(item);
	}
}

function reqServer() {
	var ajaxReq = new XMLHttpRequest();
	ajaxReq.onreadystatechange = function() {
		if (ajaxReq.readyState==4) {
			if (ajaxReq.status==200) {
				appendToFeed(JSON.parse(ajaxReq.responseText));
			}
			if (ajaxReq.status > 0) {
				reqServer();
			}
		}
	}
	ajaxReq.open('GET',
		'https://localhost:7777/data/feed', true, "admin", "cheese");
	ajaxReq.send();
	console.log("request sent");
}

function appendToFeed(content, time){
	var feed = document.getElementById("feedContent");
	var d = new Date();
	var currentHour = d.getHours();


	var item = document.createElement('feed-item');
	var timeSpan = document.createElement('h6');
	timeSpan.innerHTML = content.time;

	item.appendChild(timeSpan);
	item.innerHTML += content.contents;

	feed.insertBefore(item, feed.childNodes[0]);
}