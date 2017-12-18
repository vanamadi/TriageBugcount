function BugCount() {
  var DATE_COL=0  
  var NAME_COL=1;
  var BUGID_COL=2;
  var nameList = new Array();
  var bugCountList = new Array(); 
  var rowcount = new Array(); 
  var curDate = new Date();
  var curMonth =10;//curDate.getMonth();
  var curYear = curDate.getYear();
  var startRow=2;
  var numCols=3;  
  var index=0;
  var validSheetCnt=0;
  var persheetcnt=0;
  var MONTHS= ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  
 //var ss = SpreadsheetApp.getActiveSpreadsheet();  
  var ss = SpreadsheetApp.openByUrl( 
  'https://docs.google.com/spreadsheets/d/1MELV9WjJlRkH7scjVsPP07LWgkzxAq5DNl7W5A8Ts5g/edit#gid=1258137971');
  Logger.log("Sheet name %s", ss.getName());  
  Logger.log("Sheet name %s",ss.getNumSheets()); 
  Logger.log("Given month %s",curMonth);
  Logger.log("Given year %s",curYear);
  
  var allsheets = ss.getSheets(); 
  
  for (var s in allsheets){//for each sheet
    var sheet=allsheets[s];
    var skip=false;
    var firstrow = sheet.getRange(1,1,1,numCols);
    var singlerow= firstrow.getValues();
    var singlerowdata=singlerow[0]
    Logger.log(singlerowdata[1].toUpperCase().trim());
    if((singlerowdata[1].toUpperCase().trim() != "NAME")&&(singlerowdata[2].toUpperCase().trim() != "BUG ID"))continue;//sheet validation 
    validSheetCnt++;
    persheetcnt=0;
    var numRows=sheet.getLastRow();  
    // When the "numRows" argument is used, only a single column of data is returned.
    
    var dataRange = sheet.getRange(startRow,1, sheet.getLastRow(),numCols);
    var data=dataRange.getValues();        
    for (var dateIndex in data) { 
      var row = data[dateIndex];
      var dateString=row[DATE_COL];       
      var date = new Date(dateString); 
      var month=date.getMonth();
      var year=date.getYear();       
      
      if(parseFloat(month)>11)Logger.log("ERR: Date improper at %s %s ",dateIndex,ss.getName());  
      if((dateString !="") && (( MONTHS[month] != MONTHS[curMonth]) || (parseFloat(year) != parseFloat(curYear))) )skip=true;           
      if((dateString !="") && ((MONTHS[month] == MONTHS[curMonth]) && (parseFloat(year) == parseFloat(curYear)))) skip=false;
      if(skip==true) continue; 
      //Logger.log("Current year %s",curYear);
      //Logger.log("Year from sheet %s",year);
      var bugId=row[BUGID_COL];
      if(bugId =="")continue;
      var toCopy = true;         
      if (row[NAME_COL] !=""){     
        var name = row[NAME_COL].toUpperCase().trim();          
        
        for(var j in nameList){
          if(name == nameList[j]){//to find the duplicate name in the list
            toCopy = false; 
            index=j;//index of the duplicate
            bugCountList[index]++;
            persheetcnt++;
          }
          
        }
        
      }else{       
        bugCountList[index]++;
        persheetcnt++;
      }
      if(toCopy && row[NAME_COL] !=""){
        persheetcnt++;
        nameList.push(name); //Append the name at last of the nameList.
        bugCountList.push(1);
        index=nameList.length-1;//update the index with last index of the list.
      } 
    }
   
   Logger.log("per sheet count %s",persheetcnt);  
      
  }
  
  Logger.log("Valid sheet Count %s",validSheetCnt);
  for(var index in nameList){    
    Logger.log("%s,%s",nameList[index],bugCountList[index]);
    }
    var sum=0;
    for(var index in bugCountList){
    sum=sum+bugCountList[index];
    }                    
    Logger.log(sum);  
  
}
