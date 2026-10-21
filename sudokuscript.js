let serie = 0;
let indicePhrase = 0;
let phrases = [
    "Bien joué !",
    "Trop forte !",
    "Tu es on Fire !",
    "Je t'aime",
    "Tu gères !",
    "WOW!"
];

let vie = 3;
let partieTerminee = false;
let ModeNotes = false;
let ModeGomme = false;
let notes = [];
let historique = [];
let caseSurlignee = null;
let chiffreChoisi = null;
let solution = [];
let grille = [];
let initiale = [];
let nombreCases = 35;
let secondes = 0;
let minuteur = null;
let chronoLance = false;

function afficherPhrase(){
    let zone = document.getElementById("phrase");
    if (serie < 2){
        zone.textContent = "";
        return;
    }
    zone.textContent = phrases[indicePhrase % phrases.length]
    zone.classList.remove("pop");
    void zone.offsetWidth;
    zone.classList.add("pop");
    indicePhrase ++
}

function afficherTemps(){
    let min = Math.floor(secondes / 60);
    let sec = secondes % 60;
    document.getElementById("chrono").textContent =
        String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}

function reinitialiserChrono(){
    clearInterval(minuteur);
    secondes = 0;
    chronoLance = false;
    afficherTemps();
}

function demarrerChrono(){
    if (chronoLance){
        return;
    }
    chronoLance = true;
    minuteur = setInterval(function(){
        secondes++;
        afficherTemps();
    }, 1000);
}

function arreterChrono(){
    clearInterval(minuteur);
}

function melanger(liste){
    for (let i= liste.length-1; i>0; i--){
        let j = Math.floor(Math.random() * (i+1));
        [liste[i],liste[j]] = [liste[j], liste[i]];
    }
    return liste
}

function resoudreAleatoire(grille){
    let vide = trouverCaseVide(grille);
    if (vide === null){
        return true;
    }
    let ligne = vide[0];
    let colonne = vide[1];

   for (let chiffre of melanger([1, 2, 3, 4, 5, 6, 7, 8, 9])){
        if (estValide(grille,ligne,colonne,chiffre)){
            grille[ligne][colonne] = chiffre
            if (resoudreAleatoire(grille)){
                return true;
            }
            grille[ligne][colonne] = 0;
        }
    }
    return false;
}

function genererGrilleComplete(){
    let g = [];
    for (let i = 0; i < 9; i++){
        g.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    resoudreAleatoire(g)
    return g;
}

function retirerCases(g, nombre){
    let retirees = 0;
    while (retirees < nombre){
        let i = Math.floor(Math.random() * 9);
        let j = Math.floor(Math.random() * 9);
        if (g[i][j] !== 0){
            g[i][j] = 0
            retirees ++
        }
    }
}

function sauvegarder(){
    let copieGrille = [];
    let copieNotes = [];
    for (let i = 0; i < 9; i++){
        copieGrille.push([...grille[i]]);
        let ligneNotes = [];
        for (let j = 0; j < 9; j++){
            ligneNotes.push([...notes[i][j]]);
        }
        copieNotes.push(ligneNotes);
    }
    historique.push({grille: copieGrille, notes: copieNotes});
}

function nettoyerNotes(ligne, colonne, chiffre){
    let debutLigne = Math.floor(ligne / 3) * 3;
    let debutColonne = Math.floor(colonne / 3) * 3;
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            let memeLigne = (i === ligne);
            let memeColonne = (j === colonne);
            let memeCarre = (Math.floor(i / 3) * 3 === debutLigne && Math.floor(j / 3) * 3 === debutColonne);
            if (memeLigne || memeColonne || memeCarre){
                notes[i][j] = notes[i][j].filter(function(n){
                    return n !== chiffre;
                });
            }
        }
    }
}

function annuler(){
    let boutton = document.getElementById("boutonAnnuler")
    boutton.addEventListener("click",function(){
        if (partieTerminee){
            return
        }
        if (historique.length === 0) {
            return 
        }
        let photo = historique.pop()
        grille = photo.grille
        notes = photo.notes
        caseSurlignee = null;
        afficherGrille(grille)
}
)
}



function Notes(){
    let bouton = document.getElementById("boutonNotes");
    bouton.addEventListener("click", function(){
        ModeNotes = !ModeNotes;
        bouton.classList.toggle("actif");
        if (ModeNotes){
            ModeGomme = false;
            document.getElementById("boutonGomme").classList.remove("actif");
        }
    });
}

function Gomme(){
    let bouton = document.getElementById("boutonGomme");
    bouton.addEventListener("click", function(){
        ModeGomme = !ModeGomme;
        bouton.classList.toggle("actif");
        if (ModeGomme){
            ModeNotes = false;
            document.getElementById("boutonNotes").classList.remove("actif");
        }
    });
}

function afficherVies(){
    let zone = document.getElementById("vies");
    zone.textContent = "❤️".repeat(vie) + "💔".repeat(3-vie);
}

function perdre(){
    partieTerminee = true;
    let m = document.getElementById("message")
    m.textContent = "Perdu :("
    m.className = "perdu";
    arreterChrono()

}

function gagner(){
    partieTerminee = true;
    let m = document.getElementById("message")
    m.textContent = "Gagné Wouhou"
    m.className = "gagne";
    arreterChrono()
}

function grilleTerminee(grille){
    for (let i=0; i<grille.length;i++){
        for (let j=0; j< 9; j++){
            if(grille[i][j] !== solution[i][j]){
                return false
            }
        }
    }
    return true
}

function chiffreDansLigne(grille, numLigne, chiffre){
    let ligne = grille[numLigne]
    for (let element of ligne){
        if (element === chiffre){ 
            return true;
        }
    }
    return false;
}

function chiffreDansColonne(grille, numColonne, chiffre){
    for(let i=0; i<grille.length; i++){
        if(grille[i][numColonne] === chiffre){
            return true;
        }
    }
    return false;
}

function chiffreDansCarre(grille, numLigne, numColonne, chiffre){
    let debutLigne = Math.floor(numLigne/3)*3;
    let debutColonne = Math.floor(numColonne/3)*3;
    
    for (let i = 0; i<3; i++){
        for(let j =0; j<3; j++){
            if (grille[debutLigne+i][debutColonne+j] === chiffre){
                return true;
            }
        }
    }
    return false;

}

function estValide(grille, numLigne, numColonne, chiffre){
    let ligne = chiffreDansLigne(grille, numLigne, chiffre);
    let colonne = chiffreDansColonne(grille, numColonne, chiffre)
    let carre = chiffreDansCarre(grille, numLigne, numColonne,chiffre)
    return !ligne && !colonne && !carre;
}

function trouverCaseVide(grille){
    for (let ligne=0; ligne < 9; ligne++){
        for (let colonne=0; colonne < 9; colonne++){
            if(grille[ligne][colonne] === 0){
                return [ligne,colonne];
            }
        }
    }
    return null;
}

function resoudre(grille){
    let vide = trouverCaseVide(grille);
    if (vide === null){
        return true;
    }
    let ligne = vide[0];
    let colonne = vide[1];

    for (let chiffre = 1; chiffre <= 9; chiffre++){
        if (estValide(grille,ligne,colonne,chiffre)){
            grille[ligne][colonne] = chiffre
            if(resoudre(grille)){
                return true;
            }
            grille[ligne][colonne] = 0;
        }
    }
    return false;
}

function afficherGrille(grille){
    let zone = document.getElementById("grille");
    zone.innerHTML = "";
    for (let ligne=0; ligne< grille.length; ligne++){
        for (let colonne=0; colonne < 9; colonne++){
            let div = document.createElement("div");
            div.className = "case";
            if (initiale[ligne][colonne] !== 0){
                div.classList.add("donnee");
            }
            if (colonne % 3 ===2 && colonne !==8){
                div.classList.add("bord-droite");
            }
            if (ligne % 3 === 2 && ligne !== 8 ){
                div.classList.add("bord-bas")
            }
            if (caseSurlignee !== null){
                let l = caseSurlignee[0];
                let c = caseSurlignee[1];
                if (ligne === l || colonne === c){
                    div.classList.add("zone");
                }
                if (grille[ligne][colonne] !== 0 && grille[ligne][colonne] === grille[l][c]){
                    div.classList.add("meme");
                }
            }
            if (grille[ligne][colonne] !== 0){
                div.textContent = grille[ligne][colonne];
                if (grille[ligne][colonne] !== solution[ligne][colonne]){
                    div.classList.add("faux");
                }
            } else if (notes[ligne][colonne].length > 0){
                let divNotes = document.createElement("div");
                divNotes.className = "notes";
                for (let n = 1; n <= 9; n++){
                    let span = document.createElement("span");
                    if (notes[ligne][colonne].includes(n)){
                        span.textContent = n;
                        if (n === chiffreChoisi){
                            span.classList.add("note-choisie")
                        }
                    }
                    divNotes.appendChild(span);
                }
                div.appendChild(divNotes);
            }
            div.addEventListener("click", function(){
                if (partieTerminee){
                    return
                }
                if (grille[ligne][colonne] !== 0 && grille[ligne][colonne] === solution[ligne][colonne]){
                    if (caseSurlignee !== null && caseSurlignee[0] === ligne && caseSurlignee[1] === colonne){
                        caseSurlignee = null;
                    } else {
                        caseSurlignee = [ligne, colonne];
                    }
                    afficherGrille(grille);
                    return;
                }
                if (initiale[ligne][colonne] !== 0){
                    return
                }
                if (ModeGomme){
                    sauvegarder()
                    notes[ligne][colonne] = [];
                    afficherGrille(grille);
                    return;
                }
                if (chiffreChoisi == null){
                    return
                }
                if (ModeNotes){
                    if (grille[ligne][colonne] !== 0){
                        return
                    }
                    sauvegarder()
                    demarrerChrono();
                    if (notes[ligne][colonne].includes(chiffreChoisi)){
                        notes[ligne][colonne] = notes[ligne][colonne].filter(function(n){
                            return n !== chiffreChoisi;
                        });
                    }else {
                    notes[ligne][colonne].push(chiffreChoisi);
                    }
                    afficherGrille(grille);
                    return
                }
                if (grille[ligne][colonne] === solution[ligne][colonne]){
                    return
                }
                if (grille[ligne][colonne] === chiffreChoisi){
                    sauvegarder()
                    grille[ligne][colonne] = 0;
                    afficherGrille(grille);
                    return;
                }
                sauvegarder()
                demarrerChrono();
                notes[ligne][colonne] = [];
                grille[ligne][colonne] = chiffreChoisi;
                if (chiffreChoisi !== solution[ligne][colonne]){
                    vie--;
                    let zoneGrille  = document.getElementById("grille");
                    zoneGrille.classList.add("tremble")
                    setTimeout(function(){
                        zoneGrille .classList.remove("tremble")
                    }, 400);
                    if (vie === 0){
                        perdre();
                    }
                    serie = 0;
                    afficherPhrase()
                    afficherVies();
                } else {
                    nettoyerNotes(ligne, colonne, chiffreChoisi);
                    serie++;
                    afficherPhrase()
                }
                afficherGrille(grille);
                if (grilleTerminee(grille)){
                    gagner();
                }
            });
            zone.appendChild(div);
        }
    }
}

function afficherPalette(){
    let zonechiffre = document.getElementById("palettechiffre")
    zonechiffre.innerHTML = "";
    for (let chiffre=1; chiffre <=9; chiffre++){
        let div = document.createElement("div");
        div.className = "chiffre";
        div.textContent = chiffre;
        div.addEventListener("click", function(){
            if (chiffreChoisi === chiffre){
                div.classList.remove("choisi");
                chiffreChoisi = null;
                afficherGrille(grille);
                return;
            }
            let liste = document.querySelectorAll(".chiffre");
            for (let element of liste){
                element.classList.remove("choisi");
            }
            div.classList.add("choisi");
            chiffreChoisi = chiffre;
            afficherGrille(grille);
        });
        zonechiffre.appendChild(div)
    }
}


function nouvellePartie(nombreCases){
    vie = 3;
    partieTerminee = false;
    ModeNotes = false;
    ModeGomme = false;
    chiffreChoisi = null;
    caseSurlignee = null;
    historique = [];
    let m = document.getElementById("message");
    m.textContent = "";
    m.className = "";
    document.getElementById("boutonGomme").classList.remove("actif");
    document.getElementById("boutonNotes").classList.remove("actif");
    notes = []
    for (let i =0; i < 9 ; i++){
    let ligneNotes = [];
        for (let j = 0; j <9 ; j++){
            ligneNotes.push([]);
        }
        notes.push(ligneNotes);
    }
    solution = genererGrilleComplete();
    grille = [];
    initiale = [];
    for (let ligne of solution){
        grille.push([...ligne]);
    }
    retirerCases(grille, nombreCases);
    for (let ligne of grille){
        initiale.push([...ligne]);
    }
    afficherVies();
    afficherPalette();
    afficherGrille(grille);
    reinitialiserChrono();
    serie = 0;
    indicePhrase = 0;
    afficherPhrase()
}

function Niveaux(){
    let facile = document.getElementById("boutonFacile");
    let moyen = document.getElementById("boutonMoyen");
    let difficile = document.getElementById("boutonDifficile");
    let tous = [facile, moyen, difficile];

    facile.addEventListener("click", function(){
        nombreCases = 35;
        for (let b of tous){
            b.classList.remove("niveau-actif");
        }
        facile.classList.add("niveau-actif");
        nouvellePartie(nombreCases);
    });
    moyen.addEventListener("click", function(){
        nombreCases = 45;
        for (let b of tous){
            b.classList.remove("niveau-actif");
        }
        moyen.classList.add("niveau-actif");
        nouvellePartie(nombreCases);
    });
    difficile.addEventListener("click", function(){
        nombreCases = 52;
        for (let b of tous){
            b.classList.remove("niveau-actif");
        }
        difficile.classList.add("niveau-actif");
        nouvellePartie(nombreCases);
    });

    facile.classList.add("niveau-actif");   
}

function Nouvelle(){
    let bouton = document.getElementById("boutonNouvelle");
    bouton.addEventListener("click", function(){
        nouvellePartie(nombreCases);
    });
}


nouvellePartie(nombreCases);
Notes();
Gomme();
annuler();
Nouvelle();
Niveaux();