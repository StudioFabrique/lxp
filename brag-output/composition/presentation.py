"""Author the product film from offline fixtures and genuine LXP markup."""
from pathlib import Path
import json
import re

HERE = Path(__file__).resolve().parent
UI = json.loads((HERE / 'assets/ui-fragments.json').read_text())

def icon(name):
    return UI['icon-' + name]

def glow(body, color='primary'):
    return UI['glow-' + color].replace('{{BODY}}', body)

def box(body):
    return UI['box'].replace('{{BODY}}', body)

def pill(text, selected=False):
    return f'<span class="feature-pill{" selected" if selected else ""}">{text}</span>'

def row(title, subtitle='', symbol='BookOpen', end=''):
    return f'<div class="product-row">{icon(symbol)}<div><b>{title}</b><small>{subtitle}</small></div><span class="row-end">{end or icon("ChevronRight")}</span></div>'

def progress(value):
    return f'<div class="product-progress"><i style="width:{value}%"></i></div>'

def section(name, start, duration, title, content):
    return f'<section id="{name}" class="clip scene" data-start="{start}" data-duration="{duration}" data-track-index="1"><div class="scene-inner"><h1 class="scene-heading">{title}</h1>{content}</div></section>'

def compose():
    # The saved Studio version is retained byte for byte. Its logo, caption and
    # removed audio/header choices carry forward into the revised art direction.
    saved = (HERE.parent / 'revisions/user-edit-20261005/index.html.bak').read_text()
    logos = re.findall(r'<svg\b[^>]*class="brand-svg"[^>]*>.*?</svg>', saved, re.S)
    if len(logos) != 2:
        raise ValueError('Expected both original ANDRIA logo geometries in the Studio backup')
    caption = 'Apprentissage Numérique &amp; Développement Renforcé par intelligence artificielle'
    scenes = [section('identity', 0, 3, '', f'<div class="identity"><div id="intro-logo">{logos[0]}</div><p>{caption}</p></div>')]

    labels = ['Organisme de formation', 'Parcours', 'Module', 'Cours', 'Leçon', 'Activités']
    symbols = ['Building2', 'GraduationCap', 'Layers', 'BookOpen', 'FileText', 'ListChecks']
    rail = ''.join(f'<div id="rail-{i}" class="hierarchy-stop"><span>{icon(symbols[i])}</span><b>{label}</b></div>' for i,label in enumerate(labels))
    faces = ''.join(f'<article class="hierarchy-face" id="face-{i}"><div class="native-card">{UI[f"level-{i}"]}</div></article>' for i in range(5))
    activities = ''.join(row(a, b, c) for a,b,c in [('Texte', 'Mise en forme et contenu riche', 'FileText'), ('Vidéo', 'Observer et comprendre', 'Play'), ('Ressource', 'Retrouver la fiche de synthèse', 'FolderOpen')])
    faces += '<article class="hierarchy-face" id="face-5">'+glow('<div class="activity-face"><small>Activités</small><h2>Comprendre la structure HTML</h2>'+activities+'</div>')+'</article>'
    scenes.append(section('structure', 3, 18, 'Différents niveaux de contenu pédagogique', f'<div class="hierarchy-rail">{rail}<div class="rail-line"><i></i></div></div><div class="hierarchy-camera"><div id="hierarchy-world">{faces}</div></div><div class="hierarchy-caption"><span id="hierarchy-caption-text">Un parcours se construit, niveau par niveau.</span></div>'))

    palette = ''.join(f'<div class="activity-choice">{icon(c)}<span>{a}</span></div>' for a,c in [('Texte','FileText'),('Image','Image'),('Vidéo','Play'),('Contenu intégré','Code'),('Ressource','Link'),('Fichier','Download')])
    toolbar = ''.join(f'<span>{icon(c)}</span>' for c in ['Bold','Italic','Underline','List','ListChecks','Table','Image','Code'])
    doc = '<h2>Construire sa première page</h2><p>Une page <strong>bien structurée</strong> rend le contenu accessible.</p><div id="editor-checks"><p>☑ Définir un titre</p><p>☑ Organiser les sections</p><p>☑ Ajouter des ressources</p></div><table id="editor-table"><tr><th>Balise</th><th>Rôle</th></tr><tr><td>&lt;h1&gt;</td><td>Titre principal</td></tr><tr><td>&lt;p&gt;</td><td>Paragraphe</td></tr></table><pre id="editor-code">&lt;main&gt;\n  &lt;h1&gt;Ma première page&lt;/h1&gt;\n&lt;/main&gt;</pre>'
    scenes.append(section('author',21,9,'Créer du contenu',f'<div class="editor-layout"><aside class="surface palette"><h3>Ajouter une activité</h3>{palette}</aside><div class="editor-surface surface"><div class="editor-tools"><b>H₁</b>{toolbar}</div><div class="editor-document">{doc}</div></div></div><div class="feature-strip">'+''.join(pill(x) for x in ['Éditeur Tiptap','Tableaux','Listes de tâches','Code','Images redimensionnables','Vidéo intégrée'])+'</div>'))

    reading = '<small>Les bases du HTML</small><h2>La structure d’une page</h2><p>Le HTML décrit le sens et l’organisation du contenu.</p><p><mark id="selected-passage">La balise &lt;main&gt; contient le contenu principal de la page.</mark></p><div id="ask-selection" class="product-button">'+icon('Sparkles')+'Demander à l’IA</div><div class="reading-code">&lt;header&gt; Navigation &lt;/header&gt;<strong>&lt;main&gt; Votre contenu &lt;/main&gt;</strong><span>&lt;footer&gt; Informations &lt;/footer&gt;</span></div>'
    chat = UI['chat-header'] + '<div class="chat-content"><div class="chat-context">Inclus dans votre question<p>La balise &lt;main&gt; contient le contenu principal de la page.</p></div><div class="chat-user" id="chat-question">Explique-moi avec un exemple concret.</div><div class="chat-answer" id="chat-answer"><b>Assistant</b><p>Sur un site de recettes, &lt;main&gt; contient la recette : les ingrédients et les étapes.</p><p>Le menu de navigation reste dans &lt;header&gt;.</p><div class="chat-source">'+icon('BookOpen')+'Contenus de cours associés :<strong>La structure d’une page '+icon('ArrowUpRight')+'</strong></div></div><div id="chat-quiz" class="chat-quiz">Vérifiez ce que vous avez compris.<span class="product-button">Générer un quizz</span></div><div class="chat-input">Posez votre question…'+icon('Send')+'</div></div>'
    scenes.append(section('assistant',30,12,'Le chatbot, au plus près du cours.', '<div class="assistant-layout"><div class="reading-panel surface">'+reading+'</div><div class="chat-panel surface">'+chat+'</div></div><div class="feature-strip">'+''.join(pill(x) for x in ['Sélection de texte','Explications contextualisées','Sources du cours','Quiz d’entraînement'])+'</div>'))

    quiz = '<div class="quiz-top"><span>Quiz de cours</span><b>Question 1 / 4</b></div>'+progress(25)+'<h2>Quel élément contient le contenu principal ?</h2>'+''.join(f'<div class="quiz-option" id="answer-{i}"><span class="radio-dot"></span><code>&lt;{a}&gt;</code></div>' for i,a in enumerate(['header','main','footer']))+'<div id="quiz-explanation" class="quiz-explanation">'+icon('Check')+'Exact. &lt;main&gt; identifie le contenu principal du document.</div>'
    scenes.append(section('assess',42,8,'S’entraîner. Vérifier. Progresser.', '<div class="assessment-layout"><div class="quiz-panel surface">'+quiz+'</div><div class="assessment-side">'+glow('<h3>Des quiz à chaque étape</h3>'+row('Diagnostic','Situer les acquis avant le module','CircleHelp')+row('Quiz de cours','Vérifier les notions abordées','BookOpen')+row('Entraînement avec le chatbot','Revenir sur une difficulté','Bot'))+'<div class="quiz-types">'+''.join(pill(x) for x in ['QCM','Vrai / faux','Association','Ordonnancement'])+'</div></div></div>'))

    submission = '<div class="panel-title">'+icon('Upload')+'<h2>Remises et évaluations</h2></div><small>Les bases du HTML</small><h3>Créer une page accessible</h3><p>Livrer une page structurée avec un titre, une navigation et un contenu principal.</p><div class="file-row">'+icon('FileText')+'index.html<span>4 Ko</span>'+icon('Check')+'</div><div class="submission-status">Travail remis</div>'
    correction = '<div class="panel-title">'+icon('CheckCheck')+'<h2>Évaluation du travail</h2></div><div class="person"><span class="avatar">C</span><div><b>Camille Martin</b><small>Développeur web</small></div></div><div class="score">16<span>/ 20</span></div><h3>Commentaire de l’équipe pédagogique</h3><p>La structure est claire. Pensez à renseigner le texte alternatif des images.</p><div class="submission-status">Évaluation disponible</div>'
    scenes.append(section('assignments',50,7,'Du travail remis au retour pédagogique.', '<div class="two-panels"><article class="surface work-panel">'+submission+'</article><div class="handoff">'+icon('ArrowUpRight')+'</div><article class="surface work-panel" id="correction">'+correction+'</article></div>'))

    calendar = '<div class="panel-title">'+icon('CalendarDays')+'<h2>Calendrier</h2><span class="calendar-tabs">Jour <b>Semaine</b> Mois Timeline</span></div><div class="calendar-grid">'+''.join(f'<div class="calendar-day"><b>{day}</b><span>{date}</span><div class="calendar-event">{title}<small>{time}</small></div></div>' for day,date,title,time in [('Lun.','05','Les bases du HTML','09:00 – 12:00'),('Mar.','06','Atelier CSS','09:00 – 12:00'),('Mer.','07','Projet de groupe','14:00 – 17:00'),('Jeu.','08','Accessibilité','09:00 – 12:00'),('Ven.','09','Remise du projet','Avant 18:00')])+'</div>'
    resources = '<h3>Médiathèque et ressources</h3>'+row('Guide HTML accessible','Document PDF','FileText')+row('Démonstration commentée','Vidéo pédagogique','Play')+row('Documentation MDN','Ressource externe','Link')
    groups = '<h3>Groupes et équipe pédagogique</h3>'+row('Développeur web 2026','24 apprenants','Users')+row('Équipe pédagogique','Formateurs et référents','GraduationCap')+'<div class="mini-tags">Gestion des accès<span></span>Rôles et permissions</div>'
    scenes.append(section('organize',57,9,'Organiser la formation au quotidien.', '<div class="operations"><div class="surface calendar-panel">'+calendar+'</div><div class="operation-bottom">'+glow(resources,'secondary')+glow(groups)+'</div></div>'))

    resume = '<h3>Reprendre mes activités là où je m’étais arrêté</h3><div class="resume-grid">'+glow('<div class="resume-content"><b>Construire une interface</b><p>Cours 1 : Les bases du HTML</p><span class="skill-badge">HTML</span><div class="resume-lesson"><strong>2 / 3</strong><span>La structure d’une page</span>'+icon('ArrowUpRight')+'</div>'+progress(68)+'</div>','secondary')+glow('<div class="resume-content"><b>Développer une API</b><p>Cours 2 : Les routes HTTP</p><span class="skill-badge">API REST</span><div class="resume-lesson"><strong>1 / 4</strong><span>Définir une route</span>'+icon('ArrowUpRight')+'</div>'+progress(35)+'</div>','secondary')+'</div>'
    profile = '<h3>Mon profil d’apprentissage</h3><div class="profile-choices">'+pill('Progressif',True)+pill('Exemples concrets',True)+pill('Pas-à-pas',True)+'</div><p>Un rythme et des préférences renseignés par l’apprenant.</p>'
    awards = '<h3>Mon avancement</h3><div class="achievement"><span>'+icon('Award')+'</span><div><b>Compétences et accomplissements</b><p>Retrouver les acquis et suivre ses modules.</p></div></div><div class="progress-label"><b>Construire une interface</b><strong>68 %</strong></div>'+progress(68)
    scenes.append(section('progression',66,7,'Chaque apprenant garde son fil.', '<div class="progression-layout">'+resume+'<div class="operation-bottom"><div class="surface profile-panel">'+profile+'</div><div class="surface profile-panel">'+awards+'</div></div></div>'))

    mood = '<h3>Comment vous sentez-vous aujourd’hui ?</h3><div class="mood-center"><svg id="mood-icon" viewBox="0 0 120 120" aria-label="Humeur du jour"><path id="mood-shape" d="M28 74 C8 74 8 45 26 42 C29 18 59 17 68 36 C87 30 107 45 105 63 C105 70 100 74 93 74 Z"/><path id="mood-detail" d="M63 61 L47 85 L61 85 L53 106 L79 78 L65 78 Z"/><path id="mood-rays" d="M60 5V15 M60 105V115 M5 60H15 M105 60H115 M21 21L28 28 M92 92L99 99 M21 99L28 92 M92 28L99 21"/></svg><div class="mood-scale">'+''.join(icon(x) for x in ['CloudLightning','CloudRain','CloudSunRain','CloudSun','Sun'])+'</div></div><small>Commentaire (facultatif)</small><div class="comment-field">Je bloque sur la dernière leçon.</div><div class="product-button" id="feedback-send">Envoyer mon feedback</div><div id="feedback-sent" class="status-line">'+icon('Check')+'Feedback envoyé</div>'
    alert = '<div class="panel-title">'+icon('Bell')+'<h3>Alertes</h3></div><div class="alert-group"><b>Développeur web 2026</b><strong>1 cas critique</strong><span>sur 24 apprenants</span></div><div class="person"><span class="avatar">C</span><div><b>Camille Martin</b><small>Risque de décrochage</small></div><span class="risk-badge">Critique</span></div><div class="metrics"><div><b>42 %</b><small>Réussite</small></div><div><b>4 / 30</b><small>Jours connectés</small></div><div><b>8 jours</b><small>Inactivité</small></div></div><div class="product-button" id="review-button">Prendre en compte l’alerte</div>'
    support = '<div class="panel-title">'+icon('Users')+'<h3>Équipe pédagogique</h3></div><div class="review-message">'+icon('MessageSquare')+'<div><b>Feedback pris en compte</b><p>Camille : « Je bloque sur la dernière leçon. »</p></div></div><small>Accompagnement mis en place</small><div class="comment-field">Point individuel sur la leçon et reprise guidée de l’exercice.</div><small>Votre avis sur l’analyse</small><div class="verdict">Analyse pertinente '+icon('Check')+'</div><div class="status-line" id="review-saved">'+icon('CheckCheck')+'Retour enregistré par l’équipe</div>'
    scenes.append(section('care',73,16,'Accompagner les étudiants', '<div class="care-grid"><div class="surface mood-panel" id="mood-panel">'+mood+'</div><div id="risk-panel">'+glow(alert,'error')+'</div><div class="surface support-panel" id="support-panel">'+support+'</div></div><div class="care-flow"><span>Ressenti de l’apprenant</span><i></i><span>Signaux de décrochage</span><i></i><span>Accompagnement pédagogique</span></div><div class="care-note">Les analyses éclairent le suivi. L’équipe pédagogique décide de l’accompagnement.</div>'))

    usage = '<div class="panel-title">'+icon('ChartNoAxesCombined')+'<h2>Tableau de bord IA</h2></div><div class="usage-total"><small>Tokens consommés ce mois-ci</small><strong>128 400</strong></div><h3>Utilisation par promotion</h3><div class="usage-row"><b>Développeur web 2026</b><span>76 800</span></div>'+progress(60)+'<div class="usage-row"><b>Designer numérique 2026</b><span>51 600</span></div>'+progress(40)
    quality = '<h3>Classement de mes cours</h3>'+row('Les bases du HTML','Retours des apprenants','BookOpen','4,8 / 5')+row('Concevoir une page accessible','Retours des apprenants','BookOpen','4,6 / 5')
    imports = '<h3>Réutiliser les contenus existants</h3>'+row('Import de cours Moodle','Cours, leçons et activités associées','Download')+row('Importer un parcours','Retrouver une structure pédagogique','Layers')
    scenes.append(section('steering',89,8,'Piloter les usages et les contenus.', '<div class="steering-layout"><div class="usage-panel">'+box(usage)+'</div><div class="steering-right">'+glow(quality,'secondary')+glow(imports)+'</div></div><p class="fixture-note">Exemple de données de démonstration</p>'))

    theme_choices = ''.join(f'<div class="theme-choice" id="choice-{t}" data-theme="{t}"><i></i><b>{name}</b></div>' for t,name in [('ocean','Océan'),('sage','Forêt'),('aurora','Aurore')])
    theme_dashboard = '<div class="theme-greeting"><h2>Bonjour Camille</h2><span class="product-button">Mon avancement</span></div>'+resume+'<div class="theme-bottom">'+row('Calendrier','Votre prochaine séance : Atelier CSS','CalendarDays')+row('Remises et évaluations','Votre retour pédagogique est disponible','CheckCheck')+'</div>'
    scenes.append(section('personalize',97,6,'Une plateforme. Vos couleurs.', '<div class="theme-layout"><div class="theme-choices">'+theme_choices+'</div><div class="surface theme-product" id="theme-product" data-theme="ocean">'+theme_dashboard+'</div></div>'))
    scenes.append(section('closing',103,5,'',f'<div class="identity closing"><div id="outro-logo">{logos[1]}</div><h2>Former. Créer. Accompagner.</h2><p>{caption}</p></div>'))
    return '<!doctype html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920, height=1080"><title>ANDRIA LXP — Présentation produit</title><link rel="stylesheet" href="assets/lxp.css"><script src="assets/gsap.min.js"></script><script src="assets/MorphSVGPlugin.min.js"></script><style>{{STYLE}}</style></head><body><div id="root" data-theme="ocean" data-composition-id="main" data-start="0" data-duration="108" data-width="1920" data-height="1080">'+''.join(scenes)+'</div><script>{{MOTION}}</script></body></html>'

if __name__ == '__main__':
    (HERE / 'source.html.in').write_text(compose())
