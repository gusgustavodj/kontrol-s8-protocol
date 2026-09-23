# HID OUT / LEDs OUT

This derived reference is not a new canonical specification. Fields come from M286/M296 matrices and a coverage diagnosis. Functional bindings do not prove an individual light response.

| Group | Report | Documented field/offset | Evidence limit |
| --- | --- | --- | --- |
| PLAY L/R | `0x80`/`0x81` | 59 (raw 60), OFF/DIM/ON | Field confirmed; physical scope partial |
| CUE L/R | `0x80`/`0x81` | 58 (raw 59) | Field confirmed; physical scope partial |
| FLUX L/R | `0x80`/`0x81` | 52 (raw 53) | Field confirmed; physical scope partial |
| SYNC L/R | `0x80`/`0x81` | 57 (raw 58) | Android/Windows policy differs; physical scope pending |
| LOOP button/ring | `0x80`/`0x81` | 47 and 64–67 (raw +1) | Field confirmed; specific test pending |
| Hotcue RGB | `0x80`/`0x81` | 24-byte block | Structure confirmed; physical RGB/BGR order pending |
| FX unit/slots | `0x80`/`0x81` | 25–28 | Visual association approved; individual brightness pending |
| FX assign/Quantize/SNAP | `0x82` | 46–51 | Fields present; physical policies incomplete |
| PFL | F4 Feature SET_REPORT | `F4 26 SS`, masks A=01/B=02/C=04/D=08 | Transport observed; a PCAP does not measure light |
| DIRECT THRU | F4 Feature SET_REPORT | `F4 24 SS`, same masks | Separate family; native mode inconclusive |
| SLOT_FILTER | `0x80`/`0x81` | 40–43 | Physical association gap |

F4/26 and F4/24 use EP0 control OUT, `wIndex=5`, `wValue=0x03F4`, with cumulative mask `SS`. Full physical mapping, colors and combinations are not proven. See [`known-limitations.md`](known-limitations.md) and [`evidence-keys.md`](evidence-keys.md).
