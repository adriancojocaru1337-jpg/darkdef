Skeleton Defense - pachet reparat

Bug reparat:
- varianta anterioară pornea din ES modules, iar deschiderea directă din ZIP/file:// putea bloca JavaScript-ul în browser.
- această variantă rulează direct prin index.html, fără server local.

Fișier de pornire:
- deschide index.html

Conține și sursa refactorizată:
- js_refactor_source/

Patch v2:
- reparat crash JavaScript la pornire (audioCtx declarat de două ori).


Spell system added:
- Frost Nova: slows enemies in an area
- Meteor Strike: heavy AoE damage
- Chain Lightning: hits multiple nearby enemies
