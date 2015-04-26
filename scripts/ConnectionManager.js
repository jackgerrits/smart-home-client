function ConnectionManager () {
    this.isConnected = false;

    this.connect = function(address, username, password) {
        this.address = address;
        this.username = username;
        this.password = password;
        this.isConnected = true;
        this.makeAjaxRequest('data/feed',feedRequest);
        this.makeAjaxRequest('data/sensors', handleSensors);
        this.interval = setInterval(updateCharts, 1000);
    };

    this.disconnect = function(){
        if(this.isConnected){
            this.isConnected = false;
            clearInterval(this.interval);
        } else {
            alert("ERROR: Cannot disconnect, no connection active.")
        }
    };

    this.makeAjaxRequest = function(path, callback, callbackParameters){
        var ajaxReq = new XMLHttpRequest();
        ajaxReq.onreadystatechange = function() {
            if (ajaxReq.readyState==4) {
                if (callbackParameters !== undefined) {
                    callback(ajaxReq, callbackParameters);
                }
                callback(ajaxReq);
            }
        }
        ajaxReq.open('GET',
            path, true, this.username, this.password);
        ajaxReq.send();
    }
}

function feedRequest(ajaxReq){
    if (ajaxReq.status==200) {
        appendToFeed(JSON.parse(ajaxReq.responseText));
    }
    if (ajaxReq.status > 0) {
        if(connectionManager.isConnected){
            connectionManager.makeAjaxRequest('data/feed',feedRequest);
        }
    }
}

function appendToFeed(content){
    var feed = document.getElementById("feedContent");

    var item = document.createElement('feed-item');
    var timeSpan = document.createElement('h6');
    timeSpan.innerHTML = content.time;

    item.appendChild(timeSpan);
    item.innerHTML += content.contents;

    feed.insertBefore(item, feed.childNodes[0]);
}

function handleSensors(ajaxReq){
    if (ajaxReq.status==200) {
        var sensors = JSON.parse(ajaxReq.responseText).sensors[0];
        console.log(sensors);
        createCharts(sensors);
    }
}

function updateCharts() {
    for (var i = 0; i < charts.length; i++) {
        var path = 'data/sensors/'+charts[i].name;
        connectionManager.makeAjaxRequest(path, updateChart, charts[i]);
    }
}

function updateChart(ajaxReq, chartObj){
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
        };
        charts.push(item);
    }
}