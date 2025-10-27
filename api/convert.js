// Nightbot-friendly: input = "DD/MM/YYYY HH:MM:SS AM/PM"
(function(){
  function pad(n){ return String(n).padStart(2,'0'); }
  try{
    var q = typeof q !== "undefined" ? String(q) : "";
    if(!q.trim()) {
      console.log(JSON.stringify('❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)'));
      return;
    }

    // normalize spaces, separate AM/PM if attached
    var s = q.trim().replace(/\s+/g,' ').replace(/(AM|PM)$/i, function(m){ return ' ' + m.toUpperCase(); });
    var parts = s.split(' ');
    if(parts.length < 3){
      console.log(JSON.stringify('❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)'));
      return;
    }

    // last token = AM/PM, one before = time, the rest joined = date (so date can have spaces if user typed weird)
    var ampm = parts[parts.length-1].toUpperCase();
    var timeStr = parts[parts.length-2];
    var dateTokens = parts.slice(0, parts.length-2).join(' ');
    // date must be DD/MM/YYYY
    var md = dateTokens.split('/');
    if(md.length !== 3 || !/^\d{1,2}:\d{2}:\d{2}$/.test(timeStr) || (ampm !== 'AM' && ampm !== 'PM')){
      console.log(JSON.stringify('❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)'));
      return;
    }

    var day = parseInt(md[0],10), month = parseInt(md[1],10), year = parseInt(md[2],10);
    if(!day || !month || !year || month<1 || month>12){
      console.log(JSON.stringify('❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)'));
      return;
    }

    // convert time to 24h
    var tparts = timeStr.split(':').map(function(x){return parseInt(x,10);});
    var hh = tparts[0], mm = tparts[1], ss = tparts[2];
    if(isNaN(hh)||isNaN(mm)||isNaN(ss)) {
      console.log(JSON.stringify('❌ Wrong format. Use: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)'));
      return;
    }
    // adjust 12h -> 24h
    if(ampm === 'AM'){
      if(hh === 12) hh = 0;
    } else { // PM
      if(hh < 12) hh += 12;
    }

    // create JS Date (month name) reliably
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var monName = months[month-1];
    var jsDate = new Date(monName + ' ' + day + ' ' + year + ' ' + pad(hh) + ':' + pad(mm) + ':' + pad(ss));
    if(isNaN(jsDate.getTime())){
      console.log(JSON.stringify('❌ Could not parse date/time. Check values.'));
      return;
    }

    // add +5 hours
    jsDate.setHours(jsDate.getHours() + 5);

    // build strings used inside the eval templates
    var outMon = months[jsDate.getMonth()];
    var outDay = pad(jsDate.getDate());
    var outYear = jsDate.getFullYear();
    var outTime = jsDate.toTimeString().split(' ')[0]; // HH:MM:SS

    // two eval date formats used in your template:
    var dateNoComma = outMon + ' ' + outDay + ' ' + outYear + ' ' + outTime;      // e.g. Jul 17 2025 20:50:54
    var dateWithComma = outMon + ' ' + outDay + ', ' + outYear + ' ' + outTime;  // e.g. Jul 17, 2025 20:50:54
    var dayAnchor = outMon + ' ' + outDay + ', ' + outYear + ' 17:00:00';        // for Day: calc (keeps 17:00:00 anchor)

    // original display should preserve the input formatting but normalized (zero-pad D/M)
    var displayDay = pad(day);
    var displayMonth = pad(month);
    var display = displayDay + '/' + displayMonth + '/' + year + ' ' + pad((tparts[0])) + ':' + pad(mm) + ':' + pad(ss) + ' ' + ampm;

    // final output using safe eval forms (no backticks inside eval)
    var result = "LIVE started " + display + " ◆$(eval a=new Date('" + dateNoComma + "');t=Math.floor((Date.now()-a)/1000);d=Math.floor(t/86400);h=Math.floor(t%86400/3600);m=Math.floor(t%3600/60);s=Math.floor(t%60);d+'D '+h+'h '+m+'m '+s+'s') ◆ Day:$(eval Math.floor((Date.now()-new Date('" + dayAnchor + "'))/86400000+2))";

    console.log(JSON.stringify(result));
  }catch(e){
    console.log(JSON.stringify('❌ Error: ' + e.message));
  }
})();