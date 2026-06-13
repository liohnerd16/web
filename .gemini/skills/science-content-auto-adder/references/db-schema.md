# Database Schema & Seeding

The database uses SQLite (LibSQL). Integration happens by updating the `samples` array in `server/database/db.js`.

## `videos` Table Columns (Index-based in `samples`)

| Index | Name | Type | Description |
|---|---|---|---|
| 0 | `title` | TEXT | English Project Title |
| 1 | `description` | TEXT | English Short Description |
| 2 | `embedUrl` | TEXT | YouTube Embed URL (`https://www.youtube.com/embed/ID`) |
| 3 | `category` | TEXT | Category Name (e.g., Physics, Chemistry) |
| 4 | `explanation` | TEXT | English LaTeX filename (`name-en.tex`) |
| 5 | `imageUrls` | TEXT | JSON string array of extra images (`JSON.stringify([])`) |
| 6 | `referenceLinks` | TEXT | JSON string array of link objects `{label, url}` |
| 7 | `affiliateLinks` | TEXT | JSON string array of product objects `{name, price, links:[{label, url}]}` |
| 8 | `seriesTitle` | TEXT | Title for grouping (or `null`) |
| 9 | `partNumber` | INTEGER | Part number in series (or `null`) |
| 10 | `titleVi` | TEXT | Vietnamese Project Title |
| 11 | `descriptionVi` | TEXT | Vietnamese Short Description |
| 12 | `explanationVi` | TEXT | Vietnamese LaTeX filename (`name.tex`) |

## Example Entry

```javascript
[
  "Talking Robot",
  "Build a talking robot.",
  "https://www.youtube.com/embed/gTIiGMqV5I0",
  "Robotics & Coding",
  "talking-robot-en.tex",
  JSON.stringify([]),
  JSON.stringify([{ label: "GitHub", url: "https://github.com/..." }]),
  JSON.stringify([{ name: "Arduino Nano", price: "95k", links: [{ label: "Shopee", url: "..." }] }]),
  null, null,
  "Robot biết nói",
  "Chế tạo robot biết nói.",
  "talking-robot.tex"
]
```
