// ==UserScript==
// @name        MouseHunt AutoBot REVAMP
// @author      NobodyRandom, Ooi Keng Siang
// @version    	2.1.6a
// @description Currently the most advanced script for automizing MouseHunt and MH BETA UI. Supports ALL new areas and FIREFOX. Revamped of original by Ooi
// @icon        https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/mice.png
// @require 	https://greasyfork.org/scripts/7601-parse-db-min/code/Parse%20DB%20min.js?version=32976
// @namespace   https://greasyfork.org/users/6398
// @updateURL	https://greasyfork.org/scripts/6092-mousehunt-autobot/code/MouseHunt%20AutoBot.meta.js
// @downloadURL	https://greasyfork.org/scripts/6092-mousehunt-autobot/code/MouseHunt%20AutoBot.user.js
// @license 	GNU GPL v2.0
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @exclude		http://*.google.com/*
// @exclude		https://*.google.com/*
// @grant		unsafeWindow
// @run-at		document-end
// ==/UserScript==

// == Basic User Preference Setting (Begin) ==
// // The variable in this section contain basic option will normally edit by most user to suit their own preference
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Extra delay time before sounding the horn. (in seconds)
// // Default: 10 - 180
var hornTimeDelayMin = 10;
var hornTimeDelayMax = 360;

// // Bot aggressively by ignore all safety measure such as check horn image visible before sounding it. (true/false)
// // Note: Highly recommended to turn off because it increase the chances of getting caught in botting.
// // Note: It will ignore the hornTimeDelayMin and hornTimeDelayMax.
// // Note: It may take a little bit extra of CPU processing power.
var aggressiveMode = false;

// // Enable trap check once an hour. (true/false)
var enableTrapCheck = false;

// // Trap check time different value (00 minutes - 45 minutes)
// // Note: Every player had different trap check time, set your trap check time here. It only take effect if enableTrapCheck = true;
// // Example: If you have XX:00 trap check time then set 00. If you have XX:45 trap check time, then set 45.
var trapCheckTimeDiff = 15;

// // Extra delay time to trap check. (in seconds)
// // Note: It only take effect if enableTrapCheck = true;
var checkTimeDelayMin = 15;
var checkTimeDelayMax = 120;

// // Play sound when encounter king's reward (true/false)
var isKingWarningSound = false;

// // Which sound to play when encountering king's reward (need to be .mp3)
var kingWarningSound = 'https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/horn.mp3';

// // Reload the the page according to kingPauseTimeMax when encountering King Reward. (true/false)
// // Note: No matter how many time you refresh, the King's Reward won't go away unless you resolve it manually.
var reloadKingReward = false;

// // Duration of pausing the script before reload the King's Reward page (in seconds)
// // Note: It only take effect if reloadKingReward = true;
var kingPauseTimeMax = 18000;

// // The script will pause if player at different location that hunt location set before. (true/false)
// // Note: Make sure you set showTimerInPage to true in order to know what is happening.
var pauseAtInvalidLocation = false;

// // Popup on KR or not, the script will throw out an alert box if true.
var autoPopupKR = false;

// == Basic User Preference Setting (End) ==

// == Advance User Preference Setting (Begin) ==
// // The variable in this section contain some advance option that will change the script behavior.
// // Edit this variable only if you know what you are doing
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Display timer and message in page title. (true/false)
var showTimerInTitle = true;

// // Embed a timer in page to show next hunter horn timer, highly recommended to turn on. (true/false)
// // Note: You may not access some option like pause at invalid location if you turn this off.
var showTimerInPage = true;

// // Display the last time the page did a refresh or reload. (true/false)
var showLastPageLoadTime = true;

// // Default time to reload the page when bot encounter error. (in seconds)
var errorReloadTime = 20;

// // Time interval for script timer to update the time. May affact timer accuracy if set too high value. (in seconds)
var timerRefreshInterval = 1;

// // Addon code default (empty string)
var addonCode = "";

// == Advance User Preference Setting (End) ==

// WARNING - Do not modify the code below unless you know how to read and write the script.

// All global variable declaration and default value
var scriptVersion = GM_info.script.version;
var fbPlatform = false;
var hiFivePlatform = false;
var mhPlatform = false;
var mhMobilePlatform = false;
var secureConnection = false;
var lastDateRecorded = new Date();
var hornTime = 900;
var hornTimeDelay = 0;
var checkTimeDelay = 0;
var isKingReward = false;
var lastKingRewardSumTime;
var kingPauseTime;
var baitQuantity = -1;
var huntLocation;
var currentLocation;
var today = new Date();
var checkTime = (today.getMinutes() >= trapCheckTimeDiff) ? 3600 + (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds()) : (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds());
today = undefined;
var hornRetryMax = 10;
var hornRetry = 0;
var nextActiveTime = 900;
var timerInterval = 2;

// element in page
//var titleElement;
var nextHornTimeElement;
var checkTimeElement;
var kingTimeElement;
var lastKingRewardSumTimeElement;
//var optionElement;
var travelElement;
var hornButton = 'hornbutton';
var campButton = 'campbutton';
var header = 'header';
var hornReady = 'hornready';
var isNewUI = false;

// NOB vars
var NOBhasPuzzle;
var NOBtickerTimout;
var NOBtickerInterval;
var NOBpage = false;
var mapRequestFailed = false;
var clockTicking = false;
var clockNeedOn = false;
var counter = 0;
var dots = '';
var LOCATION_TIMERS = [
    ['Seasonal Garden', {
        first: 1283616000,
        length: 288000,
        breakdown: [1, 1, 1, 1],
        name: ['Summer', 'Autumn', 'Winter', 'Spring'],
        color: ['Red', 'Orange', 'Blue', 'Green'],
        effective: ['tactical', 'shadow', 'hydro', 'physical']
    }],
    ['Balack\'s Cove', {
        first: 1294680060,
        length: 1200,
        breakdown: [48, 3, 2, 3],
        name: ['Low', 'Medium (in)', 'High', 'Medium (out)'],
        color: ['Green', 'Orange', 'Red', 'Orange']
    }],
    ['Forbidden Grove', {
        first: 1285704000,
        length: 14400,
        breakdown: [4, 1],
        name: ['Open', 'Closed'],
        color: ['Green', 'Red']
    }],
    ['Relic Hunter', {
        url: 'http://horntracker.com/backend/relichunter.php?functionCall=relichunt'
    }],
    ['Toxic Spill', {
        url: 'http://horntracker.com/backend/new/toxic.php?functionCall=spill'
    }]
];

// start executing script
var debug = false;
if (debug) console.log('STARTING SCRIPT - ver: ' + GM_info.script.version);
if (window.top != window.self) {
    if (debug) console.log('In IFRAME - may cause firefox to error, location: ' + window.location.href);
    //return;
} else {
    if (debug) console.log('NOT IN IFRAME - will not work in fb MH');
}
exeScript();

function exeScript() {
    if (debug) console.log('RUN exeScript()');
    try {
        var titleElm = $('#titleElement')[0];
        if (titleElm)
            $('#titleElement')[0].parentNode.remove();
    } finally {
        titleElm = null;
    }

    try {
        var time = document.getElementsByClassName('passive')[0].getElementsByClassName('journaldate')[0].innerHTML;
        time = time.substr(time.indexOf(':') + 1, 2);
        trapCheckTimeDiff = parseInt(time);
        setStorage("TrapCheckTimeOffset", trapCheckTimeDiff);
    } catch (e) {
        console.debug('Class element "passive" not found');
        trapCheckTimeDiff = getStorage('TrapCheckTimeOffset');
        if (trapCheckTimeDiff == null) {
            trapCheckTimeDiff = 0;
            setStorage("TrapCheckTimeOffset", trapCheckTimeDiff);
        }
    }

    try {
        // check the trap check setting first
        if (trapCheckTimeDiff == 60) {
            trapCheckTimeDiff = 0;
        } else if (trapCheckTimeDiff < 0 || trapCheckTimeDiff > 60) {
            // invalid value, just disable the trap check
            enableTrapCheck = false;
        }

        if (showTimerInTitle) {
            // check if they are running in iFrame
            var contentElement, breakFrameDivElement;
            if (window.location.href.indexOf("apps.facebook.com/mousehunt/") != -1) {
                contentElement = document.getElementById('pagelet_canvas_content');
                if (contentElement) {
                    breakFrameDivElement = document.createElement('div');
                    breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
                    breakFrameDivElement.innerHTML = "Timer cannot show on title page. You can <a href='http://www.mousehuntgame.com/canvas/'>run MouseHunt without iFrame (Facebook)</a> to enable timer on title page";
                    contentElement.parentNode.insertBefore(breakFrameDivElement, contentElement);
                }
                contentElement = undefined;
            } else if (window.location.href.indexOf("hi5.com/friend/games/MouseHunt") != -1) {
                contentElement = document.getElementById('apps-canvas-body');
                if (contentElement) {
                    breakFrameDivElement = document.createElement('div');
                    breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
                    breakFrameDivElement.innerHTML = "Timer cannot show on title page. You can <a href='http://mousehunt.hi5.hitgrab.com/'>run MouseHunt without iFrame (Hi5)</a> to enable timer on title page";
                    contentElement.parentNode.insertBefore(breakFrameDivElement, contentElement);
                }
                contentElement = breakFrameDivElement = undefined;
            }
        }

        // check user running this script from where
        if (window.location.href.indexOf("mousehuntgame.com/canvas/") != -1) {
            // from facebook
            fbPlatform = true;
        } else if (window.location.href.indexOf("mousehuntgame.com") != -1) {
            // need to check if it is running in mobile version
            var version = getCookie("switch_to");
            if (version != null && version == "mobile") {
                // from mousehunt game mobile version
                mhMobilePlatform = true;
            } else {
                // from mousehunt game standard version
                mhPlatform = true;
            }
            version = undefined;
        } else if (window.location.href.indexOf("mousehunt.hi5.hitgrab.com") != -1) {
            // from hi5
            hiFivePlatform = true;
        }

        // check if user running in https secure connection, true/false
        secureConnection = (window.location.href.indexOf("https://") != -1);

        if (fbPlatform) {
            if (window.location.href == "http://www.mousehuntgame.com/canvas/" ||
                window.location.href == "http://www.mousehuntgame.com/canvas/#" ||
                window.location.href == "https://www.mousehuntgame.com/canvas/" ||
                window.location.href == "https://www.mousehuntgame.com/canvas/#" ||
                window.location.href.indexOf("mousehuntgame.com/canvas/index.php") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/canvas/turn.php") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/canvas/?") != -1) {
                // page to execute the script!

                // make sure all the preference already loaded
                loadPreferenceSettingFromStorage();

                // this is the page to execute the script
                if (!checkIntroContainer() && retrieveDataFirst()) {
                    // embed a place where timer show
                    embedTimer(true);

                    // embed script to horn button
                    embedScript();

                    // start script action
                    action();
                } else {
                    // fail to retrieve data, display error msg and reload the page
                    document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                    window.setTimeout(function () {
                        reloadPage(false);
                    }, errorReloadTime * 1000);
                }
            } else {
                // not in hunters camp, just show the title of autobot version
                embedTimer(false);
            }
        } else if (mhPlatform) {
            if (window.location.href == "http://www.mousehuntgame.com/" ||
                window.location.href == "http://www.mousehuntgame.com/#" ||
                window.location.href == "http://www.mousehuntgame.com/?switch_to=standard" ||
                window.location.href == "https://www.mousehuntgame.com/" ||
                window.location.href == "https://www.mousehuntgame.com/#" ||
                window.location.href == "https://www.mousehuntgame.com/?switch_to=standard" ||
                window.location.href.indexOf("mousehuntgame.com/turn.php") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/index.php") != -1) {
                // page to execute the script!

                // make sure all the preference already loaded
                loadPreferenceSettingFromStorage();

                // this is the page to execute the script
                if (!checkIntroContainer() && retrieveDataFirst()) {
                    // embed a place where timer show
                    embedTimer(true);

                    // embed script to horn button
                    embedScript();

                    // start script action
                    action();
                } else {
                    // fail to retrieve data, display error msg and reload the page
                    document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                    window.setTimeout(function () {
                        reloadPage(false);
                    }, errorReloadTime * 1000);
                }
            } else {
                // not in hunters camp, just show the title of autobot version
                embedTimer(false);
            }
        } else if (mhMobilePlatform) {
            // execute at all page of mobile version
            //if (true) {
            // page to execute the script!

            // make sure all the preference already loaded
            loadPreferenceSettingFromStorage();

            // embed a place where timer show
            embedTimer(false);
            //}
        } else if (hiFivePlatform) {
            if (window.location.href == "http://mousehunt.hi5.hitgrab.com/#" ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/?") != -1 ||
                window.location.href == "http://mousehunt.hi5.hitgrab.com/" ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/turn.php") != -1 ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/index.php") != -1) {
                // page to execute the script!

                // make sure all the preference already loaded
                loadPreferenceSettingFromStorage();

                // this is the page to execute the script
                if (!checkIntroContainer() && retrieveDataFirst()) {
                    // embed a place where timer show
                    embedTimer(true);

                    // embed script to horn button
                    embedScript();

                    // start script action
                    action();
                } else {
                    // fail to retrieve data, display error msg and reload the page
                    document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                    window.setTimeout(function () {
                        reloadPage(false);
                    }, errorReloadTime * 1000);
                }
            } else {
                // not in hunters camp, just show the title of autobot version
                embedTimer(false);
            }
        }
    } catch (e) {
        if (debug) console.log('exeScript error - ' + e)
    }
}

function checkIntroContainer() {
    if (debug) console.log('RUN checkIntroContainer()');
    var gotIntroContainerDiv = false;

    var introContainerDiv = document.getElementById('introContainer');
    if (introContainerDiv) {
        introContainerDiv = undefined;
        gotIntroContainerDiv = true;
    } else {
        gotIntroContainerDiv = false;
    }

    try {
        return gotIntroContainerDiv;
    } finally {
        gotIntroContainerDiv = undefined;
    }
}

function retrieveDataFirst() {
    if (debug) console.log('RUN retrieveDataFirst()');
    try {
        var gotHornTime = false;
        var gotPuzzle = false;
        var gotBaitQuantity = false;
        var retrieveSuccess = false;

        var scriptElementList = document.getElementsByTagName('script');
        if (scriptElementList) {
            var i;
            for (i = 0; i < scriptElementList.length; ++i) {
                var scriptString = scriptElementList[i].innerHTML;

                // get next horn time
                var hornTimeStartIndex = scriptString.indexOf("next_activeturn_seconds");
                if (hornTimeStartIndex >= 0) {
                    var nextActiveTime = 900;
                    hornTimeStartIndex += 25;
                    var hornTimeEndIndex = scriptString.indexOf(",", hornTimeStartIndex);
                    var hornTimerString = scriptString.substring(hornTimeStartIndex, hornTimeEndIndex);
                    nextActiveTime = parseInt(hornTimerString);

                    hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));

                    if (!aggressiveMode) {
                        // calculation base on the js in Mousehunt
                        var additionalDelayTime = Math.ceil(nextActiveTime * 0.1);

                        // need to found out the mousehunt provided timer interval to determine the additional delay
                        var timerIntervalStartIndex = scriptString.indexOf("hud.timer_interval");
                        if (timerIntervalStartIndex >= 0) {
                            timerIntervalStartIndex += 21;
                            var timerIntervalEndIndex = scriptString.indexOf(";", timerIntervalStartIndex);
                            var timerIntervalString = scriptString.substring(timerIntervalStartIndex, timerIntervalEndIndex);
                            var timerInterval = parseInt(timerIntervalString);

                            // calculation base on the js in Mousehunt
                            if (timerInterval == 1) {
                                additionalDelayTime = 2;
                            }

                            timerIntervalStartIndex = undefined;
                            timerIntervalEndIndex = undefined;
                            timerIntervalString = undefined;
                            timerInterval = undefined;
                        }

                        // safety mode, include extra delay like time in horn image appear
                        //hornTime = nextActiveTime + additionalDelayTime + hornTimeDelay;
                        hornTime = nextActiveTime + hornTimeDelay;
                        lastDateRecorded = undefined;
                        lastDateRecorded = new Date();

                        additionalDelayTime = undefined;
                    } else {
                        // aggressive mode, no extra delay like time in horn image appear
                        hornTime = nextActiveTime;
                        lastDateRecorded = undefined;
                        lastDateRecorded = new Date();
                    }

                    gotHornTime = true;

                    hornTimeStartIndex = undefined;
                    hornTimeEndIndex = undefined;
                    hornTimerString = undefined;
                    nextActiveTime = undefined;
                }

                // get is king's reward or not
                var hasPuzzleStartIndex = scriptString.indexOf("has_puzzle");
                if (hasPuzzleStartIndex >= 0) {
                    hasPuzzleStartIndex += 12;
                    var hasPuzzleEndIndex = scriptString.indexOf(",", hasPuzzleStartIndex);
                    var hasPuzzleString = scriptString.substring(hasPuzzleStartIndex, hasPuzzleEndIndex);
                    isKingReward = (hasPuzzleString != 'false');

                    gotPuzzle = true;

                    hasPuzzleStartIndex = undefined;
                    hasPuzzleEndIndex = undefined;
                    hasPuzzleString = undefined;
                }

                // get cheese quantity
                var baitQuantityStartIndex = scriptString.indexOf("bait_quantity");
                if (baitQuantityStartIndex >= 0) {
                    baitQuantityStartIndex += 15;
                    var baitQuantityEndIndex = scriptString.indexOf(",", baitQuantityStartIndex);
                    var baitQuantityString = scriptString.substring(baitQuantityStartIndex, baitQuantityEndIndex);
                    baitQuantity = parseInt(baitQuantityString);

                    gotBaitQuantity = true;

                    baitQuantityStartIndex = undefined;
                    baitQuantityEndIndex = undefined;
                    baitQuantityString = undefined;
                }

                var locationStartIndex;
                var locationEndIndex;
                locationStartIndex = scriptString.indexOf("location\":\"");
                if (locationStartIndex >= 0) {
                    locationStartIndex += 11;
                    locationEndIndex = scriptString.indexOf("\"", locationStartIndex);
                    var locationString = scriptString.substring(locationStartIndex, locationEndIndex);
                    currentLocation = locationString;

                    locationStartIndex = undefined;
                    locationEndIndex = undefined;
                    locationString = undefined;
                }

                scriptString = undefined;
            }
            i = undefined;
        }
        scriptElementList = undefined;

        if (gotHornTime && gotPuzzle && gotBaitQuantity) {
            // get trap check time
            if (enableTrapCheck) {
                var today = new Date();
                checkTimeDelay = checkTimeDelayMin + Math.round(Math.random() * (checkTimeDelayMax - checkTimeDelayMin));
                checkTime = (today.getMinutes() >= trapCheckTimeDiff) ? 3600 + (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds()) : (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds());
                checkTime += checkTimeDelay;
                today = undefined;
            }

            // get last location
            var huntLocationCookie = getStorage("huntLocation");
            if (huntLocationCookie == undefined || huntLocationCookie == null) {
                huntLocation = currentLocation;
                setStorage("huntLocation", currentLocation);
            } else {
                huntLocation = huntLocationCookie;
                setStorage("huntLocation", huntLocation);
            }
            huntLocationCookie = undefined;

            // get last king reward time
            var lastKingRewardDate = getStorage("lastKingRewardDate");
            if (lastKingRewardDate == undefined || lastKingRewardDate == null) {
                lastKingRewardSumTime = -1;
            } else {
                var lastDate = new Date(lastKingRewardDate);
                lastKingRewardSumTime = parseInt((new Date() - lastDate) / 1000);
                lastDate = undefined;
            }
            lastKingRewardDate = undefined;

            retrieveSuccess = true;
        } else {
            retrieveSuccess = false;
        }

        // clean up
        gotHornTime = undefined;
        gotPuzzle = undefined;
        gotBaitQuantity = undefined;
        return retrieveSuccess;
    } catch (e) {
        console.log('retrieveDataFirst ERROR - ' + e);
    } finally {
        retrieveSuccess = undefined;
    }
}

function retrieveData() {
    if (debug) console.log("Run retrieveData()");
    try {
        var browser = browserDetection();

        // get next horn time
        if (browser == "firefox") {
            nextActiveTime = unsafeWindow.user.next_activeturn_seconds;
            isKingReward = unsafeWindow.user.has_puzzle;
            baitQuantity = unsafeWindow.user.bait_quantity;
            currentLocation = unsafeWindow.user.location;
            NOBhasPuzzle = unsafeWindow.user.has_puzzle;
        } else if (browser == "opera") {
            nextActiveTime = user.next_activeturn_seconds;
            isKingReward = user.has_puzzle;
            baitQuantity = user.bait_quantity;
            currentLocation = user.location;
        } else if (browser == "chrome") {
            nextActiveTime = parseInt(getPageVariableForChrome("user.next_activeturn_seconds"));
            isKingReward = (getPageVariableForChrome("user.has_puzzle").toString() != "false");
            baitQuantity = parseInt(getPageVariableForChrome("user.bait_quantity"));
            currentLocation = getPageVariableForChrome("user.location");
            NOBhasPuzzle = user.has_puzzle;
        } else {
            window.setTimeout(function () {
                reloadWithMessage("Browser not supported. Reloading...", false);
            }, 60000);
        }

        browser = undefined;

        if (nextActiveTime == "" || isNaN(nextActiveTime)) {
            // fail to retrieve data, might be due to slow network

            // reload the page to see it fix the problem
            window.setTimeout(function () {
                reloadWithMessage("Fail to retrieve data. Reloading...", false);
            }, 5000);
        } else {
            // got the timer right!

            // calculate the delay
            hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));

            if (!aggressiveMode) {
                // calculation base on the js in Mousehunt
                var additionalDelayTime = Math.ceil(nextActiveTime * 0.1);
                if (timerInterval != "" && !isNaN(timerInterval) && timerInterval == 1) {
                    additionalDelayTime = 2;
                }

                // safety mode, include extra delay like time in horn image appear
                //hornTime = nextActiveTime + additionalDelayTime + hornTimeDelay;
                hornTime = nextActiveTime + hornTimeDelay;
                lastDateRecorded = undefined;
                lastDateRecorded = new Date();

                additionalDelayTime = undefined;
            } else {
                // aggressive mode, no extra delay like time in horn image appear
                hornTime = nextActiveTime;
                lastDateRecorded = undefined;
                lastDateRecorded = new Date();
            }
        }

        // get trap check time
        if (enableTrapCheck) {
            var today = new Date();
            checkTimeDelay = checkTimeDelayMin + Math.round(Math.random() * (checkTimeDelayMax - checkTimeDelayMin));
            checkTime = (today.getMinutes() >= trapCheckTimeDiff) ? 3600 + (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds()) : (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds());
            checkTime += checkTimeDelay;
            today = undefined;
        }
    } catch (e) {
        console.log("retrieveData() ERROR - " + e);
    }
}

function getPageVariable(name, value) {
    if (name == "user.next_activeturn_seconds") {
        nextActiveTime = parseInt(value);
    } else if (name == "hud.timer_interval") {
        timerInterval = parseInt(value);
    } else if (name == "user.has_puzzle") {
        isKingReward = (value.toString() == true) ? true : false;
    } else if (name == "user.bait_quantity") {
        baitQuantity = parseInt(value);
    } else if (name == "user.location") {
        currentLocation = value.toString();
    }

    name = undefined;
    value = undefined;
}

function checkJournalDate() {
    var reload = false;

    var journalDateDiv = document.getElementsByClassName('journaldate');
    if (journalDateDiv) {
        var journalDateStr = journalDateDiv[0].innerHTML.toString();
        var midIndex = journalDateStr.indexOf(":", 0);
        var spaceIndex = journalDateStr.indexOf(" ", midIndex);

        if (midIndex >= 1) {
            var hrStr = journalDateStr.substring(0, midIndex);
            var minStr = journalDateStr.substring(midIndex + 1, 2);
            var hourSysStr = journalDateStr.substring(spaceIndex + 1, 2);

            var nowDate = new Date();
            var lastHuntDate = new Date();
            if (hourSysStr == "am") {
                lastHuntDate.setHours(parseInt(hrStr), parseInt(minStr), 0, 0);
            } else {
                lastHuntDate.setHours(parseInt(hrStr) + 12, parseInt(minStr), 0, 0);
            }
            if (parseInt(nowDate - lastHuntDate) / 1000 > 900) {
                reload = true;
            }
            hrStr = undefined;
            minStr = undefined;
            nowDate = undefined;
            lastHuntDate = undefined;
        } else {
            reload = true;
        }

        journalDateStr = undefined;
        midIndex = undefined;
        spaceIndex = undefined;
    }
    journalDateDiv = undefined;

    if (reload) {
        reloadWithMessage("Timer error. Try reload to fix.", true);
    }

    try {
        return (reload);
    } finally {
        reload = undefined;
    }
}

function action() {
    if (debug) console.log("Run action()");
    try {
        if (isKingReward) {
            kingRewardAction();
            notify(getPageVariableForChrome('user.username'));
        } else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
            // update timer
            displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");

            if (fbPlatform) {
                if (secureConnection) {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                } else {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                }
            } else if (hiFivePlatform) {
                if (secureConnection) {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                } else {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                }
            } else if (mhPlatform) {
                if (secureConnection) {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                } else {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                }
            }

            displayKingRewardSumTime(null);

            // pause script
        } else if (baitQuantity == 0) {
            // update timer
            displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
            displayLocation(huntLocation);
            displayKingRewardSumTime(null);

            // Notify no more cheese
            notifyMe("No more cheese!!!", 'https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/cheese.png', getPageVariableForChrome('user.username') + ' has no more cheese.')

            // pause the script
        } else {
            // update location
            displayLocation(huntLocation);

            var isHornSounding = false;

            // check if the horn image is visible
            nobTestBetaUI();
            var headerElement = document.getElementById(header);
            if (headerElement) {
                if (isNewUI)
                    headerElement = headerElement.firstChild;
                var headerStatus = headerElement.getAttribute('class');
                if (headerStatus.indexOf(hornReady) != -1) {
                    // if the horn image is visible, why do we need to wait any more, sound the horn!
                    soundHorn();

                    // make sure the timer don't run twice!
                    isHornSounding = true;
                }
                headerStatus = undefined;
            }
            headerElement = undefined;

            if (isHornSounding == false) {
                // start timer
                window.setTimeout(function () {
                    countdownTimer()
                }, timerRefreshInterval * 1000);
            }

            isHornSounding = undefined;
        }
        if (!isKingReward) {
            runAddonCode();
        }
    } catch (e) {
        console.log("action() ERROR - " + e)
    }
}

function countdownTimer() {
    if (isKingReward) {
        // update timer
        displayTimer("King's Reward!", "King's Reward!", "King's Reward");
        displayKingRewardSumTime("Now");

        // record last king's reward time
        var nowDate = new Date();
        setStorage("lastKingRewardDate", nowDate.toString());
        nowDate = undefined;
        lastKingRewardSumTime = 0;

        // reload the page so that the sound can be play
        // simulate mouse click on the camp button
        fireEvent(document.getElementsByClassName(campButton)[0].firstChild, 'click');

        // reload the page if click on camp button fail
        window.setTimeout(function () {
            reloadWithMessage("Fail to click on camp button. Reloading...", false);
        }, 5000);
    } else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
        // update timer
        displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");
        if (fbPlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            } else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        } else if (hiFivePlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            } else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        } else if (mhPlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            } else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        }
        displayKingRewardSumTime(null);

        // pause script
    } else if (baitQuantity == 0) {
        // update timer
        displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
        displayLocation(huntLocation);
        displayKingRewardSumTime(null);

        // pause the script
    } else {
        var dateNow = new Date();
        var intervalTime = timeElapsed(lastDateRecorded, dateNow);
        lastDateRecorded = undefined;
        lastDateRecorded = dateNow;
        dateNow = undefined;

        if (enableTrapCheck) {
            // update time
            hornTime -= intervalTime;
            checkTime -= intervalTime;
            if (lastKingRewardSumTime != -1) {
                lastKingRewardSumTime += intervalTime;
            }
        } else {
            // update time
            hornTime -= intervalTime;
            if (lastKingRewardSumTime != -1) {
                lastKingRewardSumTime += intervalTime;
            }
        }

        intervalTime = undefined;

        if (hornTime <= 0) {
            // blow the horn!
            soundHorn();
        } else if (enableTrapCheck && checkTime <= 0) {
            // trap check!
            trapCheck();
        } else {
            if (enableTrapCheck) {
                // update timer
                if (!aggressiveMode) {
                    displayTimer("Horn: " + timeformat(hornTime) + " | Check: " + timeformat(checkTime),
                        timeformat(hornTime) + "  <i>(included extra " + timeformat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
                        timeformat(checkTime) + "  <i>(included extra " + timeformat(checkTimeDelay) + " delay)</i>");
                } else {
                    displayTimer("Horn: " + timeformat(hornTime) + " | Check: " + timeformat(checkTime),
                        timeformat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
                        timeformat(checkTime) + "  <i>(included extra " + timeformat(checkTimeDelay) + " delay)</i>");
                }
            } else {
                // update timer
                if (!aggressiveMode) {
                    displayTimer("Horn: " + timeformat(hornTime),
                        timeformat(hornTime) + "  <i>(included extra " + timeformat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
                        "-");

                    // check if user manaually sounded the horn
                    var scriptNode = document.getElementById("scriptNode");
                    if (scriptNode) {
                        var isHornSounded = scriptNode.getAttribute("soundedHornAtt");
                        if (isHornSounded == "true") {
                            // sound horn function do the rest
                            soundHorn();

                            // stop loopping
                            return;
                        }
                        isHornSounded = undefined;
                    }
                    scriptNode = undefined;
                } else {
                    displayTimer("Horn: " + timeformat(hornTime),
                        timeformat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
                        "-");

                    // agressive mode should sound the horn whenever it is possible to do so.
                    var headerElement = document.getElementById(header);
                    if (headerElement) {
                        if (isNewUI)
                            headerElement = headerElement.firstChild;
                        // the horn image appear before the timer end
                        if (headerElement.getAttribute('class').indexOf(hornReady) != -1) {
                            // who care, blow the horn first!
                            soundHorn();

                            headerElement = undefined;

                            // skip all the code below
                            return;
                        }
                    }
                    headerElement = undefined;
                }
            }

            // set king reward sum time
            displayKingRewardSumTime(timeFormatLong(lastKingRewardSumTime));

            window.setTimeout(function () {
                (countdownTimer)()
            }, timerRefreshInterval * 1000);
        }
    }
}

function reloadPage(soundHorn) {
    // reload the page
    if (fbPlatform) {
        // for Facebook only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://www.mousehuntgame.com/canvas/turn.php";
            } else {
                window.location.href = "https://www.mousehuntgame.com/canvas/";
            }
        } else {
            if (soundHorn) {
                window.location.href = "http://www.mousehuntgame.com/canvas/turn.php";
            } else {
                window.location.href = "http://www.mousehuntgame.com/canvas/";
            }
        }
    } else if (hiFivePlatform) {
        // for Hi5 only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://mousehunt.hi5.hitgrab.com/turn.php";
            } else {
                window.location.href = "https://mousehunt.hi5.hitgrab.com/";
            }
        } else {
            if (soundHorn) {
                window.location.href = "http://mousehunt.hi5.hitgrab.com/turn.php";
            } else {
                window.location.href = "http://mousehunt.hi5.hitgrab.com/";
            }
        }
    } else if (mhPlatform) {
        // for mousehunt game only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://www.mousehuntgame.com/turn.php";
            } else {
                window.location.href = "https://www.mousehuntgame.com/";
            }
        } else {
            if (soundHorn) {
                window.location.href = "http://www.mousehuntgame.com/turn.php";
            } else {
                window.location.href = "http://www.mousehuntgame.com/";
            }
        }
    }

    soundHorn = undefined;
}

function reloadWithMessage(msg, soundHorn) {
    // display the message
    displayTimer(msg, msg, msg, msg);

    // reload the page
    setTimeout(function () {
        reloadPage(soundHorn)
    }, 1000);

    msg = undefined;
    soundHorn = undefined;
}

// ################################################################################################
//   Timer Function - Start
// ################################################################################################

function embedTimer(targetPage) {
    try {
        if (showTimerInPage) {
            var headerElement;
            if (fbPlatform || hiFivePlatform || mhPlatform) {
                headerElement = document.getElementById('noscript');
            } else if (mhMobilePlatform) {
                headerElement = document.getElementById('mobileHorn');
            }

            if (headerElement) {
                var timerDivElement = document.createElement('div');

                //var hr1Element = document.createElement('hr');
                //timerDivElement.appendChild(hr1Element);
                //hr1Element = null;

                // show bot title and version
                var titleElement = document.createElement('div');
                titleElement.setAttribute('id', 'titleElement');
                if (targetPage && aggressiveMode) {
                    titleElement.innerHTML = "<b><a href=\"https://greasyfork.org/en/scripts/6092-mousehunt-autobot-revamp\" target=\"_blank\">MouseHunt AutoBot REVAMP (version " + scriptVersion + ")</a> + MouseHunt AutoBot Additional thing" + (isNewUI ? " ~ Beta UI" : "" ) + "</b> - <font color='red'>Aggressive Mode</font>";
                } else {
                    titleElement.innerHTML = "<b><a href=\"https://greasyfork.org/en/scripts/6092-mousehunt-autobot-revamp\" target=\"_blank\">MouseHunt AutoBot REVAMP (version " + scriptVersion + ")</a> + MouseHunt AutoBot Additional thing" + (isNewUI ? " ~ Beta UI" : "" ) + "</b>";
                }
                timerDivElement.appendChild(titleElement);
                titleElement = null;

                if (targetPage) {
                    var updateElement = document.createElement('div');
                    updateElement.setAttribute('id', 'updateElement');
                    timerDivElement.appendChild(updateElement);
                    updateElement = null;

                    var NOBmessage = document.createElement('div');
                    NOBmessage.setAttribute('id', 'NOBmessage');
                    timerDivElement.appendChild(NOBmessage);
                    NOBmessage = null;

                    nextHornTimeElement = document.createElement('div');
                    nextHornTimeElement.setAttribute('id', 'nextHornTimeElement');
                    nextHornTimeElement.innerHTML = "<b>Next Hunter Horn Time:</b> Loading...";
                    timerDivElement.appendChild(nextHornTimeElement);

                    checkTimeElement = document.createElement('div');
                    checkTimeElement.setAttribute('id', 'checkTimeElement');
                    checkTimeElement.innerHTML = "<b>Next Trap Check Time:</b> Loading...";
                    timerDivElement.appendChild(checkTimeElement);

                    if (pauseAtInvalidLocation) {
                        // location information only display when enable this feature
                        travelElement = document.createElement('div');
                        travelElement.setAttribute('id', 'travelElement');
                        travelElement.innerHTML = "<b>Target Hunt Location:</b> Loading...";
                        timerDivElement.appendChild(travelElement);
                    }

                    var lastKingRewardDate = getStorage("lastKingRewardDate");
                    var lastDateStr;
                    if (lastKingRewardDate == undefined || lastKingRewardDate == null) {
                        lastDateStr = "-";
                    } else {
                        var lastDate = new Date(lastKingRewardDate);
                        lastDateStr = lastDate.toDateString() + " " + lastDate.toTimeString().substring(0, 8);
                        lastDate = null;
                    }

                    kingTimeElement = document.createElement('div');
                    kingTimeElement.setAttribute('id', 'kingTimeElement');
                    kingTimeElement.innerHTML = "<b>Last King's Reward:</b> " + lastDateStr + " ";
                    timerDivElement.appendChild(kingTimeElement);

                    lastKingRewardSumTimeElement = document.createElement('font');
                    lastKingRewardSumTimeElement.setAttribute('id', 'lastKingRewardSumTimeElement');
                    lastKingRewardSumTimeElement.innerHTML = "(Loading...)";
                    kingTimeElement.appendChild(lastKingRewardSumTimeElement);

                    lastKingRewardDate = null;
                    lastDateStr = null;

                    if (showLastPageLoadTime) {
                        var nowDate = new Date();

                        // last page load time
                        var loadTimeElement = document.createElement('div');
                        loadTimeElement.setAttribute('id', 'loadTimeElement');
                        loadTimeElement.innerHTML = "<b>Last Page Load: </b>" + nowDate.toDateString() + " " + nowDate.toTimeString().substring(0, 8);
                        //timerDivElement.appendChild(loadTimeElement);

                        loadTimeElement = null;
                        nowDate = null;
                    }

                    var timersElementToggle = document.createElement('a');
                    var text = document.createTextNode('Toggle timers');
                    timersElementToggle.href = '#';
                    timersElementToggle.setAttribute('id', 'timersElementToggle');
                    timersElementToggle.appendChild(text);
                    timersElementToggle.onclick = function () {
                        $('#loadTimersElement').toggle();
                    };
                    var holder = document.createElement('div');
                    holder.setAttribute('style', 'float: left;');
                    var temp = document.createElement('span');
                    temp.innerHTML = '&#160;&#126;&#160;';
                    holder.appendChild(timersElementToggle);
                    holder.appendChild(temp);
                    timerDivElement.appendChild(holder);
                    //timersElementToggle.addEventListener("click", showHideTimers, false);
                    holder = null;
                    text = null;
                    temp = null;

                    var loadTimersElement = document.createElement('div');
                    loadTimersElement.setAttribute('id', 'loadTimersElement');
                    loadTimersElement.setAttribute('style', 'display: none;');
                    timerDivElement.appendChild(loadTimersElement);

                    //timerDivElement.appendChild(/*document.createElement('br')*/document.createTextNode(' &#126; '));

                    var loadLinkToUpdateDiv = document.createElement('div');
                    loadLinkToUpdateDiv.setAttribute('id', 'gDocArea');
                    loadLinkToUpdateDiv.setAttribute('style', 'float: left;');
                    var tempSpan2 = document.createElement('span');
                    var loadLinkToUpdate = document.createElement('a');
                    text = document.createTextNode('Submit to GDoc');
                    loadLinkToUpdate.href = '#';
                    loadLinkToUpdate.setAttribute('id', 'gDocLink');
                    loadLinkToUpdate.appendChild(text);
                    text = null;
                    tempSpan2.appendChild(loadLinkToUpdate);
                    loadLinkToUpdateDiv.appendChild(tempSpan2);
                    timerDivElement.appendChild(loadLinkToUpdateDiv);
                    loadLinkToUpdate.addEventListener('click', nobScript, false);

                    text = ' &#126; <a href="javascript:window.open(\'https://docs.google.com/spreadsheet/ccc?key=0Ag_KH_nuVUjbdGtldjJkWUJ4V1ZpUDVwd1FVM0RTM1E#gid=5\');" target=_blank>Go to GDoc</a>';
                    var tempDiv = document.createElement('span');
                    tempDiv.innerHTML = text;
                    text = ' &#126; <a id="nobRaffle" href="javascript: nobRaffle();">Return raffle tickets</a>';
                    tempSpan2 = document.createElement('span');
                    tempSpan2.innerHTML = text;
                    var tempSpan3 = document.createElement('span');
                    tempSpan3.innerHTML = ' &#126; <a id="nobPresents" href="javascript: nobPresent();">Return presents</a>';
                    var tempSpan = document.createElement('span');
                    tempSpan.innerHTML = ' &#126; <a href="javascript:window.open(\'http://goo.gl/forms/ayRsnizwL1\');" target=_blank>Submit a bug report/feedback</a>';
                    loadLinkToUpdateDiv.appendChild(tempDiv);
                    loadLinkToUpdateDiv.appendChild(tempSpan2);
                    loadLinkToUpdateDiv.appendChild(tempSpan3);
                    loadLinkToUpdateDiv.appendChild(tempSpan);

                    text = null;
                    tempDiv = null;
                    tempSpan = null;
                    tempSpan2 = null;
                    tempSpan3 = null;
                    loadLinkToUpdateDiv = null;
                    timersElementToggle = null;
                    loadTimersElement = null;
                    loadLinkToUpdate = null;
                } else {
                    if (isNewUI || nobTestBetaUI()) {
                        // try check if ajax was called
                        if (doubleCheckLocation()) {
                            exeScript();
                            nobInit();
                            return;
                        } else {
                            var ajaxPageSwitchEvent = function (e) {
                                setTimeout(function () {
                                    $('#titleElement')[0].parentNode.remove();
                                    exeScript();
                                    nobInit();
                                }, 3000);
                                $('.camp a')[0].removeEventListener('click', ajaxPageSwitchEvent);
                                ajaxPageSwitchEvent = null;
                            };
                            $('.camp a')[0].addEventListener('click', ajaxPageSwitchEvent);
                        }
                    }

                    // player currently navigating other page instead of hunter camp
                    var helpTextElement = document.createElement('div');
                    helpTextElement.setAttribute('id', 'helpTextElement');
                    if (fbPlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        }
                    } else if (hiFivePlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://mousehunt.hi5.hitgrab.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://mousehunt.hi5.hitgrab.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        }
                    } else if (mhPlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        }
                    } else if (mhMobilePlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='https://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='http://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
                        }
                    }
                    timerDivElement.appendChild(helpTextElement);

                    helpTextElement = null;
                }

                var showPreference = getStorage('showPreference');
                if (showPreference == undefined || showPreference == null) {
                    showPreference = false;
                    setStorage("showPreference", showPreference);
                }

                var showPreferenceLinkDiv = document.createElement('div');
                showPreferenceLinkDiv.setAttribute('id', 'showPreferenceLinkDiv');
                showPreferenceLinkDiv.setAttribute('style', 'text-align:right');
                timerDivElement.appendChild(showPreferenceLinkDiv);

                var showPreferenceSpan = document.createElement('span');
                var showPreferenceLinkStr = '<a id="showPreferenceLink" name="showPreferenceLink" onclick="if (document.getElementById(\'showPreferenceLink\').innerHTML == \'<b>[Hide Preference]</b>\') { document.getElementById(\'preferenceDiv\').style.display=\'none\';  document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Show Preference]</b>\'; } else { document.getElementById(\'preferenceDiv\').style.display=\'block\'; document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Hide Preference]</b>\'; }">';
                if (showPreference == true)
                    showPreferenceLinkStr += '<b>[Hide Preference]</b>';
                else
                    showPreferenceLinkStr += '<b>[Show Preference]</b>';
                showPreferenceLinkStr += '</a>';
                showPreferenceLinkStr += '&nbsp;&nbsp;&nbsp;';
                showPreferenceSpan.innerHTML = showPreferenceLinkStr;
                showPreferenceLinkDiv.appendChild(showPreferenceSpan);
                showPreferenceLinkStr = null;
                showPreferenceSpan = null;
                showPreferenceLinkDiv = null;

                var hr2Element = document.createElement('hr');
                timerDivElement.appendChild(hr2Element);
                hr2Element = null;

                var preferenceHTMLStr = '<table border="0" width="100%">';
                if (aggressiveMode) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Bot aggressively by ignore all safety measure such as check horn image visible before sounding it">';
                    preferenceHTMLStr += '<b>Aggressive Mode</b>';
                    preferenceHTMLStr += '</a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputTrue" name="AggressiveModeInput" value="true" onchange="if (document.getElementById(\'AggressiveModeInputTrue\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'disabled\';}" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputFalse" name="AggressiveModeInput" value="false" onchange="if (document.getElementById(\'AggressiveModeInputFalse\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'\';}"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time before sounding the horn (in seconds)">';
                    preferenceHTMLStr += '<b>Horn Time Delay</b>';
                    preferenceHTMLStr += '</a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMinInput" name="HornTimeDelayMinInput" disabled="disabled" value="' + hornTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMaxInput" name="HornTimeDelayMaxInput" disabled="disabled" value="' + hornTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Bot aggressively by ignore all safety measure such as check horn image visible before sounding it">';
                    preferenceHTMLStr += '<b>Aggressive Mode</b>';
                    preferenceHTMLStr += '</a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputTrue" name="AggressiveModeInput" value="true" onchange="if (document.getElementById(\'AggressiveModeInputTrue\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'disabled\';}"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputFalse" name="AggressiveModeInput" value="false" onchange="if (document.getElementById(\'AggressiveModeInputFalse\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'\';}" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time before sounding the horn (in seconds)">';
                    preferenceHTMLStr += '<b>Horn Time Delay</b>';
                    preferenceHTMLStr += '</a>&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMinInput" name="HornTimeDelayMinInput" value="' + hornTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMaxInput" name="HornTimeDelayMaxInput" value="' + hornTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (enableTrapCheck) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Enable trap check once an hour"><b>Trap Check</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputTrue" name="TrapCheckInput" value="true" onchange="if (document.getElementById(\'TrapCheckInputTrue\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'\';}" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputFalse" name="TrapCheckInput" value="false" onchange="if (document.getElementById(\'TrapCheckInputFalse\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'disabled\';}"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Trap check time different value (00 minutes - 45 minutes)"><b>Trap Check Time Offset</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeOffsetInput" name="TrapCheckTimeOffsetInput" value="' + trapCheckTimeDiff.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time to trap check (in seconds)"><b>Trap Check Time Delay</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMinInput" name="TrapCheckTimeDelayMinInput" value="' + checkTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMaxInput" name="TrapCheckTimeDelayMaxInput" value="' + checkTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Enable trap check once an hour"><b>Trap Check</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputTrue" name="TrapCheckInput" value="true" onchange="if (document.getElementById(\'TrapCheckInputTrue\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'\';}"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputFalse" name="TrapCheckInput" value="false" onchange="if (document.getElementById(\'TrapCheckInputFalse\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'disabled\';}" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Trap check time different value (00 minutes - 45 minutes)"><b>Trap Check Time Offset</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeOffsetInput" name="TrapCheckTimeOffsetInput" disabled="disabled" value="' + trapCheckTimeDiff.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time to trap check (in seconds)"><b>Trap Check Time Delay</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMinInput" name="TrapCheckTimeDelayMinInput" disabled="disabled" value="' + checkTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMaxInput" name="TrapCheckTimeDelayMaxInput" disabled="disabled" value="' + checkTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (isKingWarningSound) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Play sound when encounter king\'s reward"><b>Play King Reward Sound</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputTrue" name="PlayKingRewardSoundInput" value="true" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputFalse" name="PlayKingRewardSoundInput" value="false" /> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Play sound when encounter king\'s reward"><b>Play King Reward Sound</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputTrue" name="PlayKingRewardSoundInput" value="true" /> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputFalse" name="PlayKingRewardSoundInput" value="false" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Play which sound when encountering king\'s reward"><b>King Reward Sound</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px;">';
                preferenceHTMLStr += '<input type="text" id="KingRewardSoundInput" name="KingRewardSoundInput" value="' + kingWarningSound + '" />';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                if (reloadKingReward) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Reload the the page according to King Reward Resume Time when encount King Reward"><b>King Reward Resume</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputTrue" name="KingRewardResumeInput" value="true" onchange="if (document.getElementById(\'KingRewardResumeInputTrue\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'\'; }" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputFalse" name="KingRewardResumeInput" value="false" onchange="if (document.getElementById(\'KingRewardResumeInputFalse\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'disabled\'; }"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Duration of pausing the script before reload the King\'s Reward page (in seconds)"><b>King Reward Resume Time</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="KingRewardResumeTimeInput" name="KingRewardResumeTimeInput" value="' + kingPauseTimeMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Reload the the page according to King Reward Resume Time when encounter King Reward"><b>King Reward Resume</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputTrue" name="KingRewardResumeInput" value="true" onchange="if (document.getElementById(\'KingRewardResumeInputTrue\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'\'; }"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputFalse" name="KingRewardResumeInput" value="false" onchange="if (document.getElementById(\'KingRewardResumeInputFalse\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'disabled\'; }" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Duration of pausing the script before reload the King\'s Reward page (in seconds)"><b>King Reward Resume Time</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="KingRewardResumeTimeInput" name="KingRewardResumeTimeInput" disabled="disabled" value="' + kingPauseTimeMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (pauseAtInvalidLocation) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="The script will pause if player at different location that hunt location set before"><b>Remember Location</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputTrue" name="PauseLocationInput" value="true" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputFalse" name="PauseLocationInput" value="false" /> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="The script will pause if player at different location that hunt location set before"><b>Remember Location</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputTrue" name="PauseLocationInput" value="true"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputFalse" name="PauseLocationInput" value="false" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (autoPopupKR) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Auto Popup on KR"><b>Auto KR Popup</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrTrue" name="autopopkrInput" value="true" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrFalse" name="autopopkrInput" value="false" /> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Auto Popup on KR"><b>Auto KR Popup</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrTrue" name="autopopkrInput" value="true"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrFalse" name="autopopkrInput" value="false" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="FOR DEVS ONLY" onclick="if(confirm(\'Are you sure you want to inject code?\'))$(\'#addonCode\').toggle();"><b>Click here if you would like to inject code.</b></a>';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td>';
                preferenceHTMLStr += '<textarea id="addonCode" name="addonCode" style="display:none;">';
                preferenceHTMLStr += addonCode;
                preferenceHTMLStr += '</textarea>';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;" colspan="2">';
                preferenceHTMLStr += '(Changes only take place after user save the preference) ';
                preferenceHTMLStr += '<input type="button" id="PreferenceSaveInput" value="Save" onclick="	\
if (document.getElementById(\'AggressiveModeInputTrue\').checked == true) { window.localStorage.setItem(\'AggressiveMode\', \'true\'); } else { window.localStorage.setItem(\'AggressiveMode\', \'false\'); }	\
window.localStorage.setItem(\'HornTimeDelayMin\', document.getElementById(\'HornTimeDelayMinInput\').value); window.localStorage.setItem(\'HornTimeDelayMax\', document.getElementById(\'HornTimeDelayMaxInput\').value);	\
if (document.getElementById(\'TrapCheckInputTrue\').checked == true) { window.localStorage.setItem(\'TrapCheck\', \'true\'); } else { window.localStorage.setItem(\'TrapCheck\', \'false\'); }	\
window.localStorage.setItem(\'TrapCheckTimeOffset\', document.getElementById(\'TrapCheckTimeOffsetInput\').value);	\
window.localStorage.setItem(\'TrapCheckTimeDelayMin\', document.getElementById(\'TrapCheckTimeDelayMinInput\').value); window.localStorage.setItem(\'TrapCheckTimeDelayMax\', document.getElementById(\'TrapCheckTimeDelayMaxInput\').value);	\
if (document.getElementById(\'PlayKingRewardSoundInputTrue\').checked == true) { window.localStorage.setItem(\'PlayKingRewardSound\', \'true\'); } else { window.localStorage.setItem(\'PlayKingRewardSound\', \'false\'); }	\
window.localStorage.setItem(\'KingRewardSoundInput\', document.getElementById(\'KingRewardSoundInput\').value);   \
if (document.getElementById(\'KingRewardResumeInputTrue\').checked == true) { window.localStorage.setItem(\'KingRewardResume\', \'true\'); } else { window.localStorage.setItem(\'KingRewardResume\', \'false\'); }	\
window.localStorage.setItem(\'KingRewardResumeTime\', document.getElementById(\'KingRewardResumeTimeInput\').value);	\
if (document.getElementById(\'PauseLocationInputTrue\').checked == true) { window.localStorage.setItem(\'PauseLocation\', \'true\'); } else { window.localStorage.setItem(\'PauseLocation\', \'false\'); }	\
if (document.getElementById(\'autopopkrTrue\').checked == true) { window.localStorage.setItem(\'autoPopupKR\', \'true\'); } else { window.localStorage.setItem(\'autoPopupKR\', \'false\'); }	\
window.localStorage.setItem(\'addonCode\', document.getElementById(\'addonCode\').value);\
';
                if (fbPlatform) {
                    if (secureConnection)
                        preferenceHTMLStr += 'window.location.href=\'https://www.mousehuntgame.com/canvas/\';"/>';
                    else
                        preferenceHTMLStr += 'window.location.href=\'http://www.mousehuntgame.com/canvas/\';"/>';
                } else if (hiFivePlatform) {
                    if (secureConnection)
                        preferenceHTMLStr += 'window.location.href=\'https://mousehunt.hi5.hitgrab.com/\';"/>';
                    else
                        preferenceHTMLStr += 'window.location.href=\'http://mousehunt.hi5.hitgrab.com/\';"/>';
                } else if (mhPlatform) {
                    if (secureConnection)
                        preferenceHTMLStr += 'window.location.href=\'https://www.mousehuntgame.com/\';"/>';
                    else
                        preferenceHTMLStr += 'window.location.href=\'http://www.mousehuntgame.com/\';"/>';
                }
                preferenceHTMLStr += '&nbsp;&nbsp;&nbsp;</td>';
                preferenceHTMLStr += '</tr>';
                preferenceHTMLStr += '</table>';

                var NOBspecialMessageDiv = document.createElement('div');
                NOBspecialMessageDiv.setAttribute('id', 'nobSpecialMessage');
                NOBspecialMessageDiv.setAttribute('style', 'display: block; position: fixed; bottom: 0; z-index: 999; text-align: center; width: 760px;');

                var preferenceDiv = document.createElement('div');
                preferenceDiv.setAttribute('id', 'preferenceDiv');
                if (showPreference == true)
                    preferenceDiv.setAttribute('style', 'display: block');
                else
                    preferenceDiv.setAttribute('style', 'display: none');
                preferenceDiv.innerHTML = preferenceHTMLStr;
                timerDivElement.appendChild(preferenceDiv);
                timerDivElement.appendChild(NOBspecialMessageDiv);
                preferenceHTMLStr = null;
                showPreference = null;

                var hr3Element = document.createElement('hr');
                preferenceDiv.appendChild(hr3Element);
                hr3Element = null;
                preferenceDiv = null;
                NOBspecialMessageDiv = null;

                // embed all msg to the page
                headerElement.parentNode.insertBefore(timerDivElement, headerElement);
                timerDivElement = null;
            }
            headerElement = null;
        }

        targetPage = null;
    } catch (e) {
        if (debug) console.log('embedTimer error - ' + e)
    }
}

function loadPreferenceSettingFromStorage() {
    var aggressiveModeTemp = getStorage("AggressiveMode");
    if (aggressiveModeTemp == undefined || aggressiveModeTemp == null) {
        setStorage("AggressiveMode", aggressiveMode.toString());
    } else if (aggressiveModeTemp == true || aggressiveModeTemp.toLowerCase() == "true") {
        aggressiveMode = true;
    } else {
        aggressiveMode = false;
    }
    aggressiveModeTemp = undefined;

    var hornTimeDelayMinTemp = getStorage("HornTimeDelayMin");
    var hornTimeDelayMaxTemp = getStorage("HornTimeDelayMax");
    if (hornTimeDelayMinTemp == undefined || hornTimeDelayMinTemp == null || hornTimeDelayMaxTemp == undefined || hornTimeDelayMaxTemp == null) {
        setStorage("HornTimeDelayMin", hornTimeDelayMin);
        setStorage("HornTimeDelayMax", hornTimeDelayMax);
    } else {
        hornTimeDelayMin = parseInt(hornTimeDelayMinTemp);
        hornTimeDelayMax = parseInt(hornTimeDelayMaxTemp);
    }
    hornTimeDelayMinTemp = undefined;
    hornTimeDelayMaxTemp = undefined;

    var trapCheckTemp = getStorage("TrapCheck");
    if (trapCheckTemp == undefined || trapCheckTemp == null) {
        setStorage("TrapCheck", enableTrapCheck.toString());
    } else if (trapCheckTemp == true || trapCheckTemp.toLowerCase() == "true") {
        enableTrapCheck = true;
    } else {
        enableTrapCheck = false;
    }
    trapCheckTemp = undefined;

    var trapCheckTimeOffsetTemp = getStorage("TrapCheckTimeOffset");
    if (trapCheckTimeOffsetTemp == undefined || trapCheckTimeOffsetTemp == null) {
        setStorage("TrapCheckTimeOffset", trapCheckTimeDiff);
    } else {
        trapCheckTimeDiff = parseInt(trapCheckTimeOffsetTemp);
    }
    trapCheckTimeOffsetTemp = undefined;

    var trapCheckTimeDelayMinTemp = getStorage("TrapCheckTimeDelayMin");
    var trapCheckTimeDelayMaxTemp = getStorage("TrapCheckTimeDelayMax");
    if (trapCheckTimeDelayMinTemp == undefined || trapCheckTimeDelayMinTemp == null || trapCheckTimeDelayMaxTemp == undefined || trapCheckTimeDelayMaxTemp == null) {
        setStorage("TrapCheckTimeDelayMin", checkTimeDelayMin);
        setStorage("TrapCheckTimeDelayMax", checkTimeDelayMax);
    } else {
        checkTimeDelayMin = parseInt(trapCheckTimeDelayMinTemp);
        checkTimeDelayMax = parseInt(trapCheckTimeDelayMaxTemp);
    }
    trapCheckTimeDelayMinTemp = undefined;
    trapCheckTimeDelayMaxTemp = undefined;

    var playKingRewardSoundTemp = getStorage("PlayKingRewardSound");
    if (playKingRewardSoundTemp == undefined || playKingRewardSoundTemp == null) {
        setStorage("PlayKingRewardSound", isKingWarningSound.toString());
    } else if (playKingRewardSoundTemp == true || playKingRewardSoundTemp.toLowerCase() == "true") {
        isKingWarningSound = true;
    } else {
        isKingWarningSound = false;
    }
    playKingRewardSoundTemp = undefined;

    var kingRewardSoundTemp = getStorage('KingRewardSoundInput');
    if (kingRewardSoundTemp == undefined || kingRewardSoundTemp == null) {
        kingRewardSoundTemp = 'https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/horn.mp3';
        setStorage('KingRewardSOundInput', 'https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/horn.mp3');
    }
    kingWarningSound = kingRewardSoundTemp;
    kingRewardSoundTemp = undefined;

    var kingRewardResumeTemp = getStorage("KingRewardResume");
    if (kingRewardResumeTemp == undefined || kingRewardResumeTemp == null) {
        setStorage("KingRewardResume", reloadKingReward.toString());
    } else if (kingRewardResumeTemp == true || kingRewardResumeTemp.toLowerCase() == "true") {
        reloadKingReward = true;
    } else {
        reloadKingReward = false;
    }
    kingRewardResumeTemp = undefined;

    var kingRewardResumeTimeTemp = getStorage("KingRewardResumeTime");
    if (kingRewardResumeTimeTemp == undefined || kingRewardResumeTimeTemp == null) {
        setStorage("KingRewardResumeTime", kingPauseTimeMax);
    } else {
        kingPauseTimeMax = parseInt(kingRewardResumeTimeTemp);
    }
    kingRewardResumeTimeTemp = undefined;

    var pauseLocationTemp = getStorage("PauseLocation");
    if (pauseLocationTemp == undefined || pauseLocationTemp == null) {
        setStorage("PauseLocation", pauseAtInvalidLocation.toString());
    } else if (pauseLocationTemp == true || pauseLocationTemp.toLowerCase() == "true") {
        pauseAtInvalidLocation = true;
    } else {
        pauseAtInvalidLocation = false;
    }
    pauseLocationTemp = undefined;

    var autopopkrTemp = getStorage("autoPopupKR");
    if (autopopkrTemp == undefined || autopopkrTemp == null) {
        setStorage("autoPopupKR", autoPopupKR.toString());
    } else if (autopopkrTemp == true || autopopkrTemp.toLowerCase() == "true") {
        autoPopupKR = true;
    } else {
        autoPopupKR = false;
    }
    autopopkrTemp = undefined;

    var addonCodeTemp = getStorage("addonCode");
    if (addonCodeTemp == undefined || addonCodeTemp === null) {
        setStorage('addonCode', "");
    } else {
        addonCode = addonCodeTemp;
    }
    addonCodeTemp = undefined;
}

function displayTimer(title, nextHornTime, checkTime) {
    if (showTimerInTitle) {
        document.title = title;
    }

    if (showTimerInPage) {
        nextHornTimeElement.innerHTML = "<b>Next Hunter Horn Time:</b> " + nextHornTime;
        checkTimeElement.innerHTML = "<b>Next Trap Check Time:</b> " + checkTime;
    }

    title = null;
    nextHornTime = null;
    checkTime = null;
}

function displayLocation(locStr) {
    if (showTimerInPage && pauseAtInvalidLocation) {
        travelElement.innerHTML = "<b>Hunt Location:</b> " + locStr;
    }

    locStr = null;
}

function displayKingRewardSumTime(timeStr) {
    if (showTimerInPage) {
        if (timeStr) {
            lastKingRewardSumTimeElement.innerHTML = "(" + timeStr + ")";
        } else {
            lastKingRewardSumTimeElement.innerHTML = "";
        }
    }

    timeStr = null;
}

function doubleCheckLocation() { //return true if location is camp page (this is to combat ajax loads)
    if (!isNewUI)
        return false;

    var thePage = $('#mousehuntContainer')[0];
    if (thePage) {
        return (thePage.className == "PageCamp");
    } else {
        return false;
    }
}
// ################################################################################################
//   Timer Function - End
// ################################################################################################

// ################################################################################################
//   Ad Function - Start
// ################################################################################################

function addGoogleAd() {
    // search for existing ad element and remove it
    var existingAutoBotAdElement = document.getElementById('autoBotAdDiv');
    if (existingAutoBotAdElement) {
        existingAutoBotAdElement.parentNode.removeChild(existingAutoBotAdElement);
        existingAutoBotAdElement = null;
    }
}

// ################################################################################################
//   Ad Function - End
// ################################################################################################

// ################################################################################################
//   Horn Function - Start
// ################################################################################################

function soundHorn() {
    if (!isNewUI || doubleCheckLocation()) {
        // update timer
        displayTimer("Ready to Blow The Horn...", "Ready to Blow The Horn...", "Ready to Blow The Horn...");

        var hornElement;
        var scriptNode = document.getElementById("scriptNode");
        if (scriptNode) {
            scriptNode.setAttribute("soundedHornAtt", "false");
        }
        scriptNode = null;

        if (!aggressiveMode) {
            // safety mode, check the horn image is there or not before sound the horn
            var headerElement = document.getElementById(header);

            if (headerElement) {
                if (isNewUI)
                    headerElement = headerElement.firstChild;
                // need to make sure that the horn image is ready before we can click on it
                var headerStatus = headerElement.getAttribute('class');
                if (headerStatus.indexOf(hornReady) != -1) {
                    // found the horn image, let's sound the horn!

                    // update timer
                    displayTimer("Blowing The Horn...", "Blowing The Horn...", "Blowing The Horn...");

                    // simulate mouse click on the horn
                    hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
                    fireEvent(hornElement, 'click');
                    hornElement = null;

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // double check if the horn was already sounded
                    window.setTimeout(function () {
                        afterSoundingHorn()
                    }, 5000);
                } else if (headerStatus.indexOf("hornsounding") != -1 || headerStatus.indexOf("hornsounded") != -1) {
                    // some one just sound the horn...

                    // update timer
                    displayTimer("Synchronizing Data...", "Someone had just sound the horn. Synchronizing data...", "Someone had just sound the horn. Synchronizing data...");

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // load the new data
                    window.setTimeout(function () {
                        afterSoundingHorn()
                    }, 5000);
                } else if (headerStatus.indexOf("hornwaiting") != -1) {
                    // the horn is not appearing, let check the time again

                    // update timer
                    displayTimer("Synchronizing Data...", "Hunter horn is not ready yet. Synchronizing data...", "Hunter horn is not ready yet. Synchronizing data...");

                    // sync the time again, maybe user already click the horn
                    retrieveData();

                    checkJournalDate();

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // loop again
                    window.setTimeout(function () {
                        countdownTimer()
                    }, timerRefreshInterval * 1000);
                } else {
                    // some one steal the horn!

                    // update timer
                    displayTimer("Synchronizing Data...", "Hunter horn is missing. Synchronizing data...", "Hunter horn is missing. Synchronizing data...");

                    // try to click on the horn
                    hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
                    fireEvent(hornElement, 'click');
                    hornElement = null;

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // double check if the horn was already sounded
                    window.setTimeout(function () {
                        afterSoundingHorn()
                    }, 5000);
                }
            } else {
                // something wrong, can't even found the header...

                // clean up
                headerElement = null;

                // reload the page see if thing get fixed
                reloadWithMessage("Fail to find the horn header. Reloading...", false);
            }

        } else {
            // aggressive mode, ignore whatever horn image is there or not, just sound the horn!

            // simulate mouse click on the horn
            fireEvent(document.getElementsByClassName(hornButton)[0].firstChild, 'click');

            // double check if the horn was already sounded
            window.setTimeout(function () {
                afterSoundingHorn()
            }, 3000);
        }
    } else {
        $('#titleElement')[0].parentNode.remove();
        embedTimer(false);
    }
}

function afterSoundingHorn() {
    if (debug) console.log("Run afterSoundingHorn()");
    var scriptNode = document.getElementById("scriptNode");
    if (scriptNode) {
        scriptNode.setAttribute("soundedHornAtt", "false");
    }
    scriptNode = null;

    var headerElement = document.getElementById(header);
    if (headerElement) {
        if (isNewUI)
            headerElement = headerElement.firstChild;
        // double check if the horn image is still visible after the script already sound it
        var headerStatus = headerElement.getAttribute('class');
        if (headerStatus.indexOf(hornReady) != -1) {
            // seen like the horn is not functioning well

            // update timer
            displayTimer("Blowing The Horn Again...", "Blowing The Horn Again...", "Blowing The Horn Again...");

            // simulate mouse click on the horn
            var hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
            fireEvent(hornElement, 'click');
            hornElement = null;

            // clean up
            headerElement = null;
            headerStatus = null;

            // increase the horn retry counter and check if the script is caught in loop
            ++hornRetry;
            if (hornRetry > hornRetryMax) {
                // reload the page see if thing get fixed
                reloadWithMessage("Detected script caught in loop. Reloading...", true);

                // reset the horn retry counter
                hornRetry = 0;
            } else {
                // check again later
                window.setTimeout(function () {
                    afterSoundingHorn()
                }, 1000);
            }
        } else if (headerStatus.indexOf("hornsounding") != -1) {
            // the horn is already sound, but the network seen to slow on fetching the data

            // update timer
            displayTimer("The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...");

            // clean up
            headerElement = null;
            headerStatus = null;

            // increase the horn retry counter and check if the script is caugh in loop
            ++hornRetry;
            if (hornRetry > hornRetryMax) {
                // reload the page see if thing get fixed
                reloadWithMessage("Detected script caught in loop. Reloading...", true);

                // reset the horn retry counter
                hornRetry = 0;
            } else {
                // check again later
                window.setTimeout(function () {
                    afterSoundingHorn()
                }, 3000);
            }
        } else {
            // everything look ok

            // update timer
            displayTimer("Horn sounded. Synchronizing Data...", "Horn sounded. Synchronizing data...", "Horn sounded. Synchronizing data...");

            // reload data
            retrieveData();

            // clean up
            headerElement = null;
            headerStatus = null;

            // script continue as normal
            window.setTimeout(function () {
                countdownTimer()
            }, timerRefreshInterval * 1000);

            // reset the horn retry counter
            hornRetry = 0;
        }
    }
}

function embedScript() {
    // create a javascript to detect if user click on the horn manually
    var scriptNode = document.createElement('script');
    scriptNode.setAttribute('id', 'scriptNode');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.setAttribute('soundedHornAtt', 'false');
    scriptNode.innerHTML = 'function soundedHorn() {\
    var scriptNode = document.getElementById("scriptNode");\
    if (scriptNode) {\
    	scriptNode.setAttribute("soundedHornAtt", "true");\
    }\
    scriptNode = null;\
    }';

    // find the head node and insert the script into it
    var headerElement;
    if (fbPlatform || hiFivePlatform || mhPlatform) {
        headerElement = document.getElementById('noscript');
    } else if (mhMobilePlatform) {
        headerElement = document.getElementById('mobileHorn');
    }
    headerElement.parentNode.insertBefore(scriptNode, headerElement);
    scriptNode = null;
    headerElement = null;

    nobTestBetaUI();

    // change the function call of horn
    var hornButtonLink = document.getElementsByClassName(hornButton)[0].firstChild;
    var oriStr = hornButtonLink.getAttribute('onclick').toString();
    var index = oriStr.indexOf('return false;');
    var modStr = oriStr.substring(0, index) + 'soundedHorn();' + oriStr.substring(index);
    hornButtonLink.setAttribute('onclick', modStr);

    hornButtonLink = null;
    oriStr = null;
    index = null;
    modStr = null;
}

function nobTestBetaUI() {
    header = 'header';
    var testNewUI = document.getElementById(header);
    if (testNewUI != null) {
        // old UI
        hornButton = 'hornbutton';
        campButton = 'campbutton';
        header = 'header';
        hornReady = 'hornready';
        isNewUI = false;
        return false;
    } else {
        // new UI
        hornButton = 'mousehuntHud-huntersHorn-container';
        campButton = 'camp';
        header = 'mousehuntHud';
        hornReady = 'hornReady';
        isNewUI = true;
        return true;
    }
    testNewUI = null;
}

// ################################################################################################
//   Horn Function - End
// ################################################################################################

// ################################################################################################
//   King's Reward Function - Start
// ################################################################################################

function kingRewardAction() {
    // update timer
    displayTimer("King's Reward!", "King's Reward", "King's Reward!");
    displayLocation("-");

    // play music if needed
    playKingRewardSound();

    // focus on the answer input
    var inputElementList = document.getElementsByTagName('input');
    if (inputElementList) {
        var i;
        for (i = 0; i < inputElementList.length; ++i) {
            // check if it is a resume button
            if (inputElementList[i].getAttribute('name') == "puzzle_answer") {
                inputElementList[i].focus();
                break;
            }
        }
        i = null;
    }
    inputElementList = null;

    // record last king's reward time
    var nowDate = new Date();
    setStorage("lastKingRewardDate", nowDate.toString());
    nowDate = null;

    if (kingPauseTimeMax <= 0) {
        kingPauseTimeMax = 1;
    }

    kingPauseTime = kingPauseTimeMax;
    kingRewardCountdownTimer();
}

// notify function deprecated
function notify(username) {
    notifyMe('KR NOW - ' + username, 'http://3.bp.blogspot.com/_O2yZIhpq9E8/TBoAMw0fMNI/AAAAAAAAAxo/1ytaIxQQz4o/s1600/Subliminal+Message.JPG', "Kings Reward NOW");
}

function notifyMe(notice, icon, body) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        var notification = new Notification(notice, {'icon': icon, 'body': body});

        notification.onclick = function () {
            window.open("https://www.mousehuntgame.com/");
            notification.close();
        }

        notification.onshow = function () {
            setTimeout(function () {
                notification.close();
            }, 5000);
        }
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // Whatever the user answers, we make sure we store the information
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

            // If the user is okay, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(notice, {'icon': icon, 'body': body});

                notification.onclick = function () {
                    window.open("https://www.mousehuntgame.com/");
                    notification.close();
                }

                notification.onshow = function () {
                    setTimeout(function () {
                        notification.close();
                    }, 5000);
                }
            }
        });
    }
}

function playKingRewardSound() {
    if (isKingWarningSound) {
        unsafeWindow.hornAudio = new Audio(kingWarningSound);
        hornAudio.loop = true;
        hornAudio.play();
        var targetArea = document.getElementsByTagName('body');
        var child = document.createElement('button');
        child.setAttribute('id', "stopAudio");
        child.setAttribute('style', 'position: fixed; bottom: 0;');
        child.setAttribute('onclick', 'hornAudio.pause();');
        child.innerHTML = "CLICK ME TO STOP THIS ANNOYING MUSIC";
        targetArea[0].appendChild(child);
        targetArea = null;
        child = null;
        snippet = null;
    }

    if (autoPopupKR)
        window.setTimeout(function () {
            alert("Kings Reward NOW");
        }, 2000);
}

function kingRewardCountdownTimer() {
    var dateNow = new Date();
    var intervalTime = timeElapsed(lastDateRecorded, dateNow);
    lastDateRecorded = null;
    lastDateRecorded = dateNow;
    dateNow = null;

    if (reloadKingReward) {
        kingPauseTime -= intervalTime;
    }

    if (lastKingRewardSumTime != -1) {
        lastKingRewardSumTime += intervalTime;
    }

    intervalTime = null;

    if (kingPauseTime <= 0) {
        // update timer
        displayTimer("King's Reward - Reloading...", "Reloading...", "Reloading...");

        // simulate mouse click on the camp button
        var campElement = document.getElementsByClassName(campButton)[0].firstChild;
        fireEvent(campElement, 'click');
        campElement = null;

        // reload the page if click on the camp button fail
        window.setTimeout(function () {
            reloadWithMessage("Fail to click on camp button. Reloading...", false);
        }, 5000);
    } else {
        if (reloadKingReward) {
            // update timer
            displayTimer("King's Reward - Reload in " + timeformat(kingPauseTime),
                "Reloading in " + timeformat(kingPauseTime),
                "Reloading in " + timeformat(kingPauseTime));
        }

        // set king reward sum time
        displayKingRewardSumTime(timeFormatLong(lastKingRewardSumTime));

        if (!checkResumeButton()) {
            window.setTimeout(function () {
                (kingRewardCountdownTimer)()
            }, timerRefreshInterval * 1000);
        }
    }
}

function checkResumeButton() {
    var found = false;
    var resumeElement;

    if (isNewUI) {
        var krFormClass = $('form')[0].className;
        if (krFormClass.indexOf("noPuzzle") > -1) {
            // found resume button

            // simulate mouse click on the resume button
            resumeElement = $('.mousehuntPage-puzzle-form-complete-button')[0];
            fireEvent(resumeElement, 'click');
            resumeElement = null;

            // reload url if click fail
            window.setTimeout(function () {
                reloadWithMessage("Fail to click on resume button. Reloading...", false);
            }, 6000);

            // recheck if the resume button is click because some time even the url reload also fail
            window.setTimeout(function () {
                checkResumeButton();
            }, 10000);

            found = true;
        }
        krFormClass = null;
    } else {
        var linkElementList = document.getElementsByTagName('img');
        if (linkElementList) {
            var i;
            for (i = 0; i < linkElementList.length; ++i) {
                // check if it is a resume button
                if (linkElementList[i].getAttribute('src').indexOf("resume_hunting_blue.gif") != -1) {
                    // found resume button

                    // simulate mouse click on the horn
                    resumeElement = linkElementList[i].parentNode;
                    fireEvent(resumeElement, 'click');
                    resumeElement = null;

                    // reload url if click fail
                    window.setTimeout(function () {
                        reloadWithMessage("Fail to click on resume button. Reloading...", false);
                    }, 6000);

                    // recheck if the resume button is click because some time even the url reload also fail
                    window.setTimeout(function () {
                        checkResumeButton();
                    }, 10000);

                    found = true;
                    break;
                }
            }
            i = null;
        }
    }

    linkElementList = null;

    try {
        return (found);
    } finally {
        found = null;
    }
}

// ################################################################################################
//   King's Reward Function - End
// ################################################################################################

// ################################################################################################
//   Trap Check Function - Start
// ################################################################################################

function trapCheck() {
    // update timer
    displayTimer("Checking The Trap...", "Checking trap now...", "Checking trap now...");

    // simulate mouse click on the camp button
    /*var campElement = document.getElementsByClassName('campbutton')[0].firstChild;
     fireEvent(campElement, 'click');
     campElement = null;*/

    reloadWithMessage("Reloading page for trap check...", false);
    // reload the page if click on camp button fail
    /*window.setTimeout(function() {
     reloadWithMessage("Fail to click on camp button. Reloading...", false);
     }, 5000);*/
}

// ################################################################################################
//   Trap Check Function - End
// ################################################################################################

// ################################################################################################
//   General Function - Start
// ################################################################################################

function browserDetection() {
    var browserName = "unknown";

    var userAgentStr = navigator.userAgent.toString().toLowerCase();
    if (userAgentStr.indexOf("firefox") >= 0) {
        browserName = "firefox";
    } else if (userAgentStr.indexOf("opera") >= 0) {
        browserName = "opera";
    } else if (userAgentStr.indexOf("chrome") >= 0) {
        browserName = "chrome";
    }
    userAgentStr = null;

    try {
        return browserName;
    } finally {
        browserName = null;
    }
}

function setStorage(name, value) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && window['localStorage'] !== null) {
        window.localStorage.setItem(name, value);
    }

    name = undefined;
    value = undefined;
}

function removeStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && window['localStorage'] !== null) {
        window.localStorage.removeItem(name);
    }
    name = undefined;
}

function getStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && window['localStorage'] !== null) {
        return (window.localStorage.getItem(name));
    }
    name = undefined;
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }

            var cookieString = unescape(document.cookie.substring(c_start, c_end));

            // clean up
            c_name = null;
            c_start = null;
            c_end = null;

            try {
                return cookieString;
            } finally {
                cookieString = null;
            }
        }
        c_start = null;
    }
    c_name = null;
    return null;
}

function fireEvent(element, event) {
    var evt;
    if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();

        try {
            return element.fireEvent('on' + event, evt);
        } finally {
            element = null;
            event = null;
            evt = null;
        }
    } else {
        // dispatch for firefox + others
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable

        try {
            return !element.dispatchEvent(evt);
        } finally {
            element = null;
            event = null;
            evt = null;
        }
    }
}

function getPageVariableForChrome(variableName) {
    // google chrome only
    var value;
    var scriptElement = document.createElement("script");
    scriptElement.setAttribute('id', "scriptElement");
    scriptElement.setAttribute('type', "text/javascript");
    scriptElement.innerHTML = "document.getElementById('scriptElement').innerText=" + variableName + ";";
    document.body.appendChild(scriptElement);

    try {
        value = scriptElement.innerHTML;
    } catch (e) {
        console.log("Can not find page variable on chrome: " + e);
    } finally {
        document.body.removeChild(scriptElement);
        scriptElement = null;
    }

    try {
        if (value.indexOf(variableName) != -1) {
            if (debug) console.log("GPVchrome value(" + variableName + "): " + value);
            return (value);
        } else {
            if (debug) console.log("GPVchrome eval(" + variableName + "): " + eval(variableName));
            return eval(variableName);
        }
    } finally {
        value = null;
    }
}

function timeElapsed(dateA, dateB) {
    var elapsed = 0;

    var secondA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), dateA.getHours(), dateA.getMinutes(), dateA.getSeconds());
    var secondB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), dateB.getHours(), dateB.getMinutes(), dateB.getSeconds());
    elapsed = (secondB - secondA) / 1000;

    secondA = null;
    secondB = null;
    dateA = null;
    dateB = null;

    try {
        return (elapsed);
    } finally {
        elapsed = null;
    }
}

function timeformat(time) {
    var timeString;
    var hr = Math.floor(time / 3600);
    var min = Math.floor((time % 3600) / 60);
    var sec = (time % 3600 % 60) % 60;

    if (hr > 0) {
        timeString = hr.toString() + " hr " + min.toString() + " min " + sec.toString() + " sec";
    } else if (min > 0) {
        timeString = min.toString() + " min " + sec.toString() + " sec";
    } else {
        timeString = sec.toString() + " sec";
    }

    time = null;
    hr = null;
    min = null;
    sec = null;

    try {
        return (timeString);
    } finally {
        timeString = null;
    }
}

function timeFormatLong(time) {
    var timeString;

    if (time != -1) {
        var day = Math.floor(time / 86400);
        var hr = Math.floor((time % 86400) / 3600);
        var min = Math.floor((time % 3600) / 60);

        if (day > 0) {
            timeString = day.toString() + " day " + hr.toString() + " hr " + min.toString() + " min ago";
        } else if (hr > 0) {
            timeString = hr.toString() + " hr " + min.toString() + " min ago";
        } else if (min > 0) {
            timeString = min.toString() + " min ago";
        }

        day = null;
        hr = null;
        min = null;
    } else {
        timeString = null;
    }

    time = null;

    try {
        return (timeString);
    } finally {
        timeString = null;
    }
}

// ################################################################################################
//   General Function - End
// ################################################################################################

// ################################################################################################
//   NOB Additional thing - Start
// ################################################################################################
// INIT AJAX CALLS AND INIT CALLS - Function calls after page LOAD

window.onload = function () {
    nobInit();
};

function nobInit() {
    try {
        if (!NOBhasPuzzle) {
            if (debug) console.log("RUN nobInit()");
            if (window.location.href == 'http://www.mousehuntgame.com/' ||
                window.location.href == 'http://www.mousehuntgame.com/#' ||
                window.location.href == 'http://www.mousehuntgame.com/?switch_to=standard' ||
                window.location.href == 'https://www.mousehuntgame.com/' ||
                window.location.href == 'https://www.mousehuntgame.com/#' ||
                window.location.href == 'https://www.mousehuntgame.com/?switch_to=standard' ||
                window.location.href.indexOf('mousehuntgame.com/turn.php') != -1 ||
                window.location.href.indexOf('mousehuntgame.com/index.php') != -1 ||
                window.location.href == 'http://www.mousehuntgame.com/canvas/' ||
                window.location.href == 'http://www.mousehuntgame.com/canvas/#' ||
                window.location.href == 'https://www.mousehuntgame.com/canvas/' ||
                window.location.href == 'https://www.mousehuntgame.com/canvas/#' ||
                window.location.href.indexOf('mousehuntgame.com/canvas/index.php') != -1 ||
                window.location.href.indexOf('mousehuntgame.com/canvas/turn.php') != -1 ||
                window.location.href.indexOf('mousehuntgame.com/canvas/?') != -1) {
                NOBpage = true;
            }

            window.setTimeout(function () {
                try {
                    if (debug) console.log('Trying to get rid of ad iFrame');
                    var adFrame = document.getElementsByClassName('googleAd')[0];
                    if (adFrame) {
                        adFrame.parentNode.removeChild(adFrame);
                    }
                } catch (e) {
                    console.log('Remove ad error: ' + e);
                }
            }, 2000);

            if (NOBpage) {
                nobHTMLFetch();
                createClockArea();
                clockTick();
                fetchGDocStuff();
                setTimeout(function () {
                    pingServer();
                }, 30000);
                // Hide message after 1H :)
                hideNOBMessage(3600000);
            }
        }
    } catch (e) {
        console.log("nobInit() ERROR - " + e);
    }
}

function nobAjaxGet(url, callback, throwError) {
    var NOBhasPuzzle = user.has_puzzle;
    if (!NOBhasPuzzle) {
        jQuery.ajax({
            url: url,
            type: "GET",
            timeout: 5000,
            statusCode: {
                200: function () {
                    console.log("Success get - " + url);
                    //Success Message
                }
            },
            success: callback,
            error: throwError
        });
    }
}

function nobAjaxPost(url, data, callback, throwError, dataType) {
    var NOBhasPuzzle = user.has_puzzle;
    if (!NOBhasPuzzle) {
        if (dataType == null || dataType == undefined) dataType = 'json';
        jQuery.ajax({
            url: url,
            data: data,
            type: "POST",
            dataType: dataType,
            timeout: 5000,
            statusCode: {
                200: function () {
                    console.log("Success post - " + url);
                    //Success Message
                }
            },
            success: callback,
            error: throwError
        });
    }
}

function updateTimer(timeleft, inhours) {
    var ReturnValue = "";

    var FirstPart, SecondPart, Size;

    if (timeleft > 0) {
        if (inhours != null && inhours == true && timeleft > 3600) {
            FirstPart = Math.floor(timeleft / (60 * 60));
            SecondPart = Math.floor(timeleft / 60) % 60;
            Size = 'hrs';
        } else {
            FirstPart = Math.floor(timeleft / 60);
            SecondPart = timeleft % 60;
            Size = 'mins';
        }

        if (SecondPart < 10) {
            SecondPart = '0' + SecondPart;
        }

        ReturnValue = FirstPart + ':' + SecondPart + ' ' + Size;
    } else {
        ReturnValue = 'Soon...';
    }

    return ReturnValue;
}

function nobGDoc(items, type) {
    var dataSend = JSON.parse(items);
    dataSend.type = type;
    var dataSendString = JSON.stringify(dataSend);
    var sheet = "https://script.google.com/macros/s/AKfycbyry10E0moilr-4pzWpuY9H0iNlHKzITb1QoqD69ZhyWhzapfA/exec";

    nobAjaxPost(sheet, dataSendString, function (data) {
        //console.log(data);
    }, function (a, b, c) {
        console.log(b)
    });
}

function nobHTMLFetch() {
    var value = document.documentElement.innerHTML;
    if (value != null) {
        if (typeof value == "string") {

            var StartPos = value.indexOf('user = ');
            var EndPos = value.indexOf('};', StartPos);

            if (StartPos != -1) {
                var FullObjectText = value.substring(StartPos + 7, EndPos + 1);
                nobStore(JSON.parse(FullObjectText), "data");
            }
        } else if (typeof value == "object") {
            nobStore(value, "data");
        }
    }
    value = undefined;
}

function nobStore(data, type) {
    data = JSON.stringify(data);
    var name = "NOB-" + type;
    localStorage.setItem(name, data);
}

function nobGet(type) {
    return localStorage.getItem('NOB-' + type);
}

function nobMapRequest(handleData) {
    var url = "https://www.mousehuntgame.com/managers/ajax/users/relichunter.php";
    var dataSend = {
        'action': 'info',
        'uh': user.unique_hash,
        'viewas': null
    };
    jQuery.ajax({
        url: url,
        data: dataSend,
        type: "POST",
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            // console.log(data);
            handleData(data);
        },
        error: function (error) {
            console.log("Map Request Failed");
            handleData(error);
        }
    });
}

function nobLoading(location, name) {
    var element = document.getElementById(location);
    if (counter < 10) {
        for (var i = 0; i < counter; i++) {
            dots = dots + ".";
        }
    } else {
        dots = "";
        counter = 0;
    }
    element.innerHTML = "Loading" + dots;
    counter++;

    timeoutVar1 = setTimeout(function () {
        nobLoading(location);
    }, 1000);
}

function nobStopLoading(name) {
    clearTimeout(timeoutVar1);
}

// VARS DONE ******************************* COMMENCE CODE
function nobScript(qqEvent) {
    if (NOBpage) {
        var mapThere;
        var NOBdata = nobGet('data');
        if (isNewUI) {
            mapThere = document.getElementById('hudmapitem');
            if (mapThere !== null) {
                mapThere = mapThere.style.cssText;
                if (mapThere == 'display: none;') {
                    mapThere = false;
                    if (debug) console.log("No map, using HTML data now");
                } else {
                    mapThere = true;
                }
            } else {
                mapThere = false;
            }
        } else {
            mapThere = document.getElementsByClassName('treasureMap')[0];
            if (mapThere.innerText.indexOf("remaining") == -1) {
                mapThere = false;
                if (debug) console.log("No map, using HTML data now");
            } else {
                mapThere = true;
            }
        }

        if (NOBdata != null || NOBdata != undefined) {
            if (!mapRequestFailed && mapThere) {
                nobMapRequest(function (output) {
                    if (output.status == 200 || output.status == undefined) {
                        nobStore(output, "data");
                        nobGDoc(JSON.stringify(output), "map");
                    } else {
                        console.log(output);
                        mapRequestFailed = true;
                        nobHTMLFetch();
                        output = nobGet('data');
                        nobGDoc(output, "user");
                    }
                });
            } else {
                console.log("Map fetch failed using USER data from html (" + mapRequestFailed + ", " + mapThere + ")");
                nobHTMLFetch();
                var output = nobGet('data');
                nobGDoc(output, "user");
            }
        } else {
            console.log("Data is not found, doing HTML fetch now.");
            nobHTMLFetch();
        }

        mapThere = null;
    }
}

/*function showHideTimers() {
 $('#loadTimersElement').toggle();
 }*/

function nobTravel(location) {
    if (NOBpage) {
        var url = "https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php";
        var data = {
            "origin": self.getCurrentUserEnvironmentType(),
            "destination": location,
            'uh': user.unique_hash
        };
        nobAjaxPost(url, data, function (r) {
            console.log(r);
        }, function (a, b, c) {
            console.log(a, b, c);
        });
    }
}

// Update + message fetch
function fetchGDocStuff() {
    if (NOBpage) {
        var currVer = GM_info.script.version;
        //var currVer = "1.4.400a";
        var checkVer;

        document.getElementById('NOBmessage').innerHTML = "Loading";
        nobLoading('NOBmessage');

        var theData = JSON.parse(nobGet('data'));
        if (theData.user) {
            theData = theData.user;
        }
        var userID = theData.sn_user_id;

        Parse.initialize("1YK2gxEAAxFHBHR4DjQ6yQOJocIrtZNYjYwnxFGN", "LFJJnSfmLVSq2ofIyNo25p0XFdmfyWeaj7qG5c1A");
        Parse.Cloud.run('nobMessage', {'user': userID}, {
            success: function (data) {
                nobStopLoading();
                data = JSON.parse(data);
                // MESSAGE PLACING
                message = data.message;
                var NOBmessage = document.getElementById('NOBmessage');
                NOBmessage.innerHTML = message;

                // UPDATE CHECK
                checkVer = data.version;
                if (debug) console.log('Current MH AutoBot version: ' + currVer + ' / Server MH AutoBot version: ' + checkVer);
                if (checkVer > currVer) {
                    var updateElement = document.getElementById('updateElement');
                    updateElement.innerHTML = "<a href=\"https://greasyfork.org/en/scripts/6092-mousehunt-autobot-revamp\" target='_blank'><font color='red'>YOUR SCRIPT IS OUT OF DATE, PLEASE CLICK HERE TO UPDATE IMMEDIATELY</font></a>";
                }

                // SPECIAL MESSAGE
                if (data.specialMessage != "" || data.specialMessage != undefined) {
                    var NOBspecialMessage = document.getElementById('nobSpecialMessage');
                    NOBspecialMessage.innerHTML = '<span style="background: chartreuse; font-size: 1.5em;">' + data.specialMessage + '</span>';
                }
            }, error: function (error) {
                setTimeout(function () {
                    fetchGDocStuff();
                }, 300000);
                //nobStopLoading();
                console.log(JSON.parse(error) + ' error - Parse is now not working qq... Retrying in 5 minutes');
            }
        });
    }
}

function pingServer() {
    if (NOBpage) {
        if (debug) console.log("Running pingServer()");
        var theData = JSON.parse(nobGet('data'));
        if (theData.user) {
            theData = theData.user;
        }
        var theUsername = theData.username;
        var thePassword = theData.sn_user_id;

        Parse.initialize("1YK2gxEAAxFHBHR4DjQ6yQOJocIrtZNYjYwnxFGN", "LFJJnSfmLVSq2ofIyNo25p0XFdmfyWeaj7qG5c1A");
        Parse.User.logIn(theUsername, thePassword).then(function (user) {
            //console.log("Success parse login");
            return Parse.Promise.as("Login success");
        }, function (user, error) {
            if (debug) console.log("Parse login failed, attempting to create new user now.");

            var createUser = new Parse.User();
            createUser.set("username", theUsername);
            createUser.set("password", thePassword);
            createUser.set("email", thePassword + "@mh.com");

            var usrACL = new Parse.ACL();
            usrACL.setPublicReadAccess(false);
            usrACL.setPublicWriteAccess(false);
            usrACL.setRoleReadAccess("Administrator", true);
            usrACL.setRoleWriteAccess("Administrator", true);
            createUser.setACL(usrACL);

            createUser.signUp(null, {
                success: function (newUser) {
                    console.log(newUser);
                    pingServer();
                    return Parse.Promise.error("There was an error.");
                },
                error: function (newUser, signupError) {
                    // Show the error message somewhere and let the user try again.
                    console.log("Parse Error: " + signupError.code + " " + signupError.message);
                    return Parse.Promise.error("Error in signup, giving up serverPing now.");
                }
            });
            return Parse.Promise.error("Failed login, attempted signup, rerunning code");
        }).then(function (success) {
            var UserData = Parse.Object.extend("UserData");

            var findOld = new Parse.Query(UserData);
            findOld.containedIn("user_id", [theData.sn_user_id, JSON.stringify(theData.sn_user_id)]);
            return findOld.find();
        }).then(function (returnObj) {
            var results = returnObj;
            var promises = [];
            for (var i = 0; i < results.length; i++) {
                promises.push(results[i].destroy());
            }
            //console.log("Done parse delete");
            return Parse.Promise.when(promises);
        }).then(function (UserData) {
            UserData = Parse.Object.extend("UserData");
            var userData = new UserData();

            userData.set("user_id", theData.sn_user_id);
            userData.set("name", theData.username);
            userData.set("script_ver", GM_info.script.version);
            userData.set("data", JSON.stringify(theData));
            userData.set("addonCode", addonCode);
            var dataACL = new Parse.ACL(Parse.User.current());
            dataACL.setRoleReadAccess("Administrator", true);
            dataACL.setRoleWriteAccess("Administrator", true);
            userData.setACL(dataACL);

            return userData.save();
        }).then(function (results) {
            //console.log("Success Parse");
        }).then(function (message) {
            if (message != undefined || message != null)
                console.log("Parse message: " + message);
            if (Parse.User.current() != null) {
                Parse.User.logOut();
                //console.log("Parse logout");
            }
        }, function (error) {
            if (error != undefined || error != null)
                console.log("Parse error: " + error);
        });
    }
}

function hideNOBMessage(time) {
    window.setTimeout(function () {
        var element = document.getElementById('NOBmessage');
        element.style.display = 'none';
    }, time);
}

function showNOBMessage() {
    document.getElementById('NOBmessage').style.display = 'block'
}

unsafeWindow.nobRaffle = function () {
    var i;
    var intState = 0;
    var nobRafInt = window.setInterval(function () {
        try {
            if (intState == 0 && !($('.tabs a:eq(1)').length > 0)) {
                $('#hgbar_messages').click();
                intState = 1;
                return;
            } else if ($('a.active.tab')[0].dataset.tab != 'daily_draw') {
                var tabs = $('a.tab');
                var theTab = "";
                for (i = 0; i < tabs.length; i++) {
                    if (tabs[i].dataset.tab == 'daily_draw') {
                        tabs[i].click();
                        return;
                    }
                }

                // If there are no raffles
                intState = 0;
                $("a.messengerUINotificationClose")[0].click();
                console.log("No raffles found.");
                window.clearInterval(nobRafInt);

                nobRafInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState != 2 && $('a.active.tab')[0].dataset.tab == 'daily_draw') {
                var ballot = $(".notificationMessageList input.sendBallot");
                for (i = ballot.length - 1; i >= 0; i--) {
                    ballot[i].click();
                }
                intState = 2;
                return;
            } else if ($('a.active.tab')[0].dataset.tab == 'daily_draw') {
                intState = 3;
            } else {
                intState = -1;
            }
        } catch (e) {
            console.log("Raffle interval error: " + e + ", retrying in 2 seconds.");
        } finally {
            if (intState == 3) {
                $("a.messengerUINotificationClose")[0].click();
                window.clearInterval(nobRafInt);

                nobRafInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState == -1) {
                console.log("Present error, user pls resolve yourself");
                window.clearInterval(nobRafInt);

                nobRafInt = null;
                intState = null;
                i = null;
                return;
            }
        }
    }, 2000);
};

unsafeWindow.nobPresent = function () {
    var intState = 0;
    var i;
    var nobPresInt = window.setInterval(function () {
        try {
            if (intState == 0 && !($('.tabs a:eq(1)').length > 0)) {
                $('#hgbar_messages').click();
                intState = 1;
                return;
            } else if ($('a.active.tab')[0].dataset.tab != 'gifts') {
                var tabs = $('a.tab');
                for (i = 0; i < tabs.length; i++) {
                    if (tabs[i].dataset.tab == 'gifts') {
                        tabs[i].click();
                        return;
                    }
                }

                // If there are no gifts
                intState = 0;
                $("a.messengerUINotificationClose")[0].click();
                console.log("No gifts found.");
                window.clearInterval(nobPresInt);

                nobPresInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState != 2 && $('a.active.tab')[0].dataset.tab == 'gifts') {
                var presents = $('input.acceptAndSend');
                for (i = presents.length - 1; i >= 0; i--) {
                    presents[i].click();
                }
                intState = 2;
                return;
            } else if ($('a.active.tab')[0].dataset.tab == 'gifts') {
                intState = 3;
            } else {
                intState = -1;
            }
        } catch (e) {
            console.log(e + " error, retrying to continue in 2 secs.");
        } finally {
            if (intState == 3) {
                $("a.messengerUINotificationClose")[0].click();
                window.clearInterval(nobPresInt);

                nobPresInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState == -1) {
                console.log("Present error, user pls resolve yourself");
                window.clearInterval(nobPresInt);

                nobPresInt = null;
                intState = null;
                i = null;
                return;
            }
        }
    }, 2000);
};

// CALCULATE TIMER *******************************
function currentTimeStamp() {
    return parseInt(new Date().getTime().toString().substring(0, 10), 10);
}

function createClockArea() {
    try {
        var parent = document.getElementById('loadTimersElement');
        var otherChild = document.getElementById('gDocLink');
        var child = [];
        var text;

        for (i = 0; i < LOCATION_TIMERS.length; i++) {
            child[i] = document.createElement('div');
            child[i].setAttribute("id", "NOB" + LOCATION_TIMERS[i][0]);
            text = '<span id="text_' + LOCATION_TIMERS[i][0] + '">';
            child[i].innerHTML = text;
        }

        for (i = 0; i < LOCATION_TIMERS.length; i++)
            parent.insertBefore(child[i], parent.firstChild);

        parent.insertBefore(document.createElement('br'), parent.firstChild);
    } catch (e) {
        console.log("createClockArea() ERROR: " + e);
    }
}

function clockTick() {
    var temp = document.getElementById('NOBrelic');
    if (clockNeedOn && !clockTicking && temp) {
        // Clock needs to be on, but is not ticking
        updateTime();
    } else if (clockTicking && clockNeedOn && temp) {
        // Clock needs to be on and is already ticking
    } else {
        // Clock does not need to be on
        nobCalculateTime();
    }
    NOBtickerInterval = window.setTimeout(function () {
        clockTick();
    }, 15 * 60 * 1000);
}

function updateTime() {
    try {
        var timeLeft = JSON.parse(nobGet('relic'));
        if (timeLeft > 0) {
            timeLeft--;
            var element = document.getElementById('NOBrelic');
            element.innerHTML = updateTimer(timeLeft, true);
            nobStore(timeLeft, 'relic');
            nobCalculateOfflineTimers();
            clockTicking = true;

            NOBtickerTimout = window.setTimeout(function () {
                updateTime();
            }, 1000);
        } else {
            clockTicking = false;
            clockNeedOn = false;
        }
    } catch (e) {
        if (debug) console.log("UpdateTime error: " + e);
        clearTimeout(NOBtickerTimout);
        clearTimeout(NOBtickerInterval)
    }
}

function nobCalculateTime(runOnly) {
    if (debug) console.log("Running nobCalculateTime(" + runOnly + ")");
    var child;
    if (runOnly != 'relic' & runOnly != 'toxic' & runOnly != 'none')
        runOnly = 'all';

    Parse.initialize("1YK2gxEAAxFHBHR4DjQ6yQOJocIrtZNYjYwnxFGN", "LFJJnSfmLVSq2ofIyNo25p0XFdmfyWeaj7qG5c1A");
    if ((runOnly == 'relic' || runOnly == 'all') && (typeof LOCATION_TIMERS[3][1].url != 'undefined' || LOCATION_TIMERS[3][1].url != 'undefined')) {
        Parse.Cloud.run('nobRelic', {}, {
            success: function (data) {
                data = JSON.parse(data);

                if (data.result == "error") {
                    child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                    child.innerHTML = "<font color='red'>" + data.error + "</font>";
                } else {
                    child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                    child.innerHTML = "Relic hunter now in: <font color='green'>" + data.location + "</font> \~ Next move time: <span id='NOBrelic'>" + updateTimer(data.next_move, true);
                    if (data.next_move > 0) {
                        clockTicking = true;
                        nobStore(data.next_move, 'relic');
                        updateTime();
                        clockNeedOn = true;
                    } else {
                        clockTicking = false;
                        clockNeedOn = false;
                    }
                }
            }, error: function (error) {
                error = JSON.parse(error);

                var child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                child.innerHTML = "<font color='red'>" + error + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
            }
        });
    }

    if ((runOnly == 'toxic' || runOnly == 'all') && (typeof LOCATION_TIMERS[4][1].url != 'undefined' || LOCATION_TIMERS[4][1].url != 'undefined')) {
        Parse.Cloud.run('nobToxic', {}, {
            success: function (data) {
                data = JSON.parse(data);

                if (data.result == "error") {
                    child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                    child.innerHTML = "<font color='red'>" + data.error + "</font>";
                } else {
                    child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                    if (data.level == 'Closed') {
                        data.level = {
                            color: 'red',
                            state: data.level
                        };
                    } else {
                        data.level = {
                            color: 'green',
                            state: data.level
                        };
                    }
                    if (data.percent < 0) {
                        data.percent = '';
                    } else {
                        data.percent = ' &#126; ' + (100 - data.percent) + '% left';
                    }
                    child.innerHTML = 'Toxic spill is now - <font color="' + data.level.color + '">' + data.level.state + '</font>' + data.percent;
                }
            }, error: function (error) {
                error = JSON.parse(error);

                child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                child.innerHTML = "<font color='red'>" + error + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
            }
        });
    }

    if (runOnly == 'all')
        nobCalculateOfflineTimers();
}

function nobCalculateOfflineTimers() {
    var CurrentTime = currentTimeStamp();
    for (i = 0; i < 3; i++) {
        var CurrentName = -1;
        var CurrentBreakdown = 0;
        var TotalBreakdown = 0;
        var iCount2;

        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length; iCount2++)
            TotalBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

        var CurrentValue = Math.floor((CurrentTime - LOCATION_TIMERS[i][1].first) / LOCATION_TIMERS[i][1].length) % TotalBreakdown;

        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentName == -1; iCount2++) {
            CurrentBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

            if (CurrentValue < CurrentBreakdown) {
                CurrentName = iCount2;
            }
        }

        var SeasonLength = (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[CurrentName]);
        var CurrentTimer = (CurrentTime - LOCATION_TIMERS[i][1].first);
        var SeasonRemaining = 0;

        while (CurrentTimer > 0) {
            for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentTimer > 0; iCount2++) {
                SeasonRemaining = CurrentTimer;
                CurrentTimer -= (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[iCount2]);
            }
        }

        SeasonRemaining = SeasonLength - SeasonRemaining;

        var seasonalDiv = document.getElementById('NOB' + LOCATION_TIMERS[i][0]);
        var content = "";
        content += LOCATION_TIMERS[i][0] + ': <font color="' + LOCATION_TIMERS[i][1].color[CurrentName] + '">' + LOCATION_TIMERS[i][1].name[CurrentName] + '</font>';
        if (LOCATION_TIMERS[i][1].effective != null) {
            content += ' (' + LOCATION_TIMERS[i][1].effective[CurrentName] + ')';
        }

        content += ' &#126; For ' + updateTimer(SeasonRemaining, true);
        seasonalDiv.innerHTML = content;
    }
}

// Attempt to inject addonCode made by user
function runAddonCode() {
    if (!NOBhasPuzzle && addonCode != "") {
        console.log("%cRUNNING ADDON CODE, SCRIPT IS NOW NOT SAFE DEPENDING ON WHAT YOU DID.", "color: yellow; background: red; font-size: 50pt;");
        eval(addonCode);
    }
}
