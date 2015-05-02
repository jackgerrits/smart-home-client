var d = new Date();

function ConnectionManager () {
    this.isConnected = false;

    this.connect = function(address, username, password) {
        if(!this.isConnected){
            this.address = address;
            this.username = username;
            this.password = password;
            this.isConnected = true;
            this.authInfo = {
                "username": username,
                "password": password
            };
            this.makeAjaxRequest('data/feed',feedRequest);
            this.makeAjaxRequest('data/sensors', handleSensors);
            this.interval = setInterval(updateCharts, settings.chartInterval);
        } else {
            alert("ERROR: Already connected.");
        }
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
        if(this.isConnected){
            var ajaxReq = new XMLHttpRequest();
            ajaxReq.onreadystatechange = function() {
                if (ajaxReq.readyState==4) {
                    if (callbackParameters !== undefined) {
                        console.log("sending extra parameter");
                        console.log(callbackParameters);
                        callback(ajaxReq, callbackParameters);
                    } else {
                        callback(ajaxReq);
                    }

                }
            };
            ajaxReq.open('POST',
                "https://"+this.address+"/"+path, true);
            ajaxReq.setRequestHeader('Content-Type', 'application/json');
            ajaxReq.send(JSON.stringify(this.authInfo));
        }
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
        chartObj.chart.addData([data.value], chartObj.counter);
        /*TODO
        Make the label for the chart display current time
         */
        //chartObj.chart.addData([data.value], d.getHours()+":"+ d.getMinutes+":"+ d.getSeconds);
        chartObj.counter++
        while(chartObj.counter > 30){
            console.log("removing point");
            chartObj.chart.removeData();
            chartObj.counter--
        }
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
        var chartObj = new Chart(ctx).Line(startingData, { pointDot: false, legendTemplate: " ", bezierCurve : false  });

        var item = {
            name: sensors[i],
            chart: chartObj,
            counter: 0
        };
        charts.push(item);
    }
}