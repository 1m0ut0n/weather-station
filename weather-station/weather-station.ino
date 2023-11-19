#include <Servo.h>
#include <DHT.h>
#include "paj7620.h"
#include <Wire.h>
#include <rgb_lcd.h>

// == ETHERNET
#include <SPI.h>
#include <Ethernet.h>

byte mac[] = {0x90,0xA2,0xDA,0x0F,0x42,0x1D};

EthernetClient client;

int HTTP_PORT = 80;
String HTTP_METHOD = "POST";
char   HOST_NAME[] = "172.27.161.75";
String PATH_NAME = "/envoi";
String CONTENT_TYPE = "application/json";
String queryString ;

bool connecte;

String retourServeur ;

// === LCD
rgb_lcd lcd;
bool afficher = 0 ; 
int pageactu = 0 ;
unsigned long tps_affi = millis();

// === SERVO
Servo storeServo;  // Servo pour le store
Servo voletServo;  // Servo pour le volet

const int interrupteurStorePin = 6;  // Pin de l'interrupteur du store
const int interrupteurVoletPin = 7;  // Pin de l'interrupteur du volet

const int storeOpenAngle = 0;     // Angle d'ouverture du store
const int storeClosedAngle = 90;  // Angle de fermeture du store
const int voletOpenAngle = 0;     // Angle d'ouverture du volet
const int voletClosedAngle = 90;  // Angle de fermeture du volet

int storeState = 0;  // État du store (0 = fermé, 1 = ouvert)
int voletState = 0;  // État du volet (0 = fermé, 1 = ouvert)

int angleVolet = 90 ;
int angleStore = 90 ;

float temperature ; 
float humidity ;
float light;
float windSpeed;


// === ANEMO
const int anemometerPin = 3;  // Pin digital de l'anémomètre
volatile unsigned long lastTime = 0;  // Temps du dernier tour de l'anémomètre
volatile unsigned long windCount = 0;  // Compteur des tours de l'anémomètre
const float windFactor = 1.77;  // Facteur de conversion des tours par seconde en km/h

// === HUMIDITY & TEMP
#define DHTPIN 2     // Définir la broche connectée au signal du capteur
#define DHTTYPE DHT22    // Définir le type de capteur DHT qu'on utilise
DHT dht(DHTPIN, DHTTYPE);

void setup() {

  // Affectation des ports
  pinMode(interrupteurStorePin, INPUT);
  pinMode(interrupteurVoletPin, INPUT);
  pinMode(anemometerPin, INPUT_PULLUP);
  storeServo.attach(4);   // Pin pour le servo du store
  voletServo.attach(8);  // Pin pour le servo du volet

  storeServo.write(storeClosedAngle);  // Initialiser le store à l'état fermé
  voletServo.write(voletClosedAngle);  // Initialiser le volet à l'état fermé
  Serial.begin(9600);
  dht.begin(); // Initialisation du capteur d'humidité et de température

  //Initialisation de l'écran
  lcd.begin(16, 2);  // Initialisation de l'écran avec 16 colonnes et 2 lignes
  lcd.setRGB(0, 0,0);  // Réglage de la couleur d'arrière-plan en rouge
  lcd.setCursor(0, 0);  // Positionnement du curseur en haut à gauche
  lcd.setRGB(255, 0, 255);
  lcd.print(" Station Meteo");  // Écriture du texte sur l'écran
  lcd.setCursor(0, 1);  // Positionnement du curseur en haut à gauche
  lcd.print("   Bienvenue");

  //Initiatlisation de l'écran
  paj7620Init();


  // === ETHERNET 

  connecte = false;
  while (!Serial) {
    ;
  }
  Serial.println("Initialisation Ethernet avec le DHCP:");
  if (Ethernet.begin(mac) == 0) {
    Serial.println("La configuration Ethernet utilisant le DHCP a échoué.");
    if (Ethernet.hardwareStatus() == EthernetNoHardware) {
      Serial.println("Le shield Ethernet n'est pas détecté. Désolé, ne peut pas fonctionner sans le matériel. :(");
    } else if (Ethernet.linkStatus() == LinkOFF) {
      Serial.println("Le câble Ethernet n'est pas connecté.");
    }
    while (true) {
      delay(1);
    }
  }

  connecte = true;
  Serial.print("Mon adresse IP: ");
  Serial.println(Ethernet.localIP());


}





void loop() {


  // === STORES & VOLETS

  // Vérifier l'état de l'interrupteur du store
  if (digitalRead(interrupteurStorePin) == LOW) {
    storeState = (storeState == 1) ? 0 : 1 ;  // Le store est ouvert
    while(digitalRead(interrupteurStorePin) == LOW);
    delay(40);
  } 

  // Vérifier l'état de l'interrupteur du volet
  if (digitalRead(interrupteurVoletPin) == LOW) {
    voletState = (voletState == 1) ? 0 : 1 ;  // Le volet est ouvert 
    while(digitalRead(interrupteurVoletPin) == LOW);
    delay(40);
  }

  // Contrôler les servomoteurs en fonction de l'état des interrupteurs
  if (storeState == 0) {
    closeStore();
  } else {
    openStore();
  }

  if (voletState == 0) {
    closeVolet();
  } else {
    openVolet();
  }
  

  if (millis() - lastTime >= 1000) {

    // === ANEMO
    detachInterrupt(digitalPinToInterrupt(anemometerPin));  // Détacher l'interruption pendant le calcul
    windSpeed = calculateWindSpeed();
    Serial.print("Vitesse du vent : ");
    Serial.print(windSpeed);
    Serial.print(" km/h\t");
    attachInterrupt(digitalPinToInterrupt(anemometerPin), countWind, FALLING);  // Réattacher l'interruption

    // LIGHT
    byte value = analogRead(A1)>>2;
    light = value/195.0*100;
    // affichage des données lues sur le moniteur série
    Serial.print("Luminosité : ");
    Serial.print(light);
    Serial.print(" %\t");

    // HUMIDITY & TEMPERATURE
    humidity = dht.readHumidity(); // lecture de l'humidité
    temperature = dht.readTemperature(); // lecture de la température en degré Celsius
    // affichage des données lues sur le moniteur série
    Serial.print("Humidité : ");
    Serial.print(humidity);
    Serial.print(" %\t");
    Serial.print("Température : ");
    Serial.print(temperature);
    Serial.print(" °C\t");

    // Volets et Stores 
    angleVolet = voletServo.read();
    angleStore = storeServo.read();
    Serial.println("Volets : ");
    if(angleVolet >= 85){Serial.print("Fermé  ");}
    else{Serial.print("Ouvert");}
    Serial.print(" \t");
    Serial.print("Stores : ");
    if(angleStore >= 85){Serial.print("Fermé");}
    else{Serial.print("Ouvert");}
    Serial.println(" \t");

    // === ETHERNET
    queryString = "{\"temperature\":"+ String(temperature) + ", \"humidity\":"+ String(humidity) + ", \"light\":"+ String(light) + ", \"wind\":"+ String(windSpeed) + ", \"shutterstate\":"+ String(voletState) + ", \"blindstate\":"+ String(storeState) + "}";
    retourServeur = "";
    envoyerServ();
    
    lastTime = millis();
  }

    if(retourServeur != ""){ 
      voletState = (char)retourServeur[0] - '0';
      storeState = (char)retourServeur[2] - '0';
    }
  // === ETHERNET

  connecte = false;
  switch (Ethernet.maintain()) {
    case 1:
      Serial.println("Erreur: renouvellement échoué");
      break;
    case 2:
      Serial.println("Renouvellement réussi");
      Serial.print("Mon adresse IP: ");
      Serial.println(Ethernet.localIP());
      connecte = true;
      break;
    case 3:
      Serial.println("Erreur: liaison échouée");
      break;
    case 4:
      Serial.println("Liaison réussie");
      Serial.print("Mon adresse IP: ");
      Serial.println(Ethernet.localIP());
      connecte = true;
      break;
    default:
      break;
  }


  // === AFFICHAGE LCD & CAPTEUR DE MOUVEMENTS 

  uint8_t data = 0;  // Read Bank_0_Reg_0x43/0x44 for gesture result.
  paj7620ReadReg(0x43, 1, &data);  // When different gestures be detected, the variable 'data' will be set to different values by paj7620ReadReg(0x43, 1, &data).
  
  if (data == GES_RIGHT_FLAG){
      Serial.println("Droite");
      if(pageactu<=2){pageactu+=1;}
      else{pageactu=0;}
      afficher = 1 ;
      }


  else if (data == GES_LEFT_FLAG){
    Serial.println("Gauche");
    if(pageactu>=1){pageactu-=1;}
    else{pageactu=3;}
    afficher = 1 ;
    }


   else if (data == GES_UP_FLAG){
    Serial.println("Haut");
    if(pageactu<4){pageactu=4;}
    else if(pageactu==4){pageactu=5;}
    else{pageactu=0;}
    afficher = 1 ;
    }


   else if (data == GES_DOWN_FLAG){
    Serial.println("Bas");
    if(pageactu<4){pageactu=5;}
    else if(pageactu==5){pageactu=4;}
    else{pageactu=0;}
    afficher = 1 ;
    }

  if(afficher == 1 || (millis()-tps_affi>=1500)){
    switch(pageactu){
      case 0 :
        lcd.clear();
        lcd.setRGB(255, 0,0 );

        lcd.setCursor(0,0);
        lcd.print("Temperature : ");
        lcd.setCursor(0,1);
        lcd.print("  " + String(temperature) + " C");
        afficher = 0 ;
        break;
      case 1 :
        lcd.clear();
        lcd.setRGB(0,102,204);

        lcd.setCursor(0,0);
        lcd.print("Humidite : ");
        lcd.setCursor(0,1);
        lcd.print("  " + String(humidity) + " %");
        afficher = 0 ;
        break;
      case 2 :
        lcd.clear();
        lcd.setRGB(255,255,255);

        lcd.setCursor(0,0);
        lcd.print("Vent : ");
        lcd.setCursor(0,1);
        lcd.print("  " + String(windSpeed) + " km/h");
        afficher = 0 ;
        break;
      case 3 :
        lcd.clear();
        lcd.setRGB(255,255,0);

        lcd.setCursor(0,0);
        lcd.print("Luminosite : ");
        lcd.setCursor(0,1);
        lcd.print("  " + String(light) + " %");
        afficher = 0 ;
        break;
      case 4 :
      
        lcd.clear();
        lcd.setRGB(160,160,160);
        lcd.setCursor(0,0);
        if (angleVolet < 85){
          lcd.print("Volets ouverts");
        }else{lcd.print("Volets fermes");}
        lcd.setCursor(0,1);
        if (angleStore < 85){
          lcd.print("Stores ouverts");
        }else{lcd.print("Stores fermes");}
        afficher = 0 ;
        break;
      case 5 :
        lcd.clear();
        lcd.setRGB(0,255,0);

        lcd.setCursor(0,0);
        lcd.print("Adresse IP :");
        lcd.setCursor(0,1);
        lcd.print(Ethernet.localIP());
        /*if (connecte) lcd.print(Ethernet.localIP());
        else lcd.print("Deconnecte"); */
        afficher = 0 ;
        break;
    }
    tps_affi=millis();
  }


  
}


// === STORES ET VOLETS

void openStore() {
  storeServo.write(storeOpenAngle);
}

void closeStore() {
  storeServo.write(storeClosedAngle);
}

void openVolet() {
  voletServo.write(voletOpenAngle);
}

void closeVolet() {
  voletServo.write(voletClosedAngle);
}

// === ANEMO
void countWind() {
  windCount++;
}

float calculateWindSpeed() {
  unsigned long elapsedTime = millis() - lastTime;
  float windSpeed = (windCount / (elapsedTime / 1000.0)) * windFactor;
  windCount = 0;
  return windSpeed;
}

void envoyerServ(){
  if(client.connect(HOST_NAME, HTTP_PORT)) {
    Serial.println("Connecté au serveur");
    Serial.println(queryString);
    client.println(HTTP_METHOD + " " + PATH_NAME + " HTTP/1.1");
    client.println("Host: " + String(HOST_NAME));
    client.println("Content-Type: " + String(CONTENT_TYPE));
    client.println("Content-Length: " + String(queryString.length()));
    client.println("Connection: close");
    client.println();
    client.println(queryString);
    while(client.connected()) {
      if(client.available()){
        char c = client.read();
        retourServeur += c ;
        Serial.print(c);
      }
    }
    int indexaccolade = retourServeur.indexOf("[");
    if (indexaccolade != -1){retourServeur = retourServeur.substring(indexaccolade + 1);}
    else {retourServeur = "";}
    client.stop();
    Serial.println();
    Serial.println("Déconnecté.");
  } else {
    Serial.println("La connexion a échoué.");
  }
}
