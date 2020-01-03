# num-multipictures
Widget pour info numériques à images variables.

Widget permettant l’affichage d’info numérique avec images variables superposées au fond pour boussole, manche à air, baromètre, …

Le fond et les images superposées sont paramétrables.

Le bandeau de bas de vignette évolue également en fonction de la valeur et des paramètres saisis, il y a 3 couleurs différentes paramétrables en fonction de la valeur de la commande. Pour changer les paramétres par défaut de ces bandeaux et couleurs de texte des bandeaux, vous devrez utiliser les standards HTML de nommage de couleur.

L’installation préalable du widget Multi-action-Defaut de @JAG est un prérequis.

Les images de fond, standards ou optionnels, doivent se trouver dans le répertoire “data/customTemplates/dashboard/cmd.action.other.Multi-action-Defaut/fond” .
Les images superposées doivent se trouver dans le répertoire “data/customTemplates/dashboard/cmd.action.other.Multi-action-Defaut/” auquel il convient d’ajouter le nom du dossier spécifique.
Si les images requises ne s’y trouvent pas, vous devrez les transférer par Jeexplorer.

Dans ce widget, le choix de l’image qui se superpose au fond se fait en fonction d’un calcul dépendant de valeurs “min” et “max” et d’un nombre d’images “picture” à définir.

Ce widget bascule automatiquement du thème sombre au clair et adapte le fond du widget en conséquence.

Deux types d’info numériques sont possibles, les valeurs bornées (mesure angulaire d’une boussole par exemple), les valeurs non bornées (vitesse du vent ou autres).

Les images à afficher devront s’appeler icon_x.png où x=1 à n, avec n=picture.

Voici les paramètres à prendre en compte pour l’utilisation de ce widget.

    - numtype : (obligatoire), définit le type de valeurs à prendre en compte. Valeurs bornées “opened”, valeurs non bornées “closed”.
    - picture : (obligatoire) nombre d’images potentielles à afficher. Si picture=1 l’image sera la même quelque soit la valeur affichée, si picture=2 le changement d’image se fera en fonction de la valeur médiane entre min et max, si picture > 2 la répartition se fait en fonction de la plage min-max.
    - min : (obligatoire), valeur minimale à prendre en compte (affichage icon_1.png).
    - max : (obligatoire) > min, valeur maximale à prendre en compte (affichage image_n.png (n=picture)).
    - icon : (obligatoire), nom de l’image, pour “image_2.png”, passer “image”).
    - folder : (obligatoire), nom du dossier de l’image (vent, eau, …).
    - colbanmin : (optionnel), couleur du bandeau si la valeur de la commande <= min - Par défaut "aqua".
    - colbanmax : (optionnel), couleur du bandeau si la valeur de la commande >= max - Par défaut "red".
    - colbanin : (optionnel), couleur du bandeau si la valeur de la commande entre min et max - Par défaut "lime".
    - coltxtbnmin : (optionnel), couleur du texte du bandeau si la valeur de la commande <= min - Par défaut "black".
    - coltxtbnmax : (optionnel), couleur du texte du bandeau si la valeur de la commande >= max - Par défaut "black".
    - coltxtbnin : (optionnel), couleur du texte du bandeau si la valeur de la commande entre min et max - Par défaut "black".
    - blinkmin : (optionnel), clignotement du bandeau si opened et <= min.
    - blinkmax : (optionnel), clignotement du bandeau si opened et >= max.
    - theme : (optionnel), nom du thème de fond à afficher. Les fichiers de fond devront alors s’appeler fo_bkg_nom_dark.png et fo_bkg_nom_light.png. Si le paramètre est absent, les thèmes par défaut seront affichés.

Si l’un des paramètres obligatoires est manquant ou erroné, le widget vous indiquera celui à corriger sauf dans le cas d'une image manquante. Dans ce cas l'image sera vide.
