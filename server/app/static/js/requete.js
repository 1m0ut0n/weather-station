const info = document.getElementById("info");
const edate = document.getElementById("date");
const etemperature = document.getElementById("temperature");
const ehumidite = document.getElementById("humidite");
const eluminosite = document.getElementById("luminosite");
const event = document.getElementById("vent");
const evolets = document.getElementById("volets");
const bouton_volets = document.getElementById("bouton_volets");
const estores = document.getElementById("stores");
const bouton_stores = document.getElementById("bouton_stores");

(function loop() {
  $.ajax({ //on utilise la bibliothèque ajax qui permet d'échanger des fichiers JSON avec le serveur
    url:'/maj', //on définit la nouvelle url affiliée lorsqu'on aura fait la requête
    type:"GET", //on veut poster des données sur le serveur
    success: function(donnees) { //lorsque la requête est bien passée on peut exécuter les commandes suivantes en récupérant les données renvoyées par le serveur
      data = donnees["actuel"];
      date = data["date"];
      temperature = data["temperature"];
      humidite = data["humidity"];
      luminosite = data["light"];
      vent = data["wind"];
      volets = data["shutterstate"];
      stores = data["blindstate"];
      if (date != null) {
        update_charts(donnees['db']);
        etemperature.innerHTML = Math.round(temperature*10)/10;
        ehumidite.innerHTML = Math.round(humidite*10)/10;
        eluminosite.innerHTML = Math.round(luminosite*10)/10;
        event.innerHTML = Math.round(vent*10)/10;
        if (volets == true) {
          evolets.innerHTML = "Fermés";
          bouton_volets.innerHTML = "Ouvrir";
        } else {
          evolets.innerHTML = "Ouverts";
          bouton_volets.innerHTML = "Fermer";
        }
        if (stores == true) {
          estores.innerHTML = "Fermés";
          bouton_stores.innerHTML = "Ouvrir";
        } else {
          estores.innerHTML = "Ouverts";
          bouton_stores.innerHTML = "Fermer";
        }
      }
    }
  });
  setTimeout(loop,1000);
})();

(function maj_temps() {
  if (date == null) {
    info.innerHTML = "Pas de données";
  } else {
    info.innerHTML = "Mis à jour à "+date;
  }
  setTimeout(maj_temps,1000);
})();

function change_volets() {
  bouton_volets.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  volets = !volets
  var s = JSON.stringify({"date" : date,"temperature" : temperature,"humidity" : humidite,"light" : luminosite,"wind" : vent,"shutterstate" : volets,"blindstate" : stores}); 
  $.ajax({
    url:'/volets',
    type:"POST",
    contentType: "application/json;charset=UTF-8", //on veut transmettre un fichier JSON
    data: JSON.stringify(s)
  });
}

function change_stores() {
  boutons_stores.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  stores = !stores
  var x = JSON.stringify({"date" : date,"temperature" : temperature,"humidity" : humidite,"light" : luminosite,"wind" : vent,"shutterstate" : volets,"blindstate" : stores}); 
  $.ajax({
    url:'/stores',
    type:"POST",
    contentType: "application/json;charset=UTF-8", //on veut transmettre un fichier JSON
    data: JSON.stringify(x)
  });
}
