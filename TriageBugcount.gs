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
  var startSheet=0;
  var endSheeet=0;
  var MONTHS= ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  
// var ss = SpreadsheetApp.getActiveSpreadsheet();  
  var ss = SpreadsheetApp.openByUrl( 
   //'https://docs.google.com/spreadsheets/d/1q0aKSFbD946stAFFXj6jpR0tJ3R4klmoTnkg3XIQ318/edit#gid=212464204');//Test_Experimental-Triage-Daily
  'https://docs.google.com/spreadsheets/d/1F0zZ81U36splWTgvb8ipDgfWNeRLs8Qp1nuj-c5mqNQ/edit#gid=549692110');//Test
  //'https://docs.google.com/spreadsheets/d/1MELV9WjJlRkH7scjVsPP07LWgkzxAq5DNl7W5A8Ts5g/edit#gid=1258137971');//Copy of Test
  var numSheets=ss.getNumSheets();
  var sheetName=ss.getName();
  Logger.log("Work Sheet name %s",sheetName);  
  Logger.log("Num Sheets %s",numSheets); 
  Logger.log("Given month %s",curMonth);
  Logger.log("Given year %s",curYear);
  
  endSheeet=numSheets;
  var allsheets = ss.getSheets(); 
   for (var k in allsheets){//for each sheet
       var sheet =allsheets[k];
       var name= sheet.getName();  
       var fields = new Array();     
       fields = name.split("-");
       //Logger.log("Sheet name=%s, filed= %s",name,fields[1].toUpperCase().trim()); 
       if((typeof fields[1] != "undefined")&&(MONTHS[curMonth]==fields[1].toUpperCase().trim())){
       startSheet=Math.max(k-1,0.0);
       endSheeet=Math.min(startSheet+6,numSheets);
       
       break;
     }
        
   }
   Logger.log("Sheet start= %s,sheet end= %s",startSheet,endSheeet);
  
  for (var s=startSheet;s<endSheeet;s++){//for max sheets 6
    var sheet=allsheets[s];
    var name= sheet.getName();
    Logger.log("Sheet name %s",name); 
    var skip=false;
    var firstrow = sheet.getRange(1,1,1,numCols);
    var singlerow= firstrow.getValues();
    var singlerowdata=singlerow[0]    
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
     // var max_month=12.0;  
//      
//        if(isDate(date)) {
//          Logger.log("month=%s,parseFloat(month)=%s parseFloat(max_month)=%s",month,parseFloat(month),parseFloat(max_month));
//        }else{
//          if(isNaN(month) != true){
//          Logger.log("not  proper date");
//          }
//        }
                     
//      if( isNaN(month) != true){
//        Logger.log("month=%s,parseFloat(month)=%s parseFloat(max_month)=%s",month,parseFloat(month),parseFloat(max_month));
//        if(parseFloat(month) >= parseFloat(max_month))Logger.log("ERR: Date improper at %s %s ",dateIndex,ss.getName());
//      }
      
      if((dateString !="") && (( MONTHS[month] != MONTHS[curMonth]) || (parseFloat(year) != parseFloat(curYear))) )skip=true;           
      if((dateString !="") && ((MONTHS[month] == MONTHS[curMonth]) && (parseFloat(year) == parseFloat(curYear)))) skip=false;
      if(skip==true) continue; 
      
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
  
  
  for(var index in nameList){    
    Logger.log("%s,%s",nameList[index],bugCountList[index]);
    }
    var sum=0;
    for(var index in bugCountList){
    sum=sum+bugCountList[index];
    }                    
    Logger.log(sum);  
  
}

function isDate (x) 
{ 
  return (null != x) && !isNaN(x) && ("undefined" !== typeof x.getDate); 
}
