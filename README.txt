Dark Defense - Bonus Leaderboard UI update

Ce s-a schimbat:
- am scos butoanele Start Wave / Pause / Reset din hero-ul din dreapta sus
- în locul lor apare un card compact: Online Endless Bonus Top 5
- cardul citește topul global din /.netlify/functions/get-bonus-leaderboard
- la Game Over în Endless Mode, jocul trimite bonus score-ul în leaderboard

Ce mai trebuie:
1. rulează sql/setup_leaderboard.sql în Neon / Netlify DB
2. deploy pe Netlify cu package.json inclus
3. verifică Functions logs dacă leaderboard-ul nu răspunde

Spell system restored:
- Frost Nova: slow AoE
- Meteor Strike: damage AoE
- Chain Lightning: multi-target hit


Serious anti-cheat update:
- create /.netlify/functions/start-run before a real run
- submit-score validates signed run tokens, DB-backed rate limits, IP/user-agent fingerprint, single-use run IDs, and plausibility checks
- run setup_leaderboard.sql again after this update
