// VARIABLES //
let serie = 0;
let indicePhrase = 0;
let phrases = [
    "Bien joué !",
    "Trop fort !",
    "Tu es on Fire !",
    "COOL",
    "Tu gères !",
    "WOW!",
    "Genius",
    "Trop bien !",
    "Fleur"
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
let sonActif = true;
let musique = document.getElementById("musique");
musique.volume = 0.1;
let nomsSons = ["boutton.mp3", "Faux.mp3", "place1.mp3", "gagne.mp3", "perdu.mp3",
                "gomme.mp3", "note.mp3", "chiffre.mp3", "reboot.mp3", "rebootimpossible.mp3",
                "facile.mp3", "moyen.mp3", "difficile.mp3", "nouvellepartie.mp3", "Son.mp3"];
let sons = {};
let playlist = ["musique.mp3", "musique2.mp3", "musique3.mp3", "musique4.mp3"];
let indiceMusique = Math.floor(Math.random() * playlist.length);
musique.src = playlist[indiceMusique];

// Sons  ---------------------------------------------------------//

function chargerSons(quandPret){
    let termines = 0;
    let fini = false;

    function terminer(){
        if (fini){
            return;
        }
        fini = true;
        quandPret();
    }

    function unDePlus(){
        termines++;
        document.getElementById("progression").textContent = termines + " / " + nomsSons.length;
        if (termines === nomsSons.length){
            terminer();
        }
    }

    for (let nom of nomsSons){
        let son = new Audio();
        sons[nom] = son;
        son.addEventListener("canplaythrough", unDePlus, { once: true });
        son.addEventListener("error", unDePlus, { once: true });
        son.src = nom;
        son.load();
    }

    setTimeout(terminer, 4000);
}

musique.addEventListener("ended", function(){
    let nouvelle;
    do {
        nouvelle = Math.floor(Math.random() * playlist.length);
    } while (nouvelle === indiceMusique && playlist.length > 1);
    indiceMusique = nouvelle;
    musique.src = playlist[indiceMusique];
    musique.play();
});
let musiqueActive = true;

function lancerMusique(){
    if (musiqueActive){
        musique.play().catch(function(erreur){
            console.log("Musique impossible :", erreur);
        });
    }
}

function jouerSon(nom){
    if (!sonActif){
        return;
    }
    let son = sons[nom];
    if (!son){
        son = new Audio(nom);
        sons[nom] = son;
    }
    son.volume = 0.5;
    son.currentTime = 0;
    son.play().catch(function(erreur){
        console.log("Son impossible :", nom, erreur);
    });
}

function Son(){
    let bouton = document.getElementById("boutonSon");
    bouton.addEventListener("click", function(){
        jouerSon("Son.mp3")
        sonActif = !sonActif
        if (sonActif){
            bouton.textContent = "🔈"
        } else {
            bouton.textContent = "🔇"
        }
        bouton.classList.toggle("coupe", !sonActif);
    });
}

function BoutonMusique(){
    let bouton = document.getElementById("boutonMusique");
    bouton.addEventListener("click", function(){
        jouerSon("boutton.mp3")
        musiqueActive = !musiqueActive;
        if (musiqueActive){
            bouton.textContent = "🎵";
            lancerMusique();
        } else {
            bouton.textContent = "🔕";
            musique.pause();
        }
        bouton.classList.toggle("coupe", !musiqueActive);
    });
}

//-----------------------INFOS----------------------------------//

function Niveaux(){
    let facile = document.getElementById("boutonFacile");
    let moyen = document.getElementById("boutonMoyen");
    let difficile = document.getElementById("boutonDifficile");
    let tous = [facile, moyen, difficile];

    facile.addEventListener("click", function(){
        jouerSon("facile.mp3")
        nombreCases = 35;
        for (let b of tous){
            b.classList.remove("niveau-actif");
        }
        facile.classList.add("niveau-actif");
        nouvellePartie(nombreCases);
    });
    moyen.addEventListener("click", function(){
        jouerSon("moyen.mp3")
        nombreCases = 45;
        for (let b of tous){
            b.classList.remove("niveau-actif");
        }
        moyen.classList.add("niveau-actif");
        nouvellePartie(nombreCases);
    });
    difficile.addEventListener("click", function(){
        jouerSon("difficile.mp3")
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
        jouerSon("nouvellepartie.mp3")
        nouvellePartie(nombreCases);
        
    });
}

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

function afficherVies(){
    let zone = document.getElementById("vies");
    zone.textContent = "❤️".repeat(vie) + "💔".repeat(3-vie);
}

function perdre(){
    partieTerminee = true;
    let m = document.getElementById("message")
    m.textContent = "Perdu :("
    m.className = "perdu";
    jouerSon("perdu.mp3")
    arreterChrono()

}

function gagner(){
    partieTerminee = true;
    let m = document.getElementById("message")
    m.textContent = "Gagné Wouhou"
    m.className = "gagne";
    jouerSon("gagne.mp3")
    arreterChrono()
}

//-----------------------OUTILS----------------------------------//

function annuler(){
    let boutton = document.getElementById("boutonAnnuler")
    boutton.addEventListener("click",function(){
        if (partieTerminee){
            return
        }
        if (historique.length === 0) {
            jouerSon("rebootimpossible.mp3")
            return 
        }
        let photo = historique.pop()
        jouerSon("reboot.mp3")
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
        jouerSon("boutton.mp3")
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
        jouerSon("boutton.mp3")
        ModeGomme = !ModeGomme;
        bouton.classList.toggle("actif");
        if (ModeGomme){
            ModeNotes = false;
            document.getElementById("boutonNotes").classList.remove("actif");
        }
    });
}

//-----------------------LOGIQUE----------------------------------//

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
    let positions = [];
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            positions.push([i, j]);
        }
    }
    melanger(positions);

    let retirees = 0;
    for (let pos of positions){
        if (retirees >= nombre){
            break;
        }
        let i = pos[0];
        let j = pos[1];
        let valeur = g[i][j];
        g[i][j] = 0;

        let copie = [];
        for (let ligne of g){
            copie.push([...ligne]);
        }

        if (compterSolutions(copie) === 1){
            retirees ++
        } else {
            g[i][j] = valeur;
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

function compterSolutions(grille){
    let vide = trouverCaseVide(grille);
    if (vide === null){
        return 1 ;    
    }
    let ligne = vide[0];
    let colonne = vide[1];
    let total = 0;

    for (let chiffre = 1; chiffre <= 9; chiffre++){
        if (estValide(grille, ligne, colonne, chiffre)){
            grille[ligne][colonne] = chiffre;
            total = total + compterSolutions(grille);
            grille[ligne][colonne] = 0;
            if (total >= 2){
                return total;
            }
        }
    }
    return total;
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
                    jouerSon("place1.mp3")
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
                    jouerSon("gomme.mp3")
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
                        jouerSon("gomme.mp3")
                        notes[ligne][colonne] = notes[ligne][colonne].filter(function(n){
                            return n !== chiffreChoisi;
                        });
                    }else {
                    notes[ligne][colonne].push(chiffreChoisi);
                    jouerSon("note.mp3")
                    }
                    afficherGrille(grille);
                    return
                }
                if (grille[ligne][colonne] === solution[ligne][colonne]){
                    return
                }
                if (grille[ligne][colonne] === chiffreChoisi){
                    jouerSon("place1.mp3")
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
                    jouerSon("Faux.mp3")
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
                    jouerSon("place1.mp3")
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
    majPalette();
}

// Palette chfifre -------------------------

function afficherPalette(){
    let zonechiffre = document.getElementById("palettechiffre")
    zonechiffre.innerHTML = "";
    for (let chiffre=1; chiffre <=9; chiffre++){
        let div = document.createElement("div");
        div.className = "chiffre";
        div.textContent = chiffre;
        div.addEventListener("click", function(){
            jouerSon("chiffre.mp3")
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

function majPalette(){
    let boutons = document.querySelectorAll(".chiffre");

    for (let i = 0; i < boutons.length; i++){
        let n = Number(boutons[i].textContent);
        let compteur = 0;

        for (let l = 0; l < 9; l++){
            for (let c = 0; c < 9; c++){
                if (grille[l][c] === n && grille[l][c] === solution[l][c]){
                    compteur++;
                }
            }
        }

        boutons[i].classList.toggle("fini", compteur === 9);
    }
}

// BLOQUE PRINCIPALE -----------------------------

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

//APPELS-----------------------------

nouvellePartie(nombreCases);
Notes();
Gomme();
annuler();
Nouvelle();
Niveaux();
Son();
chargerSons(function(){
    document.getElementById("texteChargement").textContent = "Prêt !";
    document.getElementById("boutonJouer").disabled = false;
});

document.getElementById("boutonJouer").addEventListener("click", function(){
    document.getElementById("chargement").classList.add("cache");
    lancerMusique();
});
BoutonMusique();

function ajuster(){
    let page = document.getElementById("page");
    page.style.zoom = 1;

    if (window.innerWidth <= 500){
        return;
    }

    let hauteur = page.offsetHeight;
    let facteur = Math.min(1, window.innerHeight / hauteur);
    page.style.zoom = facteur;
}

window.addEventListener("resize", ajuster);
window.addEventListener("load", ajuster);
document.fonts.ready.then(ajuster);
ajuster();
