<!--
  id: 2475
  description: How I use Google spreadsheets for my freelance administration: here are two example spreadsheets to duplicate and some details on the used JavaScript.
  date: 2014-05-10T11:10:39
  modified: 2016-12-11T15:26:12
  slug: using-google-spreadsheets-for-invoicing
  type: post
  categories: admin, code, JavaScript, work
  tags: Google, JavaScript, freelance
  metaDescription: How I use Google spreadsheets for my freelance administration: here are two example spreadsheets to duplicate and some details on the used JavaScript.
  metaTitle: Using Google spreadsheets for your freelance quotations and invoicing
  metaKeyword: spreadsheet
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Using Google spreadsheets for your freelance invoicing

<p>Being your own boss is great! You get to pick your own clients, your own hours, your own workplace. Not so great is all the administrative work: making quotations, doing taxes, making invoices (although the latter does make me happy). Luckily I have a spreadsheet and JavaScript to do some of the boring stuff for me.</p>
<p><!--more--></p>
<p class="notice">The methods described here no longer work because Google silently <a href="https://code.google.com/p/google-apps-script-issues/issues/detail?id=5174">disabled a spreadsheets feature</a>.</p>
<p>Over the years I&#8217;ve tried to automate and streamline my administrative workflow.<br />
As co-founder of a small company I was responsible for the financial administration (this was in 2000-ish). I tested a lot of software and used some. We weren&#8217;t comfortable with the online solutions (yet) and the software that was left was not really up to our standards. So in the end we decided to roll our own running on PHP in LAN.<br />
When I left the company in 2007 I tried to use it briefly for my freelance work but I didn&#8217;t feel like fixing all the PHP migration issues (from 4 to 5). After another round of trying to find good accounting software I figured I might as well use Google Docs. The setup I have now is pretty smooth&#8230; well, smooth enough to share.</p>
<h2>Just two spreadsheets</h2>
<p>I have two basic documents: <a href="https://docs.google.com/spreadsheet/ccc?key=0AgLsBMvUgAW8dGhJSVZsWVFoSnFYYk9ScVJUeFAyb3c&amp;usp=sharing" target="_blank">one template</a> which I duplicate for each new project, and a <a href="https://docs.google.com/spreadsheets/d/1GJB_m7TV3O8Iha099Gb_bahF0eWZl_COfHqifJEV3EM/edit?usp=sharing" target="_blank">spreadsheet containing generic data</a>.</p>
<p>The template spreadsheet helps me doing three things:</p>
<ul>
<li>estimate the time (=money) for a project</li>
<li>create a quotation for the client</li>
<li>create an invoice (and reminders)</li>
</ul>
<p>
The template is coupled to a second &#8216;static&#8217; spreadsheet in which I keep track of:</p>
<ul>
<li>my own data (address, bank account details, etc..)</li>
<li>all the client data (client id, address, payment term, etc&#8230;)</li>
<li>basic tasks (bilingual since I sometimes work for international clients)</li>
<li>basic copy (header, footer, reminder, etc&#8230;)</li>
</ul>
<p>
My workflow is now as follows: a client asks me for a project and I&#8230;</p>
<ul>
<li>duplicate the template spreadsheet, rename it, fill out the clients id, a one line project summary, and a date</li>
<li>in the next tab/sheet I choose the project tasks from a drop-down and estimate the hours for each task</li>
<li>then head over to the quotation sheet, write a generic project scope paragraph and download it as PDF</li>
</ul>
<p>
When the project is finished I just fill out the invoice date and download the invoice as PDF</p>
<p>You can check them out here: <a href="https://docs.google.com/spreadsheet/ccc?key=0AgLsBMvUgAW8dGhJSVZsWVFoSnFYYk9ScVJUeFAyb3c&amp;usp=sharing" target="_blank">template</a>, <a href="https://docs.google.com/spreadsheets/d/1GJB_m7TV3O8Iha099Gb_bahF0eWZl_COfHqifJEV3EM/edit?usp=sharing" target="_blank">data</a>. Just duplicate them to fiddle around.<br />
When you duplicate them, make sure you set the &#8216;data sheet key&#8217; in the first row of the template to the one of the data sheet you just duplicated (you can find the key in the url, it&#8217;s the long hash)<br />
<small>I changed personal values like bank account and hourly rate.</small></p>
<p>For tldr sake I will not explain all the details, just these three: the calculation, the scripts, and the quotation. Just comment if you have any questions after that.</p>
<h2>Calculation</h2>
<p>Here I estimated the hours for a project. It&#8217;s divided into smaller tasks which will show up in the quotation and invoice.<br />
The subject can be anything but if you pick it from the dropdown the quotation will have the body text for that task already filled out (more about that later).</p>
<p><img class="alignnone" src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/drive_calculation.png" alt="The calculation sheet from the template spreadsheet" /></p>
<p>The estimated hours are multiplied by a deviation percentage and a discount percentage.<br />
This is always a bit of fiddling. My hourly rate goes down the more hours I estimate (I normally hide rows 13 to 18). Sometimes I work for a fixed project price, and sometimes for an hourly rate.<br />
Then there&#8217;s the type of client: big agencies are charged more than a sole entrepreneur. And the type of project: if it&#8217;s something really cool, a good cause or just work.<br />
But even if I lower my price I always explicitly point that out in the quotation and invoice.</p>
<h2>Quotation</h2>
<p>Especially making quotations used to take up a lot of time for me. Writing is not really my thing. And even though a the work I do is diverse, the quotations I make all have very similar setup. But I do not want to send my clients a generic copy-pasted document, I want to make them feel I wrote it specially for them.</p>
<p>Being a front-end developer I know a thing or two about variables and templating. So that&#8217;s what I used here: the static spreadsheet with the generic data has a sheet called tasks. Each task has a name and a description. The name is what you see in the calculation sheet&#8217;s dropdowns. The description is what will show up on the quotation sheet. The descriptions can have variables, indicated like %so%.<br />
The variables can be replaced by values from any sheet where the first column is the key and the second the value (which is why part of the calculation sheet is in the first two columns).</p>
<p>For instance in the tasks sheet of the data spreadsheet the first entry is &#8216;interaction design&#8217; with the value &#8216;<span data-sheets-value="[null,2,&quot;We make some drawings for %project name%.&quot;]" data-sheets-userformat="[null,null,9089,[null,0],null,null,null,null,null,null,2,1,0,null,null,null,10]">We make some drawings for %project name%.</span>&#8216;.<br />
In the template spreadsheet the value is used in the quotation sheet and the variable %project name% is replaced by the corresponding value from the &#8216;data&#8217; sheet. So it now says: &#8216;We make some drawings for ransackthis.&#8217;</p>
<p>If no key/value pair is present the script responds by returning &#8216;key not found in sheet&#8217;. So if you check the calculation sheet you&#8217;ll notice that the task &#8216;testing&#8217; has a red corner indicating that the key does not exist in the task list. In the quotation sheet you&#8217;ll see &#8221;Testing&#8217; not found in &#8216;tasks&#8221; on row 25. So here we&#8217;ll have to write something ourselves.</p>
<p>The precise workings of all this is done with the <a title="Spreadsheet Service" href="https://developers.google.com/apps-script/reference/spreadsheet/" target="_blank">Google spreadsheet API</a> and some good old fashioned JavaScript.</p>
<h2>Scripts</h2>
<p>The template spreadsheet has some custom methods. If you use the top menu and open &#8216;Tools / Script editor&#8217; you&#8217;ll see them.</p>
<p>The most important methods are &#8216;importSpreadsheet&#8217; and &#8216;getText&#8217;.<br />
The sheets from the data spreadsheet are loaded into the template spreadsheet. These imported sheets are hidden, you can unhide them from the main menu &#8216;View / Hidden sheets&#8217;. I used a custom import method here because I needed more dynamics: multiple languages and swapping the client data from a row to a column.<br />
The &#8216;getText&#8217; method does the actual variable replacement. It looks for a key in a sheet, then processes the variables in the value by searching the sheets from the third argument.<br />
Just check the commented code below.</p>
<pre><code data-language="JavaScript">/**
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
    ,bHorizontal = aKeys.length===1&amp;&amp;aKeys[0].length&gt;1
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
    for (var i=0,l=aCodes.length;i&lt;l;i++) {
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
	return [d&lt;=9?'0'+d:d,m&lt;=9?'0'+m:m,y].join('-');
}

/**
* Test if a parameter value is properly set (unset parameters from sheets are not undefined).
* @method
* @param value {Object} The parameter to test.
* @returns {Boolean} True if set.
*/
function isset(value){
  return value!==""&amp;&amp;value!==null&amp;&amp;value!==undefined;
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
  for (var i=1,l=arguments.length;i&lt;l;i+=2){
    text = text.replace(arguments[i],arguments[i+1]);
  }
  return text;
}</code></pre>
<h2>Downsides</h2>
<p>There are some small downsides of course.<br />
The main one is that this is Google spreadsheets. So any graphic design is not easy to implement, you&#8217;re stuck with the default fonts and exporting to PDF sometimes sucks because spreadsheets weren&#8217;t made with an A4 (or letter) paper size in mind.<br />
Sometimes the spreadsheet does a to good a job of caching values, especially the scripted ones. In which case you&#8217;ll have to open the script (Tools / Script editor) and hit the save icon so the spreadsheet values are recalculated.</p>
<p>But apart from that: it&#8217;s relatively easy to use and you have full control.</p>
<p>&nbsp;</p>