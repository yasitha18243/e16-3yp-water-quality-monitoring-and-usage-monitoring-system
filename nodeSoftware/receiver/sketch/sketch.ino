#include <SoftwareSerial.h>

#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>

const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1);
DNSServer dnsServer;
ESP8266WebServer webServer(80);

uint8_t pin_led = 16;

boolean initialized = false;

char webpage2[] PROGMEM = R"=====(

<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>

<p>My first paragraph.</p>

</body>
</html>


)=====";

char webpage[] PROGMEM = R"=====(
<html>
<head>

  <style>
      html, body {
      display: flex;
      justify-content: center;
      height: 100%;
      }
      body, div, h1, form, input, p { 
      padding: 0;
      margin: 0;
      outline: none;
      font-family: Roboto, Arial, sans-serif;
      font-size: 16px;
      background: linear-gradient(to right, #4776e6, #8e54e9);
      }
      h1 {
      padding: 10px 0;
      font-size: 32px;
      font-weight: 300;
      text-align: center;
      }
      p {
      font-size: 20px;
      }
      hr {
      color: #a9a9a9;
      opacity: 0.3;
      }
      .main-block {
      max-width: 540px; 
      min-height: 500px; 
      padding: 10px 0;
      margin: auto;
      border-radius: 5px; 
      border: solid 1px #ccc;
      box-shadow: 1px 2px 5px rgba(0,0,0,.31); 
      background: linear-gradient(to right, #4776e6, #8e54e9);
      }
      form {
      margin: 0 30px;
      }
     
      label#icon {
      margin: 0; 
      border-radius: 5px 0 0 5px;
      }
      
     
      
      input[type=text] {
      width: calc(100% - 57px);
      height: 50px;
      margin: 13px 0 0 -5px;
      padding-left: 10px; 
      border-radius: 0 5px 5px 0;
      border: solid 1px #cbc9c9; 
      box-shadow: 1px 2px 5px rgba(0,0,0,.09); 
      background: #fff; 
       font-size: 20px;
      }
     
    
      .btn-block {
      margin-top: 10px;
      text-align: center;
      }
      button {
      width: 100%;
      padding: 10px 0;
      margin: 10px auto;
      border-radius: 5px; 
      border: none;
      background: #1c87c9; 
      font-size: 20px;
      font-weight: 600;
      color: #fff;
      }
      button:hover {
      background: #26a9e0;
      }
    </style>

</head>


 <body>
    <div class="main-block">
      <h1><b>Device Setup!</b></h1>
      <br>
      <form>
        <hr>        
        <hr>
        <br>
        <label  for="email"></i></label>
        <input type="text" name="email" id="email" placeholder="Email" required/>
        
        <label  for="tank"></i></label>
        <input type="text" name="tank" id="tank" placeholder="Tank No" required/>
        <br>
        <br>
        <hr>
        <hr>
        <br>

        <div class="btn-block">
          <p>Please provide the email address that you are registered with</a>.</p>
          <br>
          
        </div>
        <button onclick="myFunction()">Submit</button>
      </form>
    </div>
  </body>


<script>
function myFunction()
{
  /*
  console.log("button was clicked!");
  var xhr = new XMLHttpRequest();
  var url = "/set";

  xhr.onreadystatechange = function() 
  {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("led-state").innerHTML = this.responseText;
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
   */
  //var data = {}; 
  var email = document.getElementById("email").value;
  var no = document.getElementById("tank").value;
 
  var json = JSON.stringify({ email, no });
   console.log(json);
  var xhr = new XMLHttpRequest();
    var URL = '/set';
    xhr.open("POST", URL, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    
  xhr.onload = function()
   {
      alert("Tank " + no + " for " + email + " is initialized.");
      window.close();
      //self.close();
   }

   xhr.send(json);


  
    
  
};

</script>
</html>
)=====";





SoftwareSerial serial(D1, D2);

String ip = "http://awsip/";
String rest = "readings/";
String initialize = ip + "/setup/" + "id";
//String URL = ip + rest;

String URL;






void setup() 
{
Serial.begin(115200);
serial.begin(9600);
delay(10000);
//Serial.println(URL);
//WiFiManager wifiManager;
 
  Serial.println("*******************************************************************************Device Setup!**************************************************************");

  configDevice();
  connect();
  
  /*
  //wifiManager.autoConnect
  HTTPClient http;  //Declare an object of class HTTPClient
 
  http.begin(URL);  //Specify request destination
     

  while(http.GET() != 1)
  {}
  
  String reply = http.getString();
//  rest = rest + reply;
  delay(1000);


Serial.println(reply);
*/
}

void loop() 
{
  Serial.println("waiting for data");
  // put your main code here, to run repeatedly:
  
  while(!serial.available())
  {}

  
String message = serial.readStringUntil('\n');
Serial.println(message); 


if (WiFi.status() == WL_CONNECTED) 
{ //Check WiFi connection status
 
    HTTPClient http;  //Declare an object of class HTTPClient
 
    http.begin(URL);  //Specify request destination

    String data =  message;
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.PUT(data);                         //Send the request


     
    if (httpResponseCode > 0) { //Check the returning code
       
     
      Serial.println("success");             //Print the response payload
 
    }
 
    http.end();   //Close connection
 
}
else
{
  connect(); 
}


}


void setValues()
{
 
      String message = "Body received:\n";
             message += webServer.arg("plain");
             message += "\n";
 
      webServer.send(200, "text/plain", message);
      Serial.println(message);
  
  Serial.println("Now true");
  
  delay(2000);
  webServer.close();
  initialized = true;
}

void serveReq()
{
  while(!initialized)
  {
    dnsServer.processNextRequest();
    webServer.handleClient();
  
  }

}

void configDevice()
{
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP("AquaWatcher Device Setup!");
  dnsServer.setTTL(300);
  dnsServer.setErrorReplyCode(DNSReplyCode::ServerFailure);
  dnsServer.start(DNS_PORT, "www.aqwsetup.com", apIP);

  Serial.println("Server Up!");

  webServer.onNotFound([]() 
  {
    webServer.send(200, "text/html", webpage);
  });

  webServer.on("/set", setValues);
  webServer.begin();
  serveReq();
}



void connect()
{ 
    
  WiFiManager wifiManager;
  wifiManager.setCustomHeadElement("<style>button{border-radius: 36px; background: black;color: white;} body{ margin: 20px 40px;font-size: 1.2rem;letter-spacing: 1px;background: linear-gradient(to right, #4776e6, #8e54e9);background-size: auto;}</style>");
  wifiManager.autoConnect("Aqua Watcher");
  Serial.println("**********************************Connected to wifi*************************************");
  
}
  
 
