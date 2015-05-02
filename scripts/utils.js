var charts = new Array();
var connectionManager = new ConnectionManager();
var settings = null;

document.addEventListener("DOMContentLoaded", function(event) { 
	mapInit();
	var feed = document.getElementById("feed");

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

function closeSettingsWindow(){
    clearSettingsError();

    var firstTime = false;
    if(settings == null){
        settings = {};
        firstTime = true;
    }

    //basic settings
    settings.server = document.getElementById("settings_serverip").value;
    settings.port = processPort(document.getElementById("settings_port").value);
    settings.username = document.getElementById("settings_username").value;
    settings.password = document.getElementById("settings_password").value;

    //advanced settings
    settings.showMap = document.getElementById("settings_showMap").checked;
    settings.chartInterval = parseInt(document.getElementById("settings_chartInterval").value)*1000;

     if(validateSettings()){
        if(firstTime){
            alert("The SSL certificate must now be accepted");
            window.open("https://"+settings.server+":"+settings.port+"/data/sensors");
        }

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
    if(settings==null){
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
        currentHeight = 220;
    }

    container.style.height = currentHeight+'px';
}

function clearInterface(){
    document.getElementById("sensors").innerHTML = "";
    document.getElementById("feedContent").innerHTML = "";
    charts = new Array();
}
