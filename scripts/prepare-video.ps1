# Source files stay local. Publish only the optimized silent video and poster.
param([string]$Source = 'video1.mp4')
$ErrorActionPreference = 'Stop'
if (!(Test-Path -LiteralPath $Source)) { throw "Missing source: $Source" }
New-Item -ItemType Directory -Force public/videos | Out-Null
& ffmpeg -hide_banner -loglevel error -y -i $Source -an -vf scale=1280:720 -c:v libx264 -preset slow -crf 22 -g 1 -bf 0 -pix_fmt yuv420p -movflags +faststart public/videos/symi-swirl.mp4
if ($LASTEXITCODE -ne 0) { throw 'Video encoding failed' }
& ffmpeg -hide_banner -loglevel error -y -i $Source -an -vf scale=768:432 -c:v libx264 -preset slow -crf 21 -g 1 -bf 0 -pix_fmt yuv420p -movflags +faststart public/videos/symi-swirl-mobile.mp4
if ($LASTEXITCODE -ne 0) { throw 'Mobile video encoding failed' }
& ffmpeg -hide_banner -loglevel error -y -ss 0 -i $Source -vf scale=1440:810 -frames:v 1 public/videos/symi-swirl-poster.webp
if ($LASTEXITCODE -ne 0) { throw 'Poster generation failed' }
