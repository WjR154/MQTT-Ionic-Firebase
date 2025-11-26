#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Wokwi-GUEST";      
const char* password = "";  

// Broker MQTT
const char* mqtt_broker = "mqtt-dashboard.com";
const uint16_t mqtt_port = 1883; 
const char* mqtt_client_id = "clientId-mH9JvUsb4P"; 
const char* mqtt_topic_publish = "LEDW1";
const char* mqtt_topic_subscribe = "LEDW2";

float ultimaTemperaturaEnviada = -999.0;

int pinoSaida2 = 2;   // LED
int pinoSensor = 34;  

const float BETA = 3950;

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  Serial.print("Conectando-se a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado!");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Tentando conexão MQTT...");
    
    if (client.connect(mqtt_client_id)) {
      Serial.println("Conectado!");
      client.subscribe(mqtt_topic_subscribe);
      Serial.print("Inscrito no tópico: ");
      Serial.println(mqtt_topic_subscribe);
    } else {
      Serial.print("Falhou, rc=");
      Serial.println(client.state());
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(2000);

  setup_wifi();
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);

  pinMode(pinoSaida2, OUTPUT);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }

  client.loop();

  // ---- SENSOR ----
  delay(2000);
  int analogValue = analogRead(pinoSensor);
  float celsius = 1 / (log(1 / (4095.0 / analogValue - 1)) / BETA + 1.0 / 298.15) - 273.15;

  float temperaturaAtual = round(celsius * 10) / 10;

  if (temperaturaAtual != ultimaTemperaturaEnviada) {
    char payload[10]; 
    dtostrf(temperaturaAtual, 4, 1, payload);

    client.publish(mqtt_topic_publish, payload);
    Serial.print("Publicado: ");
    Serial.println(payload);

    ultimaTemperaturaEnviada = temperaturaAtual;
  }
}

// ---- CALLBACK MQTT ----
void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Recebido no tópico: ");
  Serial.println(topic);

  Serial.print("Mensagem: ");
  String msg = "";
  for (int i = 0; i < length; i++) {
    msg += (char)message[i];
  }
  Serial.println(msg);

  if (strcmp(topic, "LEDW2") == 0) {
    if (msg == "ON") {
      digitalWrite(pinoSaida2, HIGH);
    } else if (msg == "OFF") {
      digitalWrite(pinoSaida2, LOW);
    }
  }
}
