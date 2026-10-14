"""Export the current Studio edit as an offline, CSP-compatible login player.
Run this after saving edits in Hyperframes. Never rebuild the Studio composition.
"""
from pathlib import Path
import hashlib,json,re,shutil
HERE=Path(__file__).resolve().parent
PROJECT=HERE.parent.parent
SOURCE=PROJECT/'brag-output/composition'
OUT=PROJECT/'front/public/presentations/andria'
OUT.mkdir(parents=True,exist_ok=True)
html=(SOURCE/'index.html').read_text()
scene_attributes=re.findall(r'<section\b([^>]+)>',html)
scenes={}
for attributes in scene_attributes:
    fields=dict(re.findall(r'([\w-]+)="([^"]*)"',attributes))
    scenes[fields['id']]={'id':fields['id'],'start':float(fields['data-start']),'duration':float(fields['data-duration'])}
mappings=[['structure'],['personalize'],['assistant'],['steering'],['author'],['assess'],['organize'],['care'],['dashboards'],['progression'],['groups'],['trainers'],['tags'],['emails'],['instance'],['accomplishments']]
sequences=[[scenes[name] for name in names] for names in mappings]
# Use the actual first scene, not the deleted old closing slogan.
intro=scenes['identity']
styles=re.findall(r'<style>(.*?)</style>',html,re.S)
# The sidebar tutorial belongs to the presentation only: the login tiles and brand frames do not load it.
(OUT/'scene.css').write_text('\n'.join(styles)+'\n'+(HERE/'player.css').read_text()+'\n'+(HERE/'tutorial.css').read_text())
scripts=re.findall(r'<script>(.*?)</script>',html,re.S)
(OUT/'timeline.js').write_text('\n'.join(scripts))
html=re.sub(r'<style>.*?</style>','<link rel="stylesheet" href="scene.css">',html,flags=re.S)
html=re.sub(r'<script>.*?</script>','<script src="timeline.js"></script><script src="player.js"></script>',html,flags=re.S)
html=html.replace('assets/lxp.css','theme.css').replace('assets/gsap.min.js','gsap.min.js').replace('assets/MorphSVGPlugin.min.js','MorphSVGPlugin.min.js')
# Timeline time determines visibility in Hyperframes. The standalone player owns
# that same contract without loading the Studio or application APIs.
html=html.replace('<title>ANDRIA LXP — Présentation produit</title>','<title>Découvrir ANDRIA</title>')
(OUT/'index.html').write_text(html)
for name,target in [('lxp.css','theme.css'),('gsap.min.js','gsap.min.js'),('MorphSVGPlugin.min.js','MorphSVGPlugin.min.js')]:shutil.copyfile(SOURCE/'assets'/name,OUT/target)
(OUT/'player.js').write_text('const sequences='+json.dumps(sequences)+';\nconst opening='+json.dumps(intro)+';\n'+(HERE/'player.js').read_text())
# Small brand frames reuse the original SVG geometry without parsing the film,
# theme bundle, dashboard fixtures or unrelated GSAP tweens at startup.
source_html=(SOURCE/'index.html').read_text()
identity=re.search(r'<section\b[^>]*\bid="identity"[^>]*>.*?</section>',source_html,re.S).group()
chatbot_svg=re.search(r'id="dashboard-chatbot".*?(<svg\b.*?</svg>)',source_html,re.S).group(1)
brand_body=identity+'<section id="dashboards" class="scene"><div id="dashboard-chatbot"><button type="button" tabindex="-1">'+chatbot_svg+'</button></div></section>'
(OUT/'brand.html').write_text('<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Animation ANDRIA</title><link rel="stylesheet" href="brand.css"><script src="gsap.min.js"></script></head><body><div id="root">'+brand_body+'</div><script src="brand-timeline.js"></script><script src="player.js"></script></body></html>')
(OUT/'brand.css').write_text((HERE/'brand.css').read_text()+'\n'+(HERE/'player.css').read_text())
shutil.copyfile(HERE/'brand-timeline.js',OUT/'brand-timeline.js')
(OUT/'manifest.json').write_text(json.dumps({'sourceSha256':hashlib.sha256((SOURCE/'index.html').read_bytes()).hexdigest(),'sequences':sequences,'opening':intro},indent=2)+'\n')
print('Exported current Hyperframes edit to',OUT.relative_to(PROJECT))
