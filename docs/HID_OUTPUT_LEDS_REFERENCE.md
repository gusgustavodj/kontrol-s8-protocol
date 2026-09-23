# HID OUTPUT and LED data

The data files below keep transport inventories separate. Their rows no longer include capture names, historical row numbers, private source paths or mission labels. Protocol values, report IDs and offsets are retained as recorded. A software binding or observed USB command does not, by itself, establish that a physical LED changed.

| Inventory | Records | Scope |
| --- | ---: | --- |
| [`HID_OUTPUT_LEDS.csv`](../data/HID_OUTPUT_LEDS.csv) / [JSON](../data/HID_OUTPUT_LEDS.json) | 110 | HID Output reports only (`0x80`–`0x82`). |
| [`HID_FEATURE_OUTPUTS.csv`](../data/HID_FEATURE_OUTPUTS.csv) / [JSON](../data/HID_FEATURE_OUTPUTS.json) | 2 | Feature reports, kept separate from interrupt Output reports. |
| [`USB_CONTROL_OUTPUTS.csv`](../data/USB_CONTROL_OUTPUTS.csv) / [JSON](../data/USB_CONTROL_OUTPUTS.json) | 8 | USB control OUT transfers. |
| [`DISPLAY_INITIALIZATION.csv`](../data/DISPLAY_INITIALIZATION.csv) / [JSON](../data/DISPLAY_INITIALIZATION.json) | 2 | Optional display initialization records; not LED commands. |
| [`PAD_COLOR_PALETTE.csv`](../data/PAD_COLOR_PALETTE.csv) / [JSON](../data/PAD_COLOR_PALETTE.json) | 17 | Reusable transmitted three-byte values for the 16 addressed HOTCUE pads. |
| [`ATLAS_OUTPUT_STATE_INDEX.csv`](../data/ATLAS_OUTPUT_STATE_INDEX.csv) / [JSON](../data/ATLAS_OUTPUT_STATE_INDEX.json) | 154 | Read-only index of the approved Atlas OUTPUT fields and their documented values; not an additional command population. |

The four public transport inventories account for 122 addressed source rows. The 90 former MIDI mapping declarations have no HID report address or usable activation bytes, so they are preserved only in the private mission references. They are not physical OUTPUT commands. The 16 pad rows in `HID_OUTPUT_LEDS` reference the single 17-entry palette; the table keeps one address row per physical pad, with payload offsets `3(n−1)` through `3(n−1)+2` and raw offsets one byte higher. The index exposes the approved Atlas state values for DECK white/blue, REMIX, FREEZE, transport, FX, mixer, encoder rings, touchstrip fields and other addressed indicators without implying that every field was independently tested. An empty value means no code was established; `0x00`, `0x14` and `0x7F` remain distinct. Intensity values do not establish new colors. See [`known-limitations.md`](known-limitations.md) and [`evidence-keys.md`](evidence-keys.md).
