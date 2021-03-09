#include <SoftwareSerial.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
 
SoftwareSerial serial(D1, D2);

String ip = "http://awsURL";
String rest = "/readings/";
String initialize = ip + "/setup/" + "id";
String URL = ip + rest;


void setup() 
{
Serial.begin(115200);
serial.begin(9600);


 

  Serial.println("Device Setup!");

  HTTPClient http;  //Declare an object of class HTTPClient
 
  http.begin(initialize);  //Specify request destination
   

  while(http.GET() != 1)
  {}
  
  String reply = http.getString();
  rest = rest + reply;
  delay(1000);


Serial.println(rest);
}

void loop() 
{
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


  
  
void connect() 
{
  WiFi.begin("HUAWEI", "qwertyuiop");   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) 
  {  //Wait for the WiFI connection completion
 
    delay(2000);
    Serial.print(".");
 
  }
 Serial.println("Connected to wifi");
}
