# WoW Classic Item Data Files

This contains three types of files that together describe every tracked loot source across all five WoW Classic expansions, along with the item drops scraped from each one. This is mostly used to provide both a local or offline source for applications or searches and is focused solely on end-game loot that would be used in Best in Slot(BiS) Lists or Wishlists.

-= Crafted Items, Tier Tokens, Quest Rewards, and any source outside of a Dungeon or Raid is currently not provided, but planned to impliment soon =-

| File | Purpose |
|---|---|
| `itemDatabaseSources.js` | Master source list — CommonJS module, usable directly from Node.js / TypeScript |
| `itemDatabaseSources.json` | Same data in plain JSON — usable from any language without a JavaScript runtime |
| `Classic Era Cache.json` | Scraped item drops for Classic Era (1,566 items) |
| `TBC Classic Cache.json` | Scraped item drops for TBC Classic (1,123 items) |
| `Wrath Classic Cache.json` | Scraped item drops for Wrath Classic (2,056 items) |
| `Cata Classic Cache.json` | Scraped item drops for Cataclysm Classic (1,149 items) |
| `MoP Classic Cache.json` | Scraped item drops for MoP Classic (2,499 items) |

---

## `itemDatabaseSources.js` / `itemDatabaseSources.json`

These two files are different encodings of the same data: every dungeon, raid, and content phase tracked by the tool across all five expansions. Use `.js` if you are already in a Node.js / TypeScript environment; use `.json` for everything else.

### Source object structure

```jsonc
{
  "key":       "classic era::raid::naxxramas",  // Stable lowercase composite ID
  "expansion": "Classic Era",                   // Expansion name
  "name":      "Naxxramas",                     // Human-readable instance name
  "type":      "Raid",                          // "Raid" or "Dungeon"
  "phase":     6                                // Content phase (1–6)
}
```

**`key`** is always `"<expansion>::<type>::<name>"` in lowercase. It matches the `sourceKeys` values inside the item cache files, making it the primary join field between the two datasets.

### Coverage summary

| Expansion | Dungeons | Raids | Total sources |
|---|---|---|---|
| Classic Era | 20 | 7 | 27 |
| TBC Classic | 16 | 9 | 25 |
| Wrath Classic | 16 | 8 | 24 |
| Cata Classic | 14 | 5 | 19 |
| MoP Classic | 9 | 5 | 14 |

---

## Item cache files (`*Cache.json`)

Each cache file is a JSON array of item objects for one expansion, scraped from Wowhead.

### Item object structure

```jsonc
{
  "itemId": 23033,                         // Wowhead numeric item ID
  "name": "Icy Scale Coif",               // Item display name
  "itemUrl": "https://www.wowhead.com/classic/item=23033",  // Wowhead link
  "itemExpansion": "Classic Era",          // Expansion name
  "iconName": "inv_helmet_20",             // Wowhead icon slug (see Icon URLs below)
  "sourceKeys": [                          // Keys matching itemDatabaseSources entries
    "classic era::raid::naxxramas"
  ],
  "sourceLabels": ["Naxxramas"],           // Human-readable source name(s)
  "sourceTypes": ["Raid"],                 // "Raid", "Dungeon", or "Crafted"
  "sourcePhases": [6],                     // Content phase(s) the source is available in
  "bossNames": ["Heigan the Unclean"],     // Boss(es) that drop this item (empty for crafted)
  "discoveredCharacters": [],              // Reserved — always empty in these standalone files
  "tooltipHtml": "<table>…</table>",       // Raw Wowhead tooltip HTML
  "lastUpdatedAt": "2026-05-16T04:26:52.000Z"  // ISO 8601 timestamp of last scrape
}
```

**Field notes:**
- `sourceKeys` values are the same composite keys used in `itemDatabaseSources`, enabling a direct join between the two datasets.
- `sourceTypes` may include `"Crafted"` for profession-crafted items that have no boss drop.
- `tooltipHtml` contains the full Wowhead tooltip markup: item level, stats, set bonuses, drop chance. Parse it if you need stat data. The `<b class="qN">` tag carries the quality tier (q0 = poor → q5 = legendary).
- `discoveredCharacters` is always empty in these files. It is populated only within the WoW Classic Raid Tool application when a character is found wearing the item.

### Icon URLs

Combine `iconName` with the Wowhead CDN:

```
https://wow.zamimg.com/images/wow/icons/small/<iconName>.jpg   (18 × 18 px)
https://wow.zamimg.com/images/wow/icons/medium/<iconName>.jpg  (36 × 36 px)
https://wow.zamimg.com/images/wow/icons/large/<iconName>.jpg   (56 × 56 px)
```

Example: `"iconName": "inv_helmet_20"` →
`https://wow.zamimg.com/images/wow/icons/large/inv_helmet_20.jpg`

### Wowhead expansion subdomains

| Expansion | Wowhead base URL |
|---|---|
| Classic Era | `https://www.wowhead.com/classic/` |
| TBC Classic | `https://www.wowhead.com/tbc/` |
| Wrath Classic | `https://www.wowhead.com/wotlk/` |
| Cata Classic | `https://www.wowhead.com/cata/` |
| MoP Classic | `https://www.wowhead.com/mop/` |

---

## Joining sources to items

The `key` field in `itemDatabaseSources` matches the entries in `sourceKeys` on each item. This lets you look up every item from a given instance, or annotate each item with its full source metadata (phase, type, etc.):

```js
// JavaScript example — same pattern in every language below
const sources = require('./itemDatabaseSources.json');
const items   = require('./Wrath Classic Cache.json');

// Build a map of key → source object for O(1) lookups
const sourceMap = Object.fromEntries(sources.map(s => [s.key, s]));

// Annotate every item with its primary source object
const annotated = items.map(item => ({
  ...item,
  primarySource: sourceMap[item.sourceKeys[0]] ?? null,
}));

// All Phase 2 raid items
const phase2Raids = items.filter(item =>
  item.sourceKeys.some(k => sourceMap[k]?.phase === 2 && sourceMap[k]?.type === 'Raid')
);
```

---

## Language examples

### JavaScript / Node.js

#### Working with the source list (`.js` module)

```js
const { ITEM_DATABASE_SOURCES } = require('./itemDatabaseSources.js');

// All WotLK raid sources, sorted by phase
const wrathRaids = ITEM_DATABASE_SOURCES
  .filter(s => s.expansion === 'Wrath Classic' && s.type === 'Raid')
  .sort((a, b) => a.phase - b.phase);

wrathRaids.forEach(s => console.log(`Phase ${s.phase}: ${s.name}`));
// Phase 1: Naxxramas
// Phase 1: The Obsidian Sanctum
// ...
// Phase 4: Icecrown Citadel

// Unique phases for an expansion
const phases = [...new Set(
  ITEM_DATABASE_SOURCES
    .filter(s => s.expansion === 'TBC Classic')
    .map(s => s.phase)
)].sort();
console.log(phases); // [1, 2, 3, 4, 5]
```

#### Working with the cache files

```js
const fs = require('fs');

const sources = JSON.parse(fs.readFileSync('./itemDatabaseSources.json', 'utf-8'));
const items   = JSON.parse(fs.readFileSync('./Wrath Classic Cache.json', 'utf-8'));

const sourceMap = Object.fromEntries(sources.map(s => [s.key, s]));

// All Ulduar drops
const ulduarItems = items.filter(i =>
  i.sourceKeys.includes('wrath classic::raid::ulduar')
);

// Find a specific item by ID
const shadowmourne = items.find(i => i.itemId === 49623);
console.log(shadowmourne?.name); // "Shadowmourne"

// Group all items by boss name
const byBoss = {};
for (const item of items) {
  for (const boss of item.bossNames) {
    (byBoss[boss] ??= []).push(item.name);
  }
}

// Icon URL helper
const iconUrl = (item, size = 'medium') =>
  `https://wow.zamimg.com/images/wow/icons/${size}/${item.iconName}.jpg`;
```

---

### TypeScript

```ts
import { readFileSync } from 'fs';

// ── Types ──────────────────────────────────────────────────────────────────

interface Source {
  key: string;
  expansion: string;
  name: string;
  type: 'Raid' | 'Dungeon';
  phase: number;
}

interface WowItem {
  itemId: number;
  name: string;
  itemUrl: string;
  itemExpansion: string;
  iconName: string;
  sourceKeys: string[];
  sourceLabels: string[];
  sourceTypes: string[];
  sourcePhases: number[];
  bossNames: string[];
  discoveredCharacters: string[];
  tooltipHtml: string;
  lastUpdatedAt: string;
}

// ── Load ───────────────────────────────────────────────────────────────────

const sources: Source[] = JSON.parse(
  readFileSync('./itemDatabaseSources.json', 'utf-8')
);
const items: WowItem[] = JSON.parse(
  readFileSync('./Wrath Classic Cache.json', 'utf-8')
);

const sourceMap = new Map(sources.map(s => [s.key, s]));

// ── Queries ────────────────────────────────────────────────────────────────

// All Phase 4 items (Icecrown Citadel era)
const phase4 = items.filter(item =>
  item.sourceKeys.some(k => sourceMap.get(k)?.phase === 4)
);

// Icon URL helper
const iconUrl = (item: WowItem, size: 'large' | 'medium' | 'small' = 'medium'): string =>
  `https://wow.zamimg.com/images/wow/icons/${size}/${item.iconName}.jpg`;

// Extract item level from tooltipHtml
const itemLevelRegex = /Item Level.*?(\d+)/;
const getItemLevel = (item: WowItem): number | undefined => {
  const m = item.tooltipHtml.match(itemLevelRegex);
  return m ? parseInt(m[1], 10) : undefined;
};
```

> **Tip:** If you're in a Node.js / TypeScript project you can import `itemDatabaseSources.js` directly instead of the JSON file:
> ```ts
> import { ITEM_DATABASE_SOURCES } from './itemDatabaseSources.js';
> ```

---

### Python

```python
import json

# Load source definitions
with open("itemDatabaseSources.json", encoding="utf-8") as f:
    sources: list[dict] = json.load(f)

# Load item cache
with open("Wrath Classic Cache.json", encoding="utf-8") as f:
    items: list[dict] = json.load(f)

# Build a lookup dict: key → source object
source_map: dict[str, dict] = {s["key"]: s for s in sources}

# ── Source queries ─────────────────────────────────────────────────────────

# All Classic Era raids grouped by phase
from itertools import groupby
era_raids = [s for s in sources if s["expansion"] == "Classic Era" and s["type"] == "Raid"]
era_raids.sort(key=lambda s: s["phase"])
for phase, group in groupby(era_raids, key=lambda s: s["phase"]):
    print(f"Phase {phase}: {', '.join(s['name'] for s in group)}")

# ── Item queries ───────────────────────────────────────────────────────────

# Build a lookup dict by itemId
by_id: dict[int, dict] = {i["itemId"]: i for i in items}
item = by_id.get(49623)
print(item["name"] if item else "not found")  # "Shadowmourne"

# All Ulduar drops
ulduar = [i for i in items if "wrath classic::raid::ulduar" in i["sourceKeys"]]

# Annotate items with phase from source map
for item in items:
    primary_key = item["sourceKeys"][0] if item["sourceKeys"] else None
    item["_phase"] = source_map[primary_key]["phase"] if primary_key in source_map else None

# Items sorted by phase, then name
items_by_phase = sorted(
    (i for i in items if i["_phase"] is not None),
    key=lambda i: (i["_phase"], i["name"])
)

# Icon URL
def icon_url(item: dict, size: str = "medium") -> str:
    return f"https://wow.zamimg.com/images/wow/icons/{size}/{item['iconName']}.jpg"

# Extract item level from tooltipHtml
import re
def get_item_level(item: dict) -> int | None:
    m = re.search(r"Item Level.*?(\d+)", item["tooltipHtml"])
    return int(m.group(1)) if m else None
```

---

### Rust

```rust
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs};

#[derive(Debug, Deserialize, Serialize)]
struct Source {
    key: String,
    expansion: String,
    name: String,
    #[serde(rename = "type")]
    source_type: String,
    phase: u8,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct WowItem {
    item_id: u32,
    name: String,
    item_url: String,
    item_expansion: String,
    icon_name: String,
    source_keys: Vec<String>,
    source_labels: Vec<String>,
    source_types: Vec<String>,
    source_phases: Vec<u8>,
    boss_names: Vec<String>,
    discovered_characters: Vec<String>,
    tooltip_html: String,
    last_updated_at: String,
}

fn icon_url(item: &WowItem, size: &str) -> String {
    format!(
        "https://wow.zamimg.com/images/wow/icons/{}/{}.jpg",
        size, item.icon_name
    )
}

fn main() {
    let sources: Vec<Source> = serde_json::from_str(
        &fs::read_to_string("itemDatabaseSources.json").unwrap()
    ).unwrap();

    let items: Vec<WowItem> = serde_json::from_str(
        &fs::read_to_string("Wrath Classic Cache.json").unwrap()
    ).unwrap();

    // Build source map: key → Source
    let source_map: HashMap<&str, &Source> =
        sources.iter().map(|s| (s.key.as_str(), s)).collect();

    // All phase 4 items
    let phase4: Vec<&WowItem> = items.iter()
        .filter(|i| i.source_keys.iter()
            .any(|k| source_map.get(k.as_str()).map_or(false, |s| s.phase == 4)))
        .collect();

    println!("Phase 4 items: {}", phase4.len());

    // All WotLK raid sources
    let wrath_raids: Vec<&Source> = sources.iter()
        .filter(|s| s.expansion == "Wrath Classic" && s.source_type == "Raid")
        .collect();

    for src in &wrath_raids {
        println!("Phase {}: {}", src.phase, src.name);
    }

    // Find item by ID
    if let Some(item) = items.iter().find(|i| i.item_id == 49623) {
        println!("Found: {} — {}", item.name, icon_url(item, "large"));
    }
}
```

`Cargo.toml` dependencies:
```toml
[dependencies]
serde      = { version = "1", features = ["derive"] }
serde_json = "1"
```

---

### C# (.NET)

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;

// ── Types ──────────────────────────────────────────────────────────────────

public record Source(
    [property: JsonPropertyName("key")]       string Key,
    [property: JsonPropertyName("expansion")] string Expansion,
    [property: JsonPropertyName("name")]      string Name,
    [property: JsonPropertyName("type")]      string Type,
    [property: JsonPropertyName("phase")]     int Phase
);

public record WowItem(
    [property: JsonPropertyName("itemId")]               int ItemId,
    [property: JsonPropertyName("name")]                 string Name,
    [property: JsonPropertyName("itemUrl")]              string ItemUrl,
    [property: JsonPropertyName("itemExpansion")]        string ItemExpansion,
    [property: JsonPropertyName("iconName")]             string IconName,
    [property: JsonPropertyName("sourceKeys")]           List<string> SourceKeys,
    [property: JsonPropertyName("sourceLabels")]         List<string> SourceLabels,
    [property: JsonPropertyName("sourceTypes")]          List<string> SourceTypes,
    [property: JsonPropertyName("sourcePhases")]         List<int> SourcePhases,
    [property: JsonPropertyName("bossNames")]            List<string> BossNames,
    [property: JsonPropertyName("discoveredCharacters")] List<string> DiscoveredCharacters,
    [property: JsonPropertyName("tooltipHtml")]          string TooltipHtml,
    [property: JsonPropertyName("lastUpdatedAt")]        string LastUpdatedAt
);

// ── Load ───────────────────────────────────────────────────────────────────

var sources = JsonSerializer.Deserialize<List<Source>>(
    File.ReadAllText("itemDatabaseSources.json"))!;

var items = JsonSerializer.Deserialize<List<WowItem>>(
    File.ReadAllText("Wrath Classic Cache.json"))!;

var sourceMap = sources.ToDictionary(s => s.Key);

// ── Queries ────────────────────────────────────────────────────────────────

// All WotLK raid sources grouped by phase
var byPhase = sources
    .Where(s => s.Expansion == "Wrath Classic" && s.Type == "Raid")
    .GroupBy(s => s.Phase)
    .OrderBy(g => g.Key);

foreach (var group in byPhase)
    Console.WriteLine($"Phase {group.Key}: {string.Join(", ", group.Select(s => s.Name))}");

// All Phase 2 items (Ulduar)
var phase2Items = items.Where(i =>
    i.SourceKeys.Any(k => sourceMap.TryGetValue(k, out var s) && s.Phase == 2)
).ToList();

// Icon URL helper
string IconUrl(WowItem item, string size = "medium") =>
    $"https://wow.zamimg.com/images/wow/icons/{size}/{item.IconName}.jpg";

// Combine all expansions
var allItems = new[] {
    "Classic Era Cache.json", "TBC Classic Cache.json",
    "Wrath Classic Cache.json", "Cata Classic Cache.json", "MoP Classic Cache.json"
}.SelectMany(path =>
    JsonSerializer.Deserialize<List<WowItem>>(File.ReadAllText(path))!
).ToList();
```

---

### Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "os"
    "sort"
)

type Source struct {
    Key       string `json:"key"`
    Expansion string `json:"expansion"`
    Name      string `json:"name"`
    Type      string `json:"type"`
    Phase     int    `json:"phase"`
}

type WowItem struct {
    ItemID               int      `json:"itemId"`
    Name                 string   `json:"name"`
    ItemURL              string   `json:"itemUrl"`
    ItemExpansion        string   `json:"itemExpansion"`
    IconName             string   `json:"iconName"`
    SourceKeys           []string `json:"sourceKeys"`
    SourceLabels         []string `json:"sourceLabels"`
    SourceTypes          []string `json:"sourceTypes"`
    SourcePhases         []int    `json:"sourcePhases"`
    BossNames            []string `json:"bossNames"`
    DiscoveredCharacters []string `json:"discoveredCharacters"`
    TooltipHTML          string   `json:"tooltipHtml"`
    LastUpdatedAt        string   `json:"lastUpdatedAt"`
}

func loadJSON[T any](path string) ([]T, error) {
    data, err := os.ReadFile(path)
    if err != nil { return nil, err }
    var out []T
    return out, json.Unmarshal(data, &out)
}

func iconURL(item WowItem, size string) string {
    return fmt.Sprintf("https://wow.zamimg.com/images/wow/icons/%s/%s.jpg", size, item.IconName)
}

func main() {
    sources, _ := loadJSON[Source]("itemDatabaseSources.json")
    items, _   := loadJSON[WowItem]("Wrath Classic Cache.json")

    // Build source map
    sourceMap := make(map[string]Source, len(sources))
    for _, s := range sources {
        sourceMap[s.Key] = s
    }

    // All WotLK raid sources sorted by phase
    var raids []Source
    for _, s := range sources {
        if s.Expansion == "Wrath Classic" && s.Type == "Raid" {
            raids = append(raids, s)
        }
    }
    sort.Slice(raids, func(i, j int) bool { return raids[i].Phase < raids[j].Phase })
    for _, s := range raids {
        fmt.Printf("Phase %d: %s\n", s.Phase, s.Name)
    }

    // All Ulduar drops
    for _, item := range items {
        for _, k := range item.SourceKeys {
            if k == "wrath classic::raid::ulduar" {
                fmt.Println(item.Name, "—", iconURL(item, "medium"))
                break
            }
        }
    }

    // Items with their phase annotated
    for _, item := range items {
        if len(item.SourceKeys) > 0 {
            if src, ok := sourceMap[item.SourceKeys[0]]; ok {
                _ = src.Phase // use as needed
            }
        }
    }
}
```

---

## Combining all expansions

All cache files share the same schema and can be loaded together:

```python
# Python — same pattern applies in every language
import json, glob

all_items = []
for path in sorted(glob.glob("*Cache.json")):
    with open(path, encoding="utf-8") as f:
        all_items.extend(json.load(f))

print(f"Total items: {len(all_items)}")

# Deduplicate by (itemId, itemExpansion) — some names appear in multiple expansions
seen = set()
unique = []
for item in all_items:
    key = (item["itemId"], item["itemExpansion"])
    if key not in seen:
        seen.add(key)
        unique.append(item)

print(f"Unique items: {len(unique)}")
```

---

## Notes

- Cache files are scraped periodically. `lastUpdatedAt` on each item reflects when its tooltip was last fetched from Wowhead.
- `tooltipHtml` is raw Wowhead markup and is not a stable API — Wowhead may alter its format.
- Some instance names appear in more than one expansion (e.g. Naxxramas in Classic Era and Wrath Classic, Scholomance in Classic Era and MoP Classic). Always filter by `expansion` or use the full `key` to distinguish them.
- `itemDatabaseSources.js` is a CommonJS module (not ES module). In Node.js use `require()`, not `import`. In TypeScript, ensure `allowJs: true` and `esModuleInterop: true` are set in `tsconfig.json`, or import the `.json` file instead.
