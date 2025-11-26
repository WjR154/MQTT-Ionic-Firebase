// Conexão MQTT
const client = mqtt.connect("wss://mqtt-dashboard.com:8884/mqtt");

// Quando conectar
client.on("connect", () => {
  alert("MQTT conectado!");
  client.subscribe("LEDW1");
});

// Erros
client.on("error", (err) => {
  alert("Erro MQTT: " + err.message);
});

// Atualizando valor da temperatura
  client.on("message", (topic, message) => {
    document.getElementById("temp").innerText = `${message} °C`;
  });


// Publicar comandos
document.getElementById("ligar").onclick = () => {
  client.publish("LEDW2", "ON");
};

document.getElementById("desligar").onclick = () => {
  client.publish("LEDW2", "OFF");
};
