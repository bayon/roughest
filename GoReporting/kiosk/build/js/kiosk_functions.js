// Kiosk API of Kiosk Pro Plus (6.2.3441)

// Common JS-ObjC-Bridge API:
function ___kp_executeURL(url)
{
	var iframe = document.createElement("IFRAME");
	iframe.setAttribute("src", url);
	document.documentElement.appendChild(iframe);
	iframe.parentNode.removeChild(iframe);
	iframe = null;
}

// Kiosk Version API:
function kp_VersionAPI_requestFullVersion(callback)
{
	___kp_executeURL("kioskpro://kp_VersionAPI_requestFullVersion&" + encodeURIComponent(callback));
}


function kp_VersionAPI_requestMainVersion(callback)
{
	___kp_executeURL("kioskpro://kp_VersionAPI_requestMainVersion&" + encodeURIComponent(callback));
}


function kp_VersionAPI_requestBuildNumber(callback)
{
	___kp_executeURL("kioskpro://kp_VersionAPI_requestBuildNumber&" + encodeURIComponent(callback));
}


function kp_VersionAPI_requestProductName(callback)
{
	___kp_executeURL("kioskpro://kp_VersionAPI_requestProductName&" + encodeURIComponent(callback));
}


function kp_VersionAPI_requestProductNameWithFullVersion(callback)
{
	___kp_executeURL("kioskpro://kp_VersionAPI_requestProductNameWithFullVersion&" + encodeURIComponent(callback));
}


// File API:
function writeToFile(fileName,data,callback)
{
	___kp_executeURL("kioskpro://writeToFile&" + encodeURIComponent(fileName) + "?" + encodeURIComponent(data) + "?" + encodeURIComponent(callback));
}


function fileExists(filename,callback)
{
	___kp_executeURL("kioskpro://fileExists&" + encodeURIComponent(filename) + "?" + encodeURIComponent(callback));
}


function deleteFile(filename,callback)
{
	___kp_executeURL("kioskpro://deleteFile&" + encodeURIComponent(filename) + "?" + encodeURIComponent(callback));
}


// Photo & Video API:
function saveScreenToPng(filename,x,y,width,height,callback)
{
	___kp_executeURL("kioskpro://saveScreenToPng&" + encodeURIComponent(filename) + "?" + encodeURIComponent(x) + "?" + encodeURIComponent(y) + "?" + encodeURIComponent(width) + "?" + encodeURIComponent(height) + "?" + encodeURIComponent(callback));
}


function kp_PhotoVideo_setCameraType(shouldUseFrontCamera,callback)
{
	___kp_executeURL("kioskpro://kp_PhotoVideo_setCameraType&" + encodeURIComponent(shouldUseFrontCamera) + "?" + encodeURIComponent(callback));
}


function kp_PhotoVideo_getCameraType(callback)
{
	___kp_executeURL("kioskpro://kp_PhotoVideo_getCameraType&" + encodeURIComponent(callback));
}


function takePhotoToFile(filename,callback)
{
	___kp_executeURL("kioskpro://takePhotoToFile&" + encodeURIComponent(filename) + "?" + encodeURIComponent(callback));
}


function takePhotoWithCountdownToFile(filename,callback,counter,message,showingTime)
{
	___kp_executeURL("kioskpro://takePhotoWithCountdownToFile&" + encodeURIComponent(filename) + "?" + encodeURIComponent(callback) + "?" + encodeURIComponent(counter) + "?" + encodeURIComponent(message) + "?" + encodeURIComponent(showingTime));
}


function takeVideoToFile(filename,callback)
{
	___kp_executeURL("kioskpro://takeVideoToFile&" + encodeURIComponent(filename) + "?" + encodeURIComponent(callback));
}


// Common API:
function kp_requestKioskId(callback)
{
	___kp_executeURL("kioskpro://kp_requestKioskId&" + encodeURIComponent(callback));
}


// Common Printer API:
function print()
{
	___kp_executeURL("kioskpro://print");
}


// AirPrinter API:
function kp_AirPrinter_requestStateOfSupporting()
{
	___kp_executeURL("kioskpro://kp_AirPrinter_requestStateOfSupporting");
}


function kp_AirPrinter_print()
{
	___kp_executeURL("kioskpro://kp_AirPrinter_print");
}


function kp_AirPrinter_printPdf(filename)
{
	___kp_executeURL("kioskpro://kp_AirPrinter_printPdf&" + encodeURIComponent(filename));
}


// Memory & Privacy API:
function kp_Browser_clearCookies()
{
	___kp_executeURL("kioskpro://kp_Browser_clearCookies");
}


function kp_Browser_clearCache()
{
	___kp_executeURL("kioskpro://kp_Browser_clearCache");
}


// Idle Timer API:
function kp_IdleTimer_fire()
{
	___kp_executeURL("kioskpro://kp_IdleTimer_fire");
}


// Dropbox API:
function kp_DBXSyncManager_sync()
{
	___kp_executeURL("kioskpro://kp_DBXSyncManager_sync");
}


function kp_DBXSyncManager_stopObservingChangesOfType(typeOfChanges)
{
	___kp_executeURL("kioskpro://kp_DBXSyncManager_stopObservingChangesOfType&" + encodeURIComponent(typeOfChanges));
}


function kp_DBXSyncManager_startObservingChangesOfType(typeOfChanges)
{
	___kp_executeURL("kioskpro://kp_DBXSyncManager_startObservingChangesOfType&" + encodeURIComponent(typeOfChanges));
}


function kp_DBXSyncManager_getTypeOfObservingChanges(callback)
{
	___kp_executeURL("kioskpro://kp_DBXSyncManager_getTypeOfObservingChanges&" + encodeURIComponent(callback));
}


