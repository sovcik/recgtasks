﻿// Copyright 2015 Jozef Sovcik. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//*********************************************************

//---------------------------------------------------
// Read user-level properties for this script from Google properties store
function getUserProps() {
  var p = PropertiesService.getUserProperties();
  var allOK = true;
  
  var dftListPrefix = "~R";  // default RTTL prefix
  var dftRangeLength = "21"; // 3 weeks by default
  var dftDateFormat = "2";   // US date format by default
  var dftLogLevel = "03";
  var dftWeekStart = "S";    // week starts on Sunday by default

  // read user specific properties and initialize them if needed
  var newp = {
    destTaskListId: p.getProperty("destTaskListId") || (allOK = false) || Tasks.Tasklists.list().items[0].id,
    dateRangeLength: p.getProperty("dateRangeLength") || (allOK = false) || dftRangeLength,
    recListPrefix: p.getProperty("recListPrefix") ||  (allOK = false) || dftListPrefix,
    dateFormat: p.getProperty("dateFormat") || (allOK = false) || dftDateFormat, 
    logVerboseLevel: p.getProperty("logVerboseLevel") || (allOK = false) || dftLogLevel,
    weekStartsOn: p.getProperty("weekStartsOn") || (allOK = false) || dftWeekStart,
    ignoreDeleted: p.getProperty("ignoreDeleted") || (allOK = false) || "Y", 
    slideOverdue: p.getProperty("slideOverdue") || (allOK = false) || "N" 
  };
  
  logIt(LOG_DEV, "Props loaded %s",JSON.stringify(newp));
  
  // check values
  if (newp.dateRangeLength.toString().search(/^14|21|28|42|56$/) == -1) { 
    newp.dateRangeLength = dftRangeLength;
    allOK = false;
  }
  
  if (!newp.dateFormat.toString().search(/^1|2|3$/) == -1 ) { 
    newp.dateFormat = dftDateFormat;
    allOK = false;
  }
  
  if (!newp.logVerboseLevel.toString().search(/^01|02|03|04|10$/) == -1) {
    newp.logVerboseLevel = dftLogLevel;
    allOK = false;
  }

  //if not all properties were written in the property store
  if (!allOK) {
    p.setProperties(newp, true); //then write them and delete all other properties (if any)
    logIt(LOG_CRITICAL,'User properties initialized.');
  }
  
  return newp
}  

//--------------------------------------------------
// Save user-level properties for this script to Google properties store
function setUserProps(newp) {
  var p = PropertiesService.getUserProperties();
  p.setProperties(newp);
  logIt(LOG_INFO, "User properties saved.");
  logIt(LOG_DEV, "%s",JSON.stringify(newp));
  return newp
}

//--------------------------------------------------
// Remove all user properties set by this app
function removeUserProps() {
  var p = PropertiesService.getUserProperties();
  p.deleteAllProperties();
  logIt(LOG_INFO, "User properties REMOVED.");
}


