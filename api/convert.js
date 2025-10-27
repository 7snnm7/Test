function convert(q){
if(!q)return'❌ Use this format: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';
var p=q.trim().split(/\s+/);
if(p.length!=3)return'❌ Use this format: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';
var d=p[0].split('/'),t=p[1],ampm=p[2].toUpperCase();
if(d.length!=3||!t.match(/^\\d{1,2}:\\d{2}:\\d{2}$/)||(ampm!="AM"&&ampm!="PM"))return'❌ Use this format: !ml DD/MM/YYYY HH:MM:SS AM/PM (Example: !ml 17/07/2025 04:50:54 PM)';
var day=d[0],month=d[1],year=d[2];
var M=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month-1];
var date=new Date(M+" "+day+" "+year+" "+t+" "+ampm);
date.setHours(date.getHours()+5);
var f=M+" "+date.getDate()+" "+year+" "+date.toTimeString().split(' ')[0];
return "LIVE started "+day+"/"+month+"/"+year+" "+t+" "+ampm+" ◆$(eval a=new Date('"+f+"');t=Math.floor((Date.now()-a)/1000);d=Math.floor(t/86400);h=Math.floor(t%86400/3600);m=Math.floor(t%3600/60);s=Math.floor(t%60);d+'D '+h+'h '+m+'m '+s+'s') ◆ Day:$(eval Math.floor((Date.now()-new Date('"+f+"'))/86400000+2))";
}
convert(q);