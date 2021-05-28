
#include <ArduinoJson.h>  

int limit = 0;

int USAGE = 0;


int readDelay = 75;

int HEIGHT = 0;

unsigned long timeNow = 0;
const unsigned long interval = 15*60*1000; // interval time

int TURBPin = A2;
int LEVELpin = A0; 
int TDSPin = A1;
int USAGEPin = 3; 
int speaker = 11;  

boolean alert = false;

int getTDS(int pin);
int getTURB(int pin);
int getLevel(int pin);


void setup()   
{
  Serial.begin(9600);
  HEIGHT = getLevel(LEVELpin);
  limit = getTDS(TDSPin);    
  attachInterrupt(USAGEPin, addL, RISING);
  pinMode(speaker, OUTPUT);
}








void loop() 
{

  if(millis() - timeNow > interval)
    {       
      timeNow = millis();
      String usage = "{\"usage\":";
      String brckt = "}";
      String volume = String(USAGE);

      String message = usage + volume + brckt;
      Serial.println(message);
      USAGE = 0;
      delay(1000);
    }

  
  int check = getTDS(TDSPin);
  int lvl = getLevel(LEVELpin);
  int tur = getTURB(TURBPin);

  String TDS = String(check);
  String TURBIDITY = String(tur);
  String LEVEL = String(lvl);

  if(lvl >= 0.9 * HEIGHT || lvl <= 0.1 * HEIGHT || check > 200 || tur > 5)
  {
    warn();
  }
  
  String tds = "{\"tds\":";
  String turbidity = ",\"turbidity\":";
  String level = ",\"level\":";
  
  String last = "}";
  
  String data =  tds + TDS + turbidity + TURBIDITY + level + LEVEL + last;
  
 
  Serial.println(data);

   
   delay(6000);
}



void addL()
{
  USAGE = USAGE + 1;
}








int getTDS(int pin)
{
 
  int total = 0;
  for(int i = 0; i < 10;  i++)
  {
    total = total + analogRead(pin);
    delay(readDelay);
  }

  return total/10;
}


int getTURB(int pin)
{
 
  int total = 0;
  for(int i = 0; i < 10;  i++)
  {
    total = total + analogRead(pin);
    delay(readDelay);
  }

  return total/10;
}


int getLevel(int pin)
{
 
  int total = 0;
  for(int i = 0; i < 10;  i++)
  {
    total = total + analogRead(pin);
    delay(readDelay);
  }

  return total/10;
}


void warn()
{
  if(!alert)
  {
    alert = true;
    tone(speaker, 700); 
  }
  else
  {
    alert = false;
    noTone(speaker);  
  }
   
}
