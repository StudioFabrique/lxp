"""Build the film. Refuse to overwrite new edits made directly in Studio."""
from pathlib import Path
import hashlib
import sys
HERE = Path(__file__).resolve().parent

def digest(text):
    return hashlib.sha256(text.encode()).hexdigest()

def build():
    output = HERE / 'index.html'
    state = HERE / '.build-sha256'
    if output.exists() and state.exists() and digest(output.read_text()) != state.read_text().strip():
        raise SystemExit('Studio edits detected. Save and merge index.html into the sources before rebuilding.')
    if output.exists() and not state.exists() and '--adopt-backed-up-version' not in sys.argv:
        raise SystemExit('First build requires --adopt-backed-up-version after preserving the Studio version.')
    html = (HERE / 'source.html.in').read_text()
    html = html.replace('{{STYLE}}', (HERE / 'style.css').read_text())
    html = html.replace('{{MOTION}}', (HERE / 'motion.js').read_text())
    output.write_text(html)
    state.write_text(digest(html) + '\n')
    print('Built offline presentation from the current reconciled Studio sources.')

if __name__ == '__main__':
    build()
