# USB tables

Observed descriptors do not prove functional transfers. EP0 is a device-wide bidirectional CONTROL endpoint with MPS 64; IF0 and IF4 declare no own endpoints. [U01–U04]

| IF | alt | Class/subclass/protocol | Endpoint | Type | Direction | MPS | Function / evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 01/01/20 | — | — | — | — | UAC2 Audio Control via shared EP0 [U02] |
| 1 | 0 | 01/02/20 | — | — | — | — | Playback zero bandwidth [U02] |
| 1 | 1 | 01/02/20 | `0x01` | ISOCHRONOUS | HOST_TO_S8 | 112 | Playback, 4 channels, 24-bit in 4-byte subslot [U01;U02] |
| 1 | 1 | 01/02/20 | `0x81` | ISOCHRONOUS | S8_TO_HOST | 4 | Feedback described; data not proven [U01;U02] |
| 2 | 0 | 01/02/20 | — | — | — | — | Capture zero bandwidth [U02] |
| 2 | 1 | 01/02/20 | `0x82` | ISOCHRONOUS | S8_TO_HOST | 280 | Capture described, 10 channels, 24-bit in 4-byte subslot [U01;U02] |
| 3 | 0 | 01/03/00 | `0x02` | BULK | HOST_TO_S8 | 512 | MIDI Streaming 1.0; messages unvalidated [U01;U02] |
| 3 | 0 | 01/03/00 | `0x83` | BULK | S8_TO_HOST | 512 | MIDI Streaming 1.0; messages unvalidated [U01;U02] |
| 4 | 0 | FE/01/01 | — | — | — | — | DFU runtime via shared EP0; out of scope [U01;U02] |
| 5 | 0 | 03/00/00 | `0x84` | INTERRUPT | S8_TO_HOST | 64 | HID IN [U01;U02;U03] |
| 5 | 0 | 03/00/00 | `0x03` | INTERRUPT | HOST_TO_S8 | 64 | HID OUT [U01;U02;U03] |
| 6 | 0 | FF/BD/00 | `0x04` | BULK | HOST_TO_S8 | 512 | Display [U01;U02;D01] |

There are nine distinct interface/alternate combinations: 0/0, 1/0, 1/1, 2/0, 2/1, 3/0, 4/0, 5/0 and 6/0. Additional endpoints are not additional interfaces. Descriptor intervals: IF1/`0x01`=1, IF1/`0x81`=4, IF2/`0x82`=1, IF5/`0x84`=3, IF5/`0x03`=4. Do not infer a physical interval without considering speed and transfer type. [U02;U03]

[CSV](../data/usb-interfaces-endpoints.csv) · [JSON](../data/usb-interfaces-endpoints.json)
