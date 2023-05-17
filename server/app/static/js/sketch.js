let data;

let date;
let temperature;
let humidite;
let luminosite;
let vent;
let volets;
let stores;

let nuages = [];
let gouttes = [];
let flocons = [];

const div = document.getElementById("affichage_maison");

class Nuage {
  constructor(x,y,taille) {
    this.x = x;
    this.y = y;
    this.taille = taille;
  }

  afficher() {
    fill(255);
    stroke(0);
    ellipse(this.x,this.y,this.taille,this.taille/2);
  }

  deplacer() {
    this.x += vent/100;
  }
}

class Goutte {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.vitesse = random(5,10);
  }

  afficher() {
    stroke(150);
    line(this.x,this.y,this.x,this.y+10);
  }

  tomber() {
    this.y += this.vitesse;
  }
}

class Flocon {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.vitesse = random(1,4);
  }

  afficher() {
    stroke(255);
    point(this.x,this.y);
  }

  tomber() {
    this.y += this.vitesse;
  }
}

function setup() {
  var canvas = createCanvas(div.clientWidth,div.clientHeight);
  canvas.parent('affichage_maison');
}

function windowResized() { //quand on modifie la taille de la fenêtre, on va adapter la taille du canvas
  resizeCanvas(div.clientWidth,div.clientHeight);
}

function draw() {
  strokeWeight(width/192); //on définit l'épaisseur des contours
  stroke(0); //on définit la couleur des contours
	
  let r = map(luminosite,0,100,0,119); //couleur RGB du ciel
  let g = map(luminosite,0,100,0,181);
  let b = map(luminosite,0,100,0,254);
  
  if (random() < luminosite/200) {
    let taille = random(width/48,width/8);
    let x = -taille;
    let y = random(2*height/3);
    let nuage = new Nuage(x,y,taille);
    nuages.push(nuage);
  }
  
  for (var i = 0;i < nuages.length;i++) {
    if (nuages[i].x > width+nuages[i].taille) {
      nuages.splice(i,1);
    }
  }
  
  dessiner_ciel(r,g,b); //on dessine le ciel et les nuages

  fill(0,150,0); //on définit la couleur de remplissage
  rect(0,2*height/3,width,height/3); //on dessine l'herbe
  
  fill(100);
  rect(19*width/40,9*height/10,width/20,height/10); //on dessine le chemin menant à la maison

  dessiner_maison(width/2,3*height/5,width/3); //on dessine la maison et les barrières
  dessiner_pluie(); //on dessine la pluie ou la neige si les conditions sont remplies
}

function dessiner_ciel(r,g,b) {
  fill(r,g,b);
  rect(0,0,width,2*height/3); //on dessine le ciel
  
  for (var i = 0;i < nuages.length;i++) {
    nuages[i].afficher(); //on affiche chaque nuage
    nuages[i].deplacer(); //on déplace chaque nuage
  }
}

function dessiner_maison(x,y,taille) {
  noStroke(); //on ne trace pas de contours
  fill('rgb(242,236,228)');
  rect(x-taille/2,y,taille,taille/2); //on dessine la façade de la maison
  triangle(x-taille/2,y+1,x+taille/2,y+1,x,y-taille/3);
  
  stroke(0);
  line(x-11*taille/20,y+taille/40+2,x,y-taille/3-1); //on dessine le toit de la maison
  line(x,y-taille/3-1,x+11*taille/20,y+taille/40+2);
  
  line(x-taille/2,y,x-taille/2,y+taille/2); //on dessine les contours de la maison
  line(x-taille/2,y+taille/2,x+taille/2,y+taille/2);
  line(x+taille/2,y,x+taille/2,y+taille/2);
  
  noStroke();
  fill(0);
  rect(x-taille/16,y+taille/4,taille/8,taille/4,10,10,0,0); //on dessine la porte
  fill('rgb(255,215,0)');
  rect(x+taille/64,y+3*taille/8,taille/32,taille/128); //on dessine la poignée

  stroke(0);
  line(x+taille/2,y+3*taille/8,width,y+3*taille/8); //on dessine les barrières à droite de la maison
  line(x+taille/2,y+7*taille/16,width,y+7*taille/16);
  for (var k = 0;k < 4;k++) {
	line(x+taille/2+k*width/10,y+taille/2,x+taille/2+k*width/10,y+5*taille/16);
  }
  
  line(0,y+3*taille/8,x-taille/2,y+3*taille/8); //on dessine les barrières à gauche de la maison
  line(0,y+7*taille/16,x-taille/2,y+7*taille/16);
  for (var l = 1;l < 4;l++) {
	line(x-taille/2-l*width/10,y+taille/2,x-taille/2-l*width/10,y+5*taille/16);
  }
  
  if (stores == true) { //si les stores sont fermés, on les affiche
	fill(255);
	for (var j = 0;j < 8;j++) {
	  rect(x-13*taille/32,y+taille/4+j*taille/32,taille/4,taille/32);
	}
  } else { //sinon on affiche la baie vitrée
    fill(200);
    rect(x-13*taille/32,y+taille/4,taille/8,taille/4);
    rect(x-9*taille/32,y+taille/4,taille/8,taille/4);
  }
  
  fill(0);
  if (volets == true) { //si les volets sont fermés, on les affiche
    rect(x+3*taille/16,y+taille/4,taille/16,taille/8);
	rect(x+taille/4,y+taille/4,taille/16,taille/8);
  } else { //sinon on affiche la fenêtre
    rect(x+taille/8,y+taille/4,taille/16,taille/8);
	rect(x+5*taille/16,y+taille/4,taille/16,taille/8);
	fill(200);
	rect(x+3*taille/16,y+taille/4,taille/16,taille/8);
    rect(x+taille/4,y+taille/4,taille/16,taille/8);
  }
}

function dessiner_pluie() {
  if (humidite >= 90) { //on affiche de la pluie que si le taux d'humidité est supérieur ou égal à 90%
	if (temperature > 0) { //il faut aussi que la température soit positive
      for (var i = 0;i < gouttes.length;i++) {
        gouttes[i].afficher(); //on affiche et on fait tomber chaque goutte
        gouttes[i].tomber();
      }

      if (random() < humidite/200) { //selon le taux d'humidité, on va faire apparaître de nouvelles gouttes de pluie
        let x = random(width);
        let y = 0;
        let goutte = new Goutte(x,y);
        gouttes.push(goutte);
      }
	} else { //si la température est négative, même principe mais pour la neige
	  for (var j = 0;j < flocons.length;j++) {
        flocons[j].afficher();
        flocons[j].tomber();
      }

      if (random() < humidite/200) {
        let x = random(width);
        let y = 0;
        let flocon = new Flocon(x,y);
        flocons.push(flocon);
      }
	}
  }
}
