---
'@tcgdata/tcgcsv-client': minor
---

Added custom 7z build which embeds the wasm in js to avoid complexities in loading it it. Reworked methods for decompressing data so tree-shaking can remove if it is unused.
