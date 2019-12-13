<div style="padding:0px; margin:2px 2px; width:80px; height:80px;" class="cmd #history# container-fluid tooltips cmd-widget" data-type="info" data-version="#version#" data-eqLogic_id="#eqLogic_id#" data-subtype="numeric" data-cmd_id="#id#" data-cmd_uid="#uid#">
 	<img class="background#uid#"/>
 	<img class="banner#uid#"/>
	<img class="icon#uid#" style="transform:translate(-50%,-50%);" />
	<div class="cmdname#uid#">#name_display#</div>
	<div class="value#uid#"style=""></div>
	<div class="unite#uid#">#unite#</div>
	<div class="error#uid#"/>
 
	<script>
		jeedom.cmd.update['#id#'] = function(_options){
			// Récupération de srcState
			var srcState = _options.display_value;	// Valeur de l'info numérique

			// Récupération des valeurs des paramètres du widget
			var srcNumType = "#numtype#";			// Type de valeur à représenter (closed, opened, single) (obligatoire)
 			var fldIcon = ('#folder#'!='#'+'folder#') ? '#folder#' : "";
													// Dossier de l'image à superposer (obligatoire)
 			var srcIcon = ('#icon#'!='#'+'icon#') ? '#icon#' : "";
													// Image à superposer (obligatoire)
			var srcTheme = ('#theme#'!='#'+'theme#') ? '#theme#': "";
													// Thème du background s'il y a lieu (optionnel)
			var srcPicture = (is_numeric('#picture#')) ? parseFloat('#picture#') : null;
													// Nombre d'images à afficher (obligatoire)
			var srcMinVal = (is_numeric('#min#')) ? parseFloat('#min#') : null;
													// Valeur minimale de la plage de mesure à prendre en compte (obligatoire)
			var srcMaxVal = (is_numeric('#max#')) ? parseFloat('#max#') : null;       
													// Valeur maximale de la plage de mesure à prendre en compte (obligatoire)

			var fldBkg = 'data/customTemplates/dashboard/cmd.action.other.Multi-action-Defaut/fond/';
													// Dossier des images de background
			var srcMode = "light"					// Mode du background (dark ou light)
			var srcIconID = "1";						// Rang de l'image à afficher
			var srcLevelIc = 1;						// Niveau de l'image à afficher après calcul
			var srcMinLevel = 1;					// Niveau min de l'image et du bandeau (forcément 1)
			var srcField = srcMaxVal - srcMinVal;	// Plage totale de calcul de l'image de background, permet de traiter le cas des bornes négatives
			var srcStepBn = srcField/8;				// Intervalle entre 2 backgrounds différents, 8 correspond au nombre d'intervalle pour 10 backgrounds
			var srcStepIc = 1;						// Intervalle entre 2 images différentes
			var srcMaxLevelBn = 10;					// Niveau max du bandeau - 10 bandeaux
			var srcLevelBn = 1;						// Niveau du bandeau calculé
			var srcStateShift = srcState - srcMinVal;
													// State décalé en fonction du Min pour calculer l'image et le bandeau
			var srcTxtVal = "";						// Couleur des caractères de la valeur de la commande
			var srcValBanner = "";					// Couleur des caractère du bandeau
			var srcMode = "light";					// Mode du background (dark ou light)
			var srcTxtBanner = "black"				// Couleur des caractères du bandeau
			var srcErrorCode = "";					// Nom du paramètre en erreur s'il y a lieu
		
			// Validation des paramètres
			if (srcNumType != "opened" & srcNumType != "closed") {
				srcErrorCode = "numtype";
			} else if (fldIcon == null || fldIcon == "") {
				srcErrorCode = "folder";
			} else if (srcIcon == null || srcIcon == "") {
				srcErrorCode = "icon";
			} else if (srcPicture < 1 || srcPicture == null) {
				srcErrorCode = "picture";
			} else if (srcMinVal == null) {
				srcErrorCode = "min";
			} else if (srcMaxVal == null) {
				srcErrorCode = "max";
			} else if (srcMinVal >= srcMaxVal) {
				srcErrorCode = "min >= max";
			}
			
			if (srcErrorCode != "") {
				srcIcon = "error";
			} else {
				// Initialisation du nom du dossier des images
				fldIcon = 'data/customTemplates/dashboard/cmd.action.other.Multi-action-Defaut/' + fldIcon + '/';

				// Calcul en fonction du type de variable numérique "opened"-"closed" et du nombre d'images

				// Initialisation du niveau du bandeau
				srcLevelBn = Math.round(srcStateShift/srcStepBn)+1;

				if (srcPicture == "1") {			// Image unique
					srcIconID = "_1";
					if (srcState <= srcMinVal) {
						srcValBanner = srcMinLevel.toString();
					}
					else if (srcState >= srcMaxVal) {
						srcValBanner = srcMaxLevelBn.toString();
					}
					else {
						srcValBanner = srcLevelBn.toString();
					}
				}
				else if (srcPicture == 2) {			// Images doubles
					// Calcul de l'image à afficher selon la valeur médiane
					if (srcStateShift <= srcField/2) {
						srcIconID = "_1";
					} else {
						srcIconID = "_2";
					}
					if (srcState <= srcMinVal) {
						srcValBanner = srcMinLevel.toString();
					}
					else if (srcState >= srcMaxVal) {
						srcValBanner = srcMaxLevelBn.toString();
					}
					else {
						srcValBanner = srcLevelBn.toString();
					}
				} else {							// Images multiples
					// Calcul du logo à afficher
					switch (srcNumType) {
						case "opened":
							srcStepIc = srcField/(srcPicture-2);
							srcLevelIc = Math.trunc(srcStateShift/srcStepIc)+2;
							if (srcState <= srcMinVal || srcLevelIc < srcMinLevel) {
								srcIconID = '_' + srcMinLevel.toString();
								srcValBanner = srcMinLevel.toString();
							}
							else if (srcState >= srcMaxVal || srcLevelIc > srcPicture) {
								srcIconID = '_' + srcPicture.toString();
								srcValBanner = srcMaxLevelBn.toString();
							}
							else {
								srcIconID = '_' + srcLevelIc.toString();
								srcValBanner = srcLevelBn.toString();
							}
							break;
						case "closed":
							srcStepIc = (srcField/srcPicture);
							srcLevelIc = Math.round(srcStateShift/srcStepIc)+1;
							if (srcState <= srcMinVal || srcState >= srcMaxVal){
								srcIconID = '_' + srcMinLevel.toString();
								srcValBanner = srcMinLevel.toString();
							}
							else {
								srcIconID = '_' + srcLevelIc.toString();
								srcValBanner = srcLevelBn.toString();
							}
							break;
					}
				}


				// Calcul de la couleur des caractères de la valeur de la commande et du bandeau
				switch (srcValBanner) {
					case "1":
						srcTxtVal = "aqua";
						srcTxtBanner = "black"
						break;
					case "2":
						srcTxtVal = "blue";
						srcTxtBanner = "white"
						break;
					case "3":
						srcTxtVal = "lime";
						srcTxtBanner = "black"
						break;
					case "4":
						srcTxtVal = "yellow";
						srcTxtBanner = "black"
						break;
					case "5":
						srcTxtVal = "lightsalmon";
						srcTxtBanner = "black"
						break;
					case "6":
						srcTxtVal = "orange";
						srcTxtBanner = "black"
						break;
					case "7":
						srcTxtVal = "darkorange";
						srcTxtBanner = "black"
						break;
					case "8":
						srcTxtVal = "red";
						srcTxtBanner = "white"
						break;
					case "9":
						srcTxtVal = "darkred";
						srcTxtBanner = "white"
						break;
					case "10":
						srcTxtVal = "black";
						srcTxtBanner = "white"
						break;

				}
			}
			
			// Sélection du mode clair ou sombre
			if ($('body')[0].hasAttribute('data-theme')) {
				if ($('body').attr('data-theme').endsWith('Light')) {
					srcMode = "light";
				} else {
					srcMode = "dark"
				}
			}

			if (srcErrorCode != "") {
				// Affichage des éléments d'erreur
				$('.background#uid#').empty().attr('src', fldBkg + 'fo_oups1.png');
				$('.banner#uid#').empty().attr('src', fldBkg + 'fo_banner_8.png');
				$('.cmdname#uid#,.value#id#,.unite#uid#').hide();
				$('.icon#uid#').hide();
				$('.error#uid#').css('color','white');
				$('.error#uid#').empty().text(srcErrorCode);
			} else {
				// Affichage des textes
				$('.cmdname#uid#').css('color',srcTxtBanner);
				$('.value#uid#,.unite#uid#').css('color','black');
				$('.value#id#,.unite#uid#').empty().text(srcState + ' #unite#');
				
				//Affichage du background, du bandeau et du nom de la commande
				if (srcTheme != "") {
					srcTheme = srcTheme + '_';
				}
				
				$('.background#uid#').empty().attr("src", fldBkg + 'fo_bkg_' + srcTheme + srcMode + '.png');
				$('.banner#uid#').empty().attr("src", fldBkg + 'fo_banner_' + srcValBanner + '.png');
				$('.icon#uid#').empty().attr('src', fldIcon + srcIcon + srcIconID + '.png');
			}

			$('.cmd[data-cmd_uid=#uid#]').attr('title','Valeur du '+_options.valueDate+', collectée le '+_options.collectDate);
		}
		jeedom.cmd.update['#id#']({display_value:'#state#',valueDate:'#valueDate#',collectDate:'#collectDate#',alertLevel:'#alertLevel#'});
	</script>

	<style>
		div.cmdname#uid# {
			font-size:1em;
			font-weight:bold;
			position:absolute;
			vertical-align:middle;
			top:82%;
			left:0%;
			width:80px;
			height:80px;
			z-index:4;
		}
		div.error#uid# {
			font-size:1em;
			font-weight:bold;
			position:absolute;
			vertical-align:middle;
			top:82%;
			left:0%;
			width:80px;
			height:80px;
			z-index:4;
		}		
		div.value#uid# {
			font-size:1.2em;
			font-weight:bold;
			position:absolute;
			vertical-align:middle;
			top:65%;
			width:80px;
			height:80px;
			z-index:4;
			letter-spacing:0px;
		}
		div.unite#uid# {
			font-size:1em;
			font-weight:bold;
			position:absolute;
			top:65%;
			width:80px;
			height:80px;
			z-index:4;
			letter-spacing:0px;
		}
		img.background#uid# {
			position:absolute;
			border-radius:0px 0px 6px 6px;
			top:0%;
			left:0%;
			width:80px;
			height:80px;
			z-index:1;
		}
		img.banner#uid# {
			position:absolute;
			border-radius:0px 0px 6px 6px;
			top:0%;
			left:0%;
			width:80px;
			height:80px;
			z-index:2;
		}
		img.icon#uid# {
			position:absolute;
			margin:0;
			top:35%;
			left:52%;
			max-height:50px;
			max-width:50px;
			z-index:2;
		}
	</style>
</div>
