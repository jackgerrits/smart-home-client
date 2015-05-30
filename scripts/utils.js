var charts = new Array();
var connectionManager = new ConnectionManager();
var settings = null;

document.addEventListener("DOMContentLoaded", function(event) {
	var feed = document.getElementById("feed");
    updateConnectionState();
});

function showWindow(divID){
    var window = document.getElementById( divID );
    var overlay = document.getElementById( "overlay" );
    overlay.style.display = 'block';
    window.style.display = 'block';
}

function showSettingsWindow(){
    showWindow('settingsWindow');
}

function updateConnectionState(){
    var infoDiv = document.getElementById( "info_connection" );
    if(connectionManager.isConnected){
        infoDiv.innerHTML = "<span class='true'>Connected</span>"
    } else {
        infoDiv.innerHTML = "<span class='false'>Disconnected</span>"
    }
}

function updateChartCounter(){
    var infoDiv = document.getElementById( "info_updates" );
    infoDiv.innerHTML = connectionManager.chartUpdates;
}

function updateEventsCounter(){
    var infoDiv = document.getElementById( "info_events" );
    infoDiv.innerHTML = connectionManager.events;
}

function updateHumanStatus(occupied){
    var infoDiv = document.getElementById( "info_occupied" );
    if(occupied){
        infoDiv.innerHTML = "<span class='true'>Occupied</span>"
    } else {
        infoDiv.innerHTML = "<span class='false'>Unoccupied</span>"
    }
}

function closeSettingsWindow(save){
    clearSettingsError();

    if(settings == null){
        settings = {};
        settings.server = "";
        settings.port =  "";
        settings.username = "";
        settings.password = "";
        //settings.showMap = false;
        settings.chartInterval = 5;
        settings.enterName = "enter";
        settings.leaveName = "leave";
    }

    if(save){
        //basic settings
        settings.server = document.getElementById("settings_serverip").value;
        settings.port = processPort(document.getElementById("settings_port").value);
        settings.username = document.getElementById("settings_username").value;
        settings.password = document.getElementById("settings_password").value;

        //advanced settings
        //settings.showMap = document.getElementById("settings_showMap").checked;
        settings.chartInterval = parseInt(document.getElementById("settings_chartInterval").value)*1000;
        settings.enterName =  document.getElementById("settings_enter").value;
        settings.leaveName =  document.getElementById("settings_leave").value;

        if(validateSettings()){
            //var mapModule = document.getElementById("module_map");
            //if(settings.showMap && document.getElementById("map").innerHTML == ""){
            //    mapInit();
            //}
            //if(settings.showMap){
            //    mapModule.style.display = 'block';
            //} else {
            //    mapModule.style.display = 'none';
            //}

            clearSettingsError();
            hideWindow('settingsWindow');
        }
    } else {
        document.getElementById("settings_serverip").value = settings.server;
        document.getElementById("settings_port").value = settings.port;
        document.getElementById("settings_username").value = settings.username;
        document.getElementById("settings_password").value = settings.password;
        //document.getElementById("settings_showMap").checked = settings.showMap;
        document.getElementById("settings_chartInterval").value = settings.chartInterval;
         document.getElementById("settings_enter").value = settings.enterName;
        document.getElementById("settings_leave").value = settings.leaveName;

        clearSettingsError();
        hideWindow('settingsWindow');
    }
}

function validateSettings(){
    var hasPassed = true;

    if(settings.server == ""){
        appendSettingsError("Invalid server.");
        hasPassed = false;
    }
    if(settings.port == -1){
        appendSettingsError("Invalid port number.");
        hasPassed = false;
    }
    if(settings.username == ""){
        appendSettingsError("Invalid username.");
        hasPassed = false;
    }
    if(settings.password == ""){
        appendSettingsError("Invalid password.");
        hasPassed = false;
    }
    if(settings.chartInterval <= 0 || isNaN(settings.chartInterval)){
        appendSettingsError("Invalid chart interval.");
        hasPassed = false;
    }
    if(settings.enterName == ""){
        appendSettingsError("Invalid enter event name.");
        hasPassed = false;
    }
    if(settings.leaveName == ""){
        appendSettingsError("Invalid leave event name.");
        hasPassed = false;
    }

    return hasPassed;
}

function processPort(portValue){
    var port = parseInt(portValue);
    if(port < 65536 && port > -1){
        return port;
    }
    return -1;
}

function appendSettingsError(content){
    var errorDiv = document.getElementById("settings_error");
    errorDiv.innerHTML = errorDiv.innerHTML + content + "<br />";
}

function clearSettingsError(){
    var errorDiv = document.getElementById("settings_error");
    errorDiv.innerHTML = "";
}

function connectButtonClicked(){
    clearInterface();
    if(settings==null || settings.server==""){
        alert("ERROR: Please change settings first");
    } else {
        connectionManager.connect(settings.server+":"+settings.port, settings.username, settings.password);
    }
}

function disconnectButtonClicked(){
    connectionManager.disconnect();
}

function hideWindow(divID){
    var window = document.getElementById( divID );
    var overlay = document.getElementById( "overlay" );
    overlay.style.display = 'none';
    window.style.display = 'none';
}

function appendToLog(content){
    var logDiv = document.getElementById("log");
    logDiv.innerHTML = logDiv.innerHTML + content + "<br />";
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
        currentHeight = 500;
    } else if (advancedDiv.style.display == 'block'){ //if its showing we want to hide it
        console.log("block branch");
        statusAnchor.innerHTML = "Show advanced settings &darr;";
        advancedDiv.style.display = 'none';
        currentHeight = 220;
    }

    container.style.height = currentHeight+'px';
}

function clearButtonClicked(){
    var r = confirm("Are you sure you want clear all data from the interface?");
    if (r == true) {
        clearInterface();
    }
}

function clearInterface(){
    document.getElementById("sensors").innerHTML = "";
    document.getElementById("log").innerHTML = "";
    document.getElementById("feedContent").innerHTML = "";
    charts = new Array();
}
