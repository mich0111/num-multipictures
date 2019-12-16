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
			// Récupération des valeurs des paramètres du widget
			var srcNumType = ('#numtype#'!='#'+'numtype#') ? '#numtype#' : "";
													// Type de valeur à représenter (closed, opened) (obligatoire)
			var fldIcon = ('#folder#'!='#'+'folder#') ? '#folder#' : "";
													// Dossier de l'image à superposer (obligatoire)
			var srcIcon = ('#icon#'!='#'+'icon#') ? '#icon#' : "";
													// Image à superposer (obligatoire)
			var srcPicture = (is_numeric('#picture#')) ? parseFloat('#picture#') : null;
													// Nombre d'images à afficher (obligatoire)
			var srcMinVal = (is_numeric('#min#')) ? parseFloat('#min#') : null;
													// Valeur minimale de la plage de mesure à prendre en compte (obligatoire)
			var srcMaxVal = (is_numeric('#max#')) ? parseFloat('#max#') : null;       
													// Valeur maximale de la plage de mesure à prendre en compte (obligatoire)
			var srcColBanMin = ('#colbanmin#'!='#'+'colbanmin#') ? '#colbanmin#': "";
													// Couleur du bandeau si Min (optionnel) - Défaut "aqua"
			var srcColBanMax = ('#colbanmax#'!='#'+'colbanmax#') ? '#colbanmax#': "";
													// Couleur du bandeau si Max (optionnel)- Défaut "red"
			var srcColBanIn = ('#colbanin#'!='#'+'colbanin#') ? '#colbanin#': "";
													// Couleur du bandeau si à l'intérieur des marges (optionnel) - Défaut "lime"
			var srcColTxtBnMin = ('#coltxtbnmin#'!='#'+'coltxtbnmin#') ? '#coltxtbnmin#': "";
													// Couleur du texte bandeau si Min (optionnel) - Défaut "black"
			var srcColTxtBnMax = ('#coltxtbnmax#'!='#'+'coltxtbnmax#') ? '#coltxtbnmax#': "";
													// Couleur du texte bandeau si Max (optionnel) - Défaut "black"
			var srcColTxtBnIn = ('#coltxtbnin#'!='#'+'coltxtbnin#') ? '#coltxtbnin#': "";
													// Couleur du texte bandeau si à l'intérieur des marges (optionnel) - Défaut "black"
			var srcBlinkMax = ('#blinkmax#'!='#'+'blinkmax#') ? '#blinkmax#': "";
													// Clignotement si Max (optionnel) - Défaut "no"
			var srcBlinkMin = ('#blinkmin#'!='#'+'blinkmin#') ? '#blinkmin#': "";
													// Clignotement si Min (optionnel) - Défaut "no"
			var srcTheme = ('#theme#'!='#'+'theme#') ? '#theme#': "";
													// Thème du background s'il y a lieu (optionnel) - Défaut standard

			// Récupération de srcState
			var srcState = _options.display_value;	// Valeur de l'info numérique

			var fldBkg = 'data/customTemplates/dashboard/cmd.action.other.Multi-action-Defaut/fond/';
													// Dossier des images de background
			var srcMode = "light";					// Mode du background (dark ou light)
			var srcIconID = "1";					// Rang de l'image à afficher
			var srcLevelIc = 1;						// Niveau de l'image à afficher après calcul
			var srcMinLevel = 1;					// Niveau min de l'image et du bandeau (forcément 1)
			var srcField = srcMaxVal - srcMinVal;	// Plage totale de calcul de l'image de background, permet de traiter le cas des bornes négatives
			var srcStepIc = 1;						// Intervalle entre 2 images différentes
			var srcStateShift = srcState - srcMinVal;
													// State décalé en fonction du Min pour calculer l'image et le bandeau
			var srcMode = "light";					// Mode du background (dark ou light)
			var srcColBanner = "";					// Couleur des caractères du bandeau
			var srcColTxtBanner = "";				// Couleur des caractères du bandeau
			var srcBlink = "";						// Clignotement
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
				// Affichage des éléments d'erreur
				srcIcon = "error";
				$('.background#uid#').empty().attr('src', fldBkg + 'fo_oups1.png');
				$('.banner#uid#').css('background-color','red');
				$('.cmdname#uid#,.value#id#,.unite#uid#').hide();
				$('.icon#uid#').hide();
				$('.error#uid#').css('color','white');
				$('.error#uid#').empty().text(srcErrorCode);
			} else {
				// Sélection du mode clair ou sombre
				if ($('body')[0].hasAttribute('data-theme')) {
					if ($('body').attr('data-theme').endsWith('Light')) {
						srcMode = "light";
					} else {
						srcMode = "dark"
					}
				}

				// Initialisation du nom du dossier des images
				fldIcon = 'data/customTemplates/dashboard/cmd.action.other.Multi-action-Defaut/' + fldIcon + '/';

				// Initialisation de la couleur du bandeau, des caractères de la valeur et du clignotement
				if ((srcNumType == "closed") || ((srcState > srcMinVal) && (srcState < srcMaxVal))) {
					// Borné ou dans les marges
					srcColBanner = ((srcColBanIn != "") && (srcColBanIn != null)) ? srcColBanIn : "lime";
					srcColTxtBanner = ((srcColTxtBnMax != "") && (srcColTxtBnMax != null)) ? srcColTxtBnMax : "black";
					srcBlink = "no";
				} else if ((srcNumType == "opened") && (srcState <= srcMinVal)) {
					// Non borné et inférieur ou égal à min
					srcColBanner = ((srcColBanMin != "") && (srcColBanMin != null)) ? srcColBanMin : "aqua";
					srcColTxtBanner = ((srcColTxtBnMin != "") && (srcColTxtBnMin != null)) ? srcColTxtBnMin : "black";
					srcBlink = (srcBlinkMin == "yes") ? srcBlinkMin : "no";
				} else {
					// Non borné et supérieur ou égal à Max
					srcColBanner = ((srcColBanMax != "") && (srcColBanMax != null)) ? srcColBanMax : "red";
					srcColTxtBanner = ((srcColTxtBnMax != "") && (srcColTxtBnMax != null)) ? srcColTxtBnMax : "black";
					srcBlink = (srcBlinkMax == "yes") ? srcBlinkMax : "no";
				}

				// Calcul de l'image en fonction du type de variable numérique "opened", "closed" et du nombre d'images
				if (srcPicture == 1) {				// Image unique
					srcIconID = "_1";
				} else if (srcPicture == 2) {		// Images doubles
					// Calcul de l'image à afficher selon la valeur médiane
					srcIconID = (srcStateShift <= srcField / 2) ? "_1" : "_2";
				} else if (srcNumType == 'opened') {// Images multiples
					// Cas 'opened'
					srcStepIc = srcField / (srcPicture - 2);
					srcLevelIc = Math.trunc(srcStateShift / srcStepIc) + 2;
					if ((srcState <= srcMinVal) || (srcLevelIc < srcMinLevel)) {
						srcIconID = '_' + srcMinLevel.toString();
					} else if ((srcState >= srcMaxVal) || (srcLevelIc > srcPicture)) {
						srcIconID = '_' + srcPicture.toString();
					} else {
						srcIconID = '_' + srcLevelIc.toString();
					}
				} else {
					// Cas 'closed'
					srcStepIc = (srcField / srcPicture);
					srcLevelIc = Math.round(srcStateShift / srcStepIc) + 1;
					if ((srcState <= srcMinVal) || (srcState >= srcMaxVal)) {
						srcIconID = '_' + srcMinLevel.toString();
					} else {
						srcIconID = '_' + srcLevelIc.toString();
					}
				}

				// Affichage du background
				if (srcTheme != "") {
					srcTheme = srcTheme + '_';
				}
				$('.background#uid#').empty().attr("src", fldBkg + 'fo_bkg_' + srcTheme + srcMode + '.png');

				// Affichage du bandeau et de ses options
				$('.banner#uid#').css('background-color', srcColBanner);
				if (srcBlink == 'yes') {					
					// Clignotement
					$('.banner#uid#').addClass('blinking');
				}
				else {
					$('.banner#uid#').removeClass('blinking');
				}
				$('.banner#uid#').empty().attr("src", fldBkg + 'fo_banner.png');

				// Affichage de l'icone et de ses options
				$('.icon#uid#').empty().attr('src', fldIcon + srcIcon + srcIconID + '.png');

				// Affichage des textes
				$('.cmdname#uid#').css('color', srcColTxtBanner);
				$('.value#uid#,.unite#uid#').css('color','black');
				$('.value#id#,.unite#uid#').empty().text(srcState + ' #unite#');
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
			bottom:0%;
			left:0%;
			width:80px;
			height:16px;
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
		@keyframes blinking {
			20% {opacity:0;}
			100% {opacity:1;}
		}
		.blinking {animation:blinking infinite 1s;}
	</style>
</div>
