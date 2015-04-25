var charts = new Array();

document.addEventListener("DOMContentLoaded", function(event) { 
	mapInit();
	var feed = document.getElementById("feed");

	//reqServer();
	//reqSensors();
	//setInterval(updateCharts, 1000);
});

function reqSensors(){
	var ajaxReq = new XMLHttpRequest();
	ajaxReq.onreadystatechange = function() {
		if (ajaxReq.readyState==4) {
			if (ajaxReq.status==200) {
				var sensors = JSON.parse(ajaxReq.responseText).sensors[0];
				console.log(sensors);
				createCharts(sensors);
			}
		}
	}
	ajaxReq.open('GET',
		'data/sensors', true, "admin", "cheese");
	ajaxReq.send();
}

function showWindow(divID){
    var window = document.getElementById( divID );
    var overlay = document.getElementById( "overlay" );
    overlay.style.display = 'block';
    window.style.display = 'block';
}

function hideWindow(divID){
    var window = document.getElementById( divID );
    var overlay = document.getElementById( "overlay" );
    overlay.style.display = 'none';
    window.style.display = 'none';
}

function toggleSettings(divID, statusAnchor){
    var advancedDiv = document.getElementById( divID );
    var container = statusAnchor.parentElement;
    var currentHeight;

    // if its hidden we want to show it
    if(advancedDiv.style.display == 'none'){
        console.log("none branch");
        statusAnchor.innerHTML = "Hide advanced settings &uarr;";
        advancedDiv.style.display = 'block';
        currentHeight = 400;
    } else if (advancedDiv.style.display == 'block'){ //if its showing we want to hide it
        console.log("block branch");
        statusAnchor.innerHTML = "Show advanced settings &darr;";
        advancedDiv.style.display = 'none';
        currentHeight = 200;
    }

    container.style.height = currentHeight+'px';
}

function updateChart(chartObj){
	var ajaxReq = new XMLHttpRequest();
	ajaxReq.onreadystatechange = function() {
		if (ajaxReq.readyState==4) {
			if (ajaxReq.status==200) {
				var data = JSON.parse(ajaxReq.responseText);
				chartObj.chart.addData([data.value],chartObj.counter++);
				if(chartObj.counter> 60){
					chartObj.chart.removeData();
				} 
				if(chartObj.counter> 5555){
					chartObj.counter = 61;
				} 
				console.log(data);
				console.log(data.value);
			}
		}
	}
	ajaxReq.open('GET',
		'data/sensors/'+chartObj.name, true, "admin", "cheese");
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
		var chartObj = new Chart(ctx).Line(startingData, { pointDot: false, legendTemplate: " "  });

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
		'data/feed', true, "admin", "cheese");
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