<!--
  date: 2014-05-10
  modified: 2020-03-16
  slug: using-google-spreadsheets-for-invoicing
  type: post
  categories: admin, code, JavaScript, work
  tags: Google, JavaScript, freelance
  description: How I use Google spreadsheets for my freelance administration: here are two example spreadsheets to duplicate and some details on the used JavaScript.
-->

# Using Google spreadsheets for your freelance invoicing

Being your own boss is great! You get to pick your own clients, your own hours, your own workplace. Not so great is all the administrative work: making quotations, doing taxes, making invoices (although the latter does make me happy). Luckily I have a spreadsheet and JavaScript to do some of the boring stuff for me.

The methods described here no longer work because Google silently [disabled a spreadsheets feature](https://code.google.com/p/google-apps-script-issues/issues/detail?id=5174).

Over the years I’ve tried to automate and streamline my administrative workflow.  
As co-founder of a small company I was responsible for the financial administration (this was in 2000-ish). I tested a lot of software and used some. We weren’t comfortable with the online solutions (yet) and the software that was left was not really up to our standards. So in the end we decided to roll our own running on PHP in LAN.  
When I left the company in 2007 I tried to use it briefly for my freelance work but I didn’t feel like fixing all the PHP migration issues (from 4 to 5). After another round of trying to find good accounting software I figured I might as well use Google Docs. The setup I have now is pretty smooth… well, smooth enough to share.

## Just two spreadsheets

I have two basic documents: [one template](https://docs.google.com/spreadsheet/ccc?key=0AgLsBMvUgAW8dGhJSVZsWVFoSnFYYk9ScVJUeFAyb3c&usp=sharing) which I duplicate for each new project, and a [spreadsheet containing generic data](https://docs.google.com/spreadsheets/d/1GJB_m7TV3O8Iha099Gb_bahF0eWZl_COfHqifJEV3EM/edit?usp=sharing).

The template spreadsheet helps me doing three things:

*   estimate the time (=money) for a project
*   create a quotation for the client
*   create an invoice (and reminders)

The template is coupled to a second ‘static’ spreadsheet in which I keep track of:

*   my own data (address, bank account details, etc..)
*   all the client data (client id, address, payment term, etc…)
*   basic tasks (bilingual since I sometimes work for international clients)
*   basic copy (header, footer, reminder, etc…)

My workflow is now as follows: a client asks me for a project and I…

*   duplicate the template spreadsheet, rename it, fill out the clients id, a one line project summary, and a date
*   in the next tab/sheet I choose the project tasks from a drop-down and estimate the hours for each task
*   then head over to the quotation sheet, write a generic project scope paragraph and download it as PDF

When the project is finished I just fill out the invoice date and download the invoice as PDF

You can check them out here: [template](https://docs.google.com/spreadsheet/ccc?key=0AgLsBMvUgAW8dGhJSVZsWVFoSnFYYk9ScVJUeFAyb3c&usp=sharing), [data](https://docs.google.com/spreadsheets/d/1GJB_m7TV3O8Iha099Gb_bahF0eWZl_COfHqifJEV3EM/edit?usp=sharing). Just duplicate them to fiddle around.  
When you duplicate them, make sure you set the ‘data sheet key’ in the first row of the template to the one of the data sheet you just duplicated (you can find the key in the url, it’s the long hash)  
<small>I changed personal values like bank account and hourly rate.</small>

For tldr sake I will not explain all the details, just these three: the calculation, the scripts, and the quotation. Just comment if you have any questions after that.

## Calculation

Here I estimated the hours for a project. It’s divided into smaller tasks which will show up in the quotation and invoice.  
The subject can be anything but if you pick it from the dropdown the quotation will have the body text for that task already filled out (more about that later).

![The calculation sheet from the template spreadsheet](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/drive_calculation.png)

The estimated hours are multiplied by a deviation percentage and a discount percentage.  
This is always a bit of fiddling. My hourly rate goes down the more hours I estimate (I normally hide rows 13 to 18). Sometimes I work for a fixed project price, and sometimes for an hourly rate.  
Then there’s the type of client: big agencies are charged more than a sole entrepreneur. And the type of project: if it’s something really cool, a good cause or just work.  
But even if I lower my price I always explicitly point that out in the quotation and invoice.

## Quotation

Especially making quotations used to take up a lot of time for me. Writing is not really my thing. And even though a the work I do is diverse, the quotations I make all have very similar setup. But I do not want to send my clients a generic copy-pasted document, I want to make them feel I wrote it specially for them.

Being a front-end developer I know a thing or two about variables and templating. So that’s what I used here: the static spreadsheet with the generic data has a sheet called tasks. Each task has a name and a description. The name is what you see in the calculation sheet’s dropdowns. The description is what will show up on the quotation sheet. The descriptions can have variables, indicated like %so%.  
The variables can be replaced by values from any sheet where the first column is the key and the second the value (which is why part of the calculation sheet is in the first two columns).

For instance in the tasks sheet of the data spreadsheet the first entry is ‘interaction design’ with the value ‘<span data-sheets-value="[null,2,&quot;We make some drawings for %project name%.&quot;]" data-sheets-userformat="[null,null,9089,[null,0],null,null,null,null,null,null,2,1,0,null,null,null,10]">We make some drawings for %project name%.</span>‘.  
In the template spreadsheet the value is used in the quotation sheet and the variable %project name% is replaced by the corresponding value from the ‘data’ sheet. So it now says: ‘We make some drawings for ransackthis.’

If no key/value pair is present the script responds by returning ‘key not found in sheet’. So if you check the calculation sheet you’ll notice that the task ‘testing’ has a red corner indicating that the key does not exist in the task list. In the quotation sheet you’ll see ”Testing’ not found in ‘tasks” on row 25\. So here we’ll have to write something ourselves.

The precise workings of all this is done with the [Google spreadsheet API](https://developers.google.com/apps-script/reference/spreadsheet/ "Spreadsheet Service") and some good old fashioned JavaScript.

## Scripts

The template spreadsheet has some custom methods. If you use the top menu and open ‘Tools / Script editor’ you’ll see them.

The most important methods are ‘importSpreadsheet’ and ‘getText’.  
The sheets from the data spreadsheet are loaded into the template spreadsheet. These imported sheets are hidden, you can unhide them from the main menu ‘View / Hidden sheets’. I used a custom import method here because I needed more dynamics: multiple languages and swapping the client data from a row to a column.  
The ‘getText’ method does the actual variable replacement. It looks for a key in a sheet, then processes the variables in the value by searching the sheets from the third argument.  
Just check the commented code below.

```javascript
/**
 * Imports a spreadsheet into another spreadsheet as a key-value range.
 * @param {String} sheet The spreadsheet id.
 * @param {String} [tab] The sheet name.
 * @param {String} [keys] The row or column containing the keys.
 * @param {String} [values1] The row or column containing the values.
 * @param {String} [values2] Fallback row or column to use if value is empty.
 * @returns {Array}
 */
function importSpreadsheet(sheet,tab,keys,values1,values2){
  if (!isset(keys)) keys = 'A1:A';
  var oSpreadsheet = isset(sheet)?SpreadsheetApp.openById(sheet):SpreadsheetApp.getActiveSpreadsheet()
    ,oSheet = oSpreadsheet.getSheetByName(isset(tab)?tab:oSpreadsheet.getSheets()[0].getName())
    ,aKeys = oSheet.getRange(keys).getValues()
    ,bHorizontal = aKeys.length===1&&aKeys[0].length>1
    ,bSecondaryValues
    ,aValues1
    ,aValues2
    ,fnSwap = function(v){return [v];}
  ;

  //var aAlphabet = Array.apply(0,Array(26)).map(function(x,y){return String.fromCharCode(y+65);});

  if (!isset(values1)) values1 = bHorizontal?'A2:2':'B1:B';

  bSecondaryValues = isset(values2);
  //return JSON.stringify(bSecondaryValues) ;

  aValues1 = oSheet.getRange(values1).getValues();
  if (bSecondaryValues) aValues2 = oSheet.getRange(values2).getValues();

  if (bHorizontal) {
    aKeys = aKeys[0].map(fnSwap);
    aValues1 = aValues1[0].map(fnSwap);
    if (bSecondaryValues) aValues2 = aValues2[0].map(fnSwap);
  }
  //return JSON.stringify(aValues1);

  return aKeys.map(function(key,index){
    return [key,bSecondaryValues?aValues1[index][0]||aValues2[index][0]:aValues1[index][0]];
  });
}

/**
 * Maps a sheet to an object with key-value pairs.
 * @param {String} sheet
 * @returns {Object}
 */
function getDictionary(sheet) { // todo: cache
  var oSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var oSheet = oSpreadsheet.getSheetByName(sheet);
  while(oSheet.getRange('A1').getValues().pop().pop().substr(0,1)==="#") {
    Utilities.sleep(500);
  }
  var aRange = oSheet.getDataRange().getValues()
  ,oDictionary = {};
  aRange.forEach(function(keyValue){
    var oValue = keyValue[1]
    ,bDate = oValue instanceof Date;
    oDictionary[keyValue[0]] = bDate?dateToDMY(oValue):oValue;
  });
  return oDictionary;
}

/**
 * Get text by key from a sheet.
 * Optionally map %keywords% with values from other sheets.
 * @param {String} sheet The sheet the keyword is in
 * @param {String} key The keyword to find
 * @param {String} [map] A comma separated string with sheet names
 * @returns {*}
 */
function getText(sheet,key,map) {
  var oDictionary = getDictionary(sheet)
    ,sText = oDictionary.hasOwnProperty(key)?oDictionary[key]:'''+key+'' not found in ''+sheet+'''
  ;
  if (isset(map)) {
    sText = parseText(sText,map);
  }
  return sText;
}

/**
 * Searches text for %keywords% and replaces them with the corresponding values from other sheets
 * @param {String} text
 * @param {String} A comma separated string with sheet names
 * @returns {String}
 */
function parseText(text,map){
  var aCodes = text.match(/%([^%]+)%/g);
  if (aCodes) {
    var oDictionary = {};
    map.split(',').forEach(function(mapSheet){
      extend(oDictionary,getDictionary(mapSheet));
    });
    // search and replace codes in text
    for (var i=0,l=aCodes.length;i<l;i++) {
      var sCode = aCodes[i]
      ,sKey = sCode.match(/%([^%]+)%/).pop();
      if (oDictionary.hasOwnProperty(sKey)) {
        text = text.replace(sCode,oDictionary[sKey]);
      }
    }
  }
  return text;
}

/**
 * Converts a date to d-m-y
 * @param date
 * @returns {string}
 */
function dateToDMY(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return [d<=9?'0'+d:d,m<=9?'0'+m:m,y].join('-');
}

/**
* Test if a parameter value is properly set (unset parameters from sheets are not undefined).
* @method
* @param value {Object} The parameter to test.
* @returns {Boolean} True if set.
*/
function isset(value){
  return value!==""&&value!==null&&value!==undefined;
}

/**
* Extend an object
* @method
* @param obj {Object} Subject.
* @param fns {Object} Property object.
* @returns {Object} Subject.
*/
function extend(obj,fns){
  for (var s in fns) if (obj[s]===undefined) obj[s] = fns[s];
  return obj;
}

/**
 * Replace a string multiple times
 * @param {String} text
 * @param {..String} [needle] The string to search for
 * @param {..String} [replacement] The replacement
 * @returns {String}
 */
function rereplace(text) {
  for (var i=1,l=arguments.length;i<l;i+=2){
    text = text.replace(arguments[i],arguments[i+1]);
  }
  return text;
}
```

## Downsides

There are some small downsides of course.  
The main one is that this is Google spreadsheets. So any graphic design is not easy to implement, you’re stuck with the default fonts and exporting to PDF sometimes sucks because spreadsheets weren’t made with an A4 (or letter) paper size in mind.  
Sometimes the spreadsheet does a to good a job of caching values, especially the scripted ones. In which case you’ll have to open the script (Tools / Script editor) and hit the save icon so the spreadsheet values are recalculated.

But apart from that: it’s relatively easy to use and you have full control.
