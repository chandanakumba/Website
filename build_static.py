"""
Static Site Builder for Birthday Surprise Website
Exports the Flask-rendered HTML and static media into a self-contained 'dist' folder.
This enables 100% free, instant drag-and-drop deployment to Netlify, Vercel, or GitHub Pages.
"""

import os
import shutil
from app import app

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, 'dist')

def build():
    print("Building static site for free deployment...")
    
    # 1. Clean or create dist directory
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR)
    os.makedirs(DIST_DIR, exist_ok=True)

    # 2. Render Flask template
    with app.test_client() as client:
        response = client.get('/')
        if response.status_code != 200:
            raise RuntimeError(f"Failed to render homepage: Status {response.status_code}")
        html_content = response.data.decode('utf-8')

    # 3. Convert absolute /static/ paths to relative static/ paths for static hosts
    html_content = html_content.replace('href="/static/', 'href="static/')
    html_content = html_content.replace('src="/static/', 'src="static/')

    # 4. Save index.html into dist/
    index_path = os.path.join(DIST_DIR, 'index.html')
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("✓ Created dist/index.html")

    # 5. Copy static folder (images, music, style.css, script.js) into dist/
    src_static = os.path.join(BASE_DIR, 'static')
    dst_static = os.path.join(DIST_DIR, 'static')
    shutil.copytree(src_static, dst_static)
    print("✓ Copied static assets (images, music, css, js) to dist/static/")

    total_files = sum(len(files) for _, _, files in os.walk(DIST_DIR))
    print(f"\nSUCCESS! Build complete ({total_files} files in 'dist/'). Ready for free deployment!")

if __name__ == '__main__':
    build()
