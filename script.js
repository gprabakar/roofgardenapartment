
let db;
const request = indexedDB.open("RoofGardenDB", 1);
request.onupgradeneeded = function(e){
  db = e.target.result;
  db.createObjectStore("contacts", {keyPath:"id", autoIncrement:true});
  db.createObjectStore("bookings", {keyPath:"id", autoIncrement:true});
};
request.onsuccess = function(e){ db = e.target.result; displayData(); };

function saveContact(){
  const name=document.getElementById("name").value;
  const phone=document.getElementById("phone").value;
  const message=document.getElementById("message").value;
  const tx=db.transaction("contacts","readwrite");
  tx.objectStore("contacts").add({name,phone,message,time:new Date().toLocaleString()});
  alert("Saved locally!");
}

function saveBooking(){
  const name=document.getElementById("bname").value;
  const service=document.getElementById("service").value;
  const date=document.getElementById("date").value;
  const time=document.getElementById("time").value;
  const tx=db.transaction("bookings","readwrite");
  tx.objectStore("bookings").add({name,service,date,time,created:new Date().toLocaleString()});
  alert("Booking saved locally!");
}

function displayData(){
 if(!db || !document.getElementById("data")) return;
 let output="";
 const tx=db.transaction(["contacts","bookings"],"readonly");
 tx.objectStore("contacts").openCursor().onsuccess=function(e){
  const cursor=e.target.result;
  if(cursor){ output+="<div class='card'>Contact: "+cursor.value.name+" "+cursor.value.phone+"</div>"; cursor.continue(); }
 };
 tx.objectStore("bookings").openCursor().onsuccess=function(e){
  const cursor=e.target.result;
  if(cursor){ output+="<div class='card'>Booking: "+cursor.value.name+" "+cursor.value.service+"</div>"; cursor.continue(); }
 };
 setTimeout(()=>document.getElementById("data").innerHTML=output,500);
}
