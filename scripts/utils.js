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

function closeSettingsWindow(){
    settings = {};

}

function connectButtonClicked(){
    if(settings==null){

    }

}

function disconnectButtonClicked(){

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

function clearInterface(){
    document.getElementById("sensors").innerHTML = "";
    document.getElementById("feedContent").innerHTML = "";
}
