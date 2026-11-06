# Portrait letter sheet uses one fixed imposition

A one-sheet eight-page zine often arrives as a single portrait letter image. The `sheet` attribute cuts that image on a fixed grid of 2 columns and 4 rows. From the top, the pages sit at 8 and 7, then 1 and 6, then 2 and 5, then 3 and 4. Tops point at the outer edges, so the left column turns 90° counter-clockwise and the right column turns 90° clockwise. Each turned cell fills the portrait page box the viewer already uses.

A general sprite grid would cover other folds, and landscape cells would match the raw crop. This component only needed the tea sheet. That order is not the common mini-zine template, which puts the cover and the back side by side on the top row. Moving a cell later would break sheets drawn for this map. Zines that already pass one image per face keep the `pages` attribute and the light-DOM children.
