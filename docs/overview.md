# S8 Interoperability Specification

This independent reference is prepared for publication review. Original documentation and tables are CC BY 4.0 within creator rights; Atlas code is MIT. Publication itself remains subject to the owner’s later repository-creation and upload decision.

## Part I — Foundations

### §1. Scope, Non-Goals, and Conventions

This manual describes known protocols for the controls and displays of the Native Instruments Traktor Kontrol S8 to enable independent implementations. USB organization and audio separation define the boundaries for combining the subsystems. This is independent documentation, without affiliation, endorsement, or official support from Native Instruments or Mixxx. It does not promise complete compatibility, distribute drivers or firmware, or define the functions of DJ software. [E01]

Hexadecimal is indicated by `0x` for fields and by digit pairs in payloads; unprefixed numbers are decimal. Offsets are zero-based. In HID reports, byte 0 is the Report ID and is included in both the offset and length. Offset without Report ID = documented offset − 1. Check whether the host API adds the ID to avoid adding it twice. Endianness is specified per field/family; there is no single byte order for the entire device. Masks select bits; do not assign meaning to the remaining bits. [H01;L02]

Evidence statuses: `DESCRIPTOR_OBSERVED` describes what the device declared; `OBSERVED` describes recorded bytes or sequences; `PHYSICALLY_VALIDATED` describes the reported physical result in the specified environment; `EXPERIMENTAL_IMPLEMENTATION` denotes existing software without treating its existence as physical proof; `ADOPTED_CONTRACT` denotes an implementation choice without asserting a universal limit; `UNKNOWN/UNRESOLVED` denotes unknown data or semantics. `DOCUMENTARY_DERIVATION` identifies a calculation, synthetic example, or requirement proposed by this edition, without an additional experiment. [E01]

Keys such as H01 and D01 associate statements with technical evidence groups. The internal matrix connects each key and data row to original sources and hashes. This candidate excludes private documents, paths, and capture hashes. Omitting a private source does not turn a hypothesis into fact.

### §2. USB Identification and Topology

Observed composite configuration: VID `0x17CC`, PID `0x1370`, bcdDevice `0x0050` (0.50), bcdUSB `0x0200`, device class/subclass/protocol `EF/02/01`. A 432-byte self-powered configuration, seven unique interfaces, and nine interface/alternate combinations were described. EP0 is bidirectional CONTROL, MPS 64, shared by the device; it is not a separate endpoint declared by IF0 or IF4. bcdDevice does not establish firmware version. Firmware, SKU, and hardware revision were not stated. Do not extrapolate the same topology to all revisions. Filter by VID/PID and confirm descriptors before selecting the transport. [U01–U04]

The [complete IF0–IF6 table](usb-tables.md), in [CSV](../data/usb-interfaces-endpoints.csv) and [JSON](../data/usb-interfaces-endpoints.json), contains classes, subclasses, protocols, alternates, endpoints, directions, types, and MPS. IF1/IF2 have alt 0 without endpoints and alt 1 with audio; IF3 is MIDI Streaming 1.0; IF4 is DFU runtime; IF5 is HID; IF6 is the vendor-specific display interface. The presence of MIDI/DFU in a descriptor does not prove functional operation; DFU is not part of this manual's implementation. [U01;U02]

Descriptors, transfers, and actual capabilities are distinct kinds of evidence. Enumeration immediately following physical connection is not fully documented; SET_ADDRESS and the electrical connection event were not observed in the historical excerpt. Do not infer a universal configuration sequence from that window. [U05]

## Part II — Controls

## Part II — Controls

### §3. HID Report Format

IF5 uses `0x84 INTERRUPT IN` and `0x03 INTERRUPT OUT`, both MPS 64; feature reports use EP0. MPS is not the report length. The inventory records a 41-byte Report ID 1 in the historical family and a 109-byte Report ID 1 in a prefix-compatible carrier. Bytes 0..40 of that carrier form the canonical view; bytes 41..108 remain unknown raw data and are not classified as padding. A 109-byte Report ID 2 contains documented analog fields. Report 1 compatibility does not automatically extend to report 2. [U03;H01;H02]

Select the family by Report ID and the length actually received; ensure that offset + width lies within the report, and consult the entry's mask/endianness. Byte 0 is 1 or 2 in the respective families. Other known fields appear in the table; do not assign conjectured meanings to undocumented regions. Without a located raw HID report descriptor, this edition does not establish every accepted report, its type, or maximum length. [H01;H02]

Known widths range from one to two bytes. A known field without a selective mask consumes 0xFF for each byte of its width. In a GAP, null mask/width does not define a field. Touch, push, and rotary are independent signals of the same assembly. [H01]

### §4. Physical Control Inventory

The [complete inventory](hid-tables.md) contains 181 entries: 165 from M255 and 16 display side buttons incorporated in M259. These are physical signals; touch, press and rotation may occupy separate entries. The successor distribution is ANALOG 49, BUTTON 91, ENCODER_RELATIVE 5, PUSH 4, TOUCH 30 and TOUCHSTRIP_POSITION 2. Two touchstrip positions remain GAP; this edition does not claim complete resolution or functional coverage of every signal. [H01;H02]

This inventory is shared across platforms: it is the same signal list that the host decodes. In Windows, identity and fields derive from a consolidated physical capture—163 of 165 historical signals were resolved, with 100 confirmed, 1 corrected with evidence and 62 added in a later capture—and the 16 display side buttons were confirmed in a separate physical capture before entering the successor baseline. A physical mapping is not functional validation: the classification of 162 controls as functional comes from an offline implementation, not testing on the device. Deltas later than these baselines are outside this version's data scope. [H01;H02;L04;P01]

[CSV](../data/HID_INPUT.csv) and [JSON](../data/HID_INPUT.json) contain identity, label, group/side, assembly, type, report/length, offsets with/without the Report ID, width, masks, shift/modulus, encoding, endianness, available values/edges, direction, observed range, touch/push associations, behavior, status, ambiguity and evidence key. Null means undocumented, never zero. [H01;H02]

`TstTouchstripLeft/Right` have identities and associated touch signals, but no canonical position binding. `EncTempoMixer` retains its historical reading in the table; §6 presents the later interpretation. The table does not change the authority of its baselines. The 32 combinations of display side buttons with/without SHIFT are an application logical contract, not 32 additional controls or new USB protocol commands. [H01;H02;H03]

### §5. HID Encodings

`BITFIELD`: extract bits using the mask and apply the entry's shift. For known binary entries, normalized 0 is inactive and 1 is active; PRESS is inactive→active and RELEASE is active→inactive. Compare samples to emit edges without repeating PRESS for a bit held down. The first sample establishes state; generating an initial edge is a host decision. Touch is not part of an analog/counter value. [H01;DOCUMENTARY_DERIVATION]

`ABSOLUTE_POSITION`: read the entry's width and endianness. For two-byte unsigned LE, raw = byte[offset] + 256 × byte[offset+1]; for one byte, raw = byte[offset]. Direction and ranges are observations, not a musical scale, calibration, or guaranteed endpoints. KnbLowCMixer and KnbLowDMixer have an observed width of one byte; do not generalize the two-byte width of other EQ controls. Faders also have different widths/directions. [H01;H04;DOCUMENTARY_DERIVATION]

`MASKED_WRAP_COUNTER`: extract `v = (raw & mask) >> shift` and retain the preceding state of that same field. With modulus 16, 15→0 may represent +1; 0→15 may represent −1. BROWSE LEFT/RIGHT: report 1/109, bytes 1/2, mask 0xF0, shift 4, modulus 16, with CW decreasing. LOOP LEFT/RIGHT: same bytes, mask 0x0F, shift 0, modulus 16, with CW increasing. The masks are independent. [H01;H04]

Proposed documentary normalization: `d = (new − previous) mod 16`; 1..7 represents a short positive advance; 9..15 may represent d−16; d=8 has no unique direction. Lost samples can prevent direction recovery; do not assume one detent per jump. Shortest-path interpretation and first-sample policy are host decisions, without new physical validation. The historical signedness annotation for BROWSE RIGHT does not change its wrapping-counter encoding into a signed delta of the raw byte. [H01;DOCUMENTARY_DERIVATION]

`INCREMENT_DECREMENT_CODES` retains the historical TEMPO codes, CW 247/CCW 248. Do not apply them to other encoders or arbitrary reports. A counter alone does not define BPM, pitch, clock, or musical function. [H01;H04;T01]

### §6. TEMPO ROTARY

Later observation: Report ID 1, 109 bytes, byte 3 including ID, mask `0x0F`, shift 0, modulus 16, CW +1, CCW −1. Extract the low nibble; the other bits are not part of this counter. Apply the wrapping delta as in §5. Synthetic examples: 0x0F→0x00 is +1 and 0x00→0x0F is −1 under a short-step interpretation; these are not physical trials in this edition. [T01;DOCUMENTARY_DERIVATION]

historical-hid-baseline/baseline-hid-capture records the entire byte 3 with codes 247/248. led-capture later records the masked counter; tempo-reconciliation documents implementation and offline replay. The table retains the historical reading; this section describes the later reading, with the discrepancy made explicit. This edition does not normatively revoke the previous reading; tempo-reconciliation is not normative authority. No musical unit has been established, and no value authorizes automatic writing of BPM/pitch/clock. Private identifiers and hashes of later evidence are excluded from the candidate. [H01;H04;T01;T02]

### §7. LEDs and Light Feedback

Keep the families separate: CUE/PFL uses `F4 26 SS`; Direct Thru/Live Input uses `F4 24 SS`. Masks A=0x01, B=0x02, C=0x04 and D=0x08 apply to both. SS is the cumulative family mask, not a channel ID. Individual OFF was observed as SS=0 when no other state remains active. [L01]

Observed transport: EP0 USB Control OUT, HID Feature SET_REPORT on IF5, bmRequestType=0x21, bRequest=0x09, wValue=0x03F4, wIndex=5, wLength=33. Full USB payload: F4, family 0x26 or 0x24, SS and 30 zeros. The F4 ID appears once. Derived example, PFL A with no other channels: `F4 26 01` + 30×`00`; this does not prove independent transmission. [L01;L02]

To preserve other channels, the proposed logical OFF operation is `SS_new = SS_previous & ~channel_mask`, limited to the four known masks; ON uses OR. This derives from the cumulative state and is not a test of all 16 combinations in each family. [L01;DOCUMENTARY_DERIVATION]

Correlated state was observed at zero-based index 38 of 41-byte IN reports; it does not replace offsets from the 109-byte baseline reports. The 32-byte F4 cited in experimental implementation is a different contract, without Android physical proof; it must not be confused with the 33-byte USB payload. No complete payload is recommended here for the additional contract. [L01;L03]

F4/26 and F4/24 were observed in traffic and the owner reported light response; USB bytes do not measure light. Independent transmission of these families was not validated. PLAY/CUE/FLUX had partial Windows physical feedback on both A/B sides: PLAY follows playback/pause, CUE lights while pressed, and FLUX follows activation. This does not complete the LED map. SYNC, LOOP, pads, FX, SNAP and QUANTIZE do not have a sufficiently isolated physical map. Native Direct Thru remains inconclusive. No Android physical validation of F4 is available. [L01;L04;P01]

### §8. Concurrent Access and Ownership

Keep audio IF0–IF2, HID IF5, and display IF6 separate. One owner of IF5 should centralize interrupt IN/OUT and feature reports; IF6 should have a coordinated transport owner while preserving audio drivers and ownership. This is an architectural requirement derived from observed boundaries, not a guarantee of universal stability. Passive attachment does not demonstrate functional coexistence. [C01;C02;U02;W01]

On Android, `UsbDeviceConnection.requestWait()` returns completions across the entire connection. An IF5 reader consumed an IF6 write completion and was followed by a timeout. Independent consumers cannot assume that completions belong locally to their endpoint. A production solution would need to coordinate requests/completions, route them by identity, retain buffers until confirmed completion/cancellation, and invalidate state after detach. This is a documentary proposal, not a validated solution. [C01;DOCUMENTARY_DERIVATION]

Mitigation demonstrated in diagnostics: disable the continuous IF5 reader after startup, leaving IF6 exclusive during the display test. No proprietary transfers remained active in audio after startup. This does not demonstrate simultaneous continuous HID + displays + audio. A forced IF5 claim was used in experimental startup; another attempt with IF5 under usbhid failed on F8. Do not apply forced claiming to audio interfaces as a generic solution. [C01;C02;I02;I03;P01]

## Part III — Displays

## Part III — Displays

### §9. IF6 Transport

IF6 is `FF/BD/00`, endpoint `0x04`, BULK OUT, MPS 512. Only host→S8 is documented, with no display IN endpoint. Send encoded frames with framing, not a raw framebuffer. MPS 512 is the USB packet size, not the maximum frame size or an instruction to create headers for each packet. [D01;U01;U02]

The device protocol is the content delivered to EP04. Driver, handles, API, completion, timeout, and cancellation belong to the host. The experimental Android path submitted a whole frame in one request; the demonstrated Windows path depends on the NI driver. Do not generalize APIs across operating systems. [I02;D03;W01–W03]

### §10. Complete Frame Structure

Known frame: 16-byte header + body of pixel pairs + 8-byte footer. Screen 0 is left; screen 1 is right. Geometry: 480×272 = 130560 pixels = 65280 pairs (0xFF00). Raw framebuffer = 261120 bytes. Pixel words are BE in the payload; calling the format RGB565 does not resolve the physical RGB/BGR ordering. [D01;D02;D04]

| Offset | Bytes | Value | Field or meaning |
|---|---|---|---|
| 0 | 1 | 84 | Observed frame marker |
| 1 | 1 | 00 | UNKNOWN; observed constant |
| 2 | 1 | 00 or 01 | Screen |
| 3 | 1 | 60 | UNKNOWN; observed constant |
| 4–11 | 8 | 00×8 | UNKNOWN; observed constants |
| 12–13 | 2 | 01 E0 | Width 480 BE |
| 14–15 | 2 | 01 10 | Height 272 BE |

Table: D01/D02. Reproduce known constants without inventing flags, checksums, or functions for UNKNOWN bytes.

Each command is `OPCODE 00 COUNT_HI COUNT_LO`. Unsigned BE16 COUNT measures pairs, not bytes or individual pixels. Preserve the second byte 00 without assigning an unproven function to it. [D01;D02]

| Opcode | Operation | Data after the 4 command bytes | Coverage |
|---|---|---|---|
| 00 | LITERAL | COUNT×4 bytes | COUNT literal pairs |
| 01 | REPEAT | 4 bytes | Repeats a pair COUNT times |
| 02 | SKIP | None | Advances/preserves COUNT previous pairs |

Table: D01/D02. A pair contains two 16-bit words, each with the high byte first; REPEAT retains both, not a single pixel. Process commands sequentially with a pair cursor; the sum of counts = 0xFF00 in a complete frame. SKIP depends on the previous framebuffer for the same screen; an unknown prior state does not produce a determined initial image. [D01;D03;DOCUMENTARY_DERIVATION]

| Offset relative to end | Bytes | Value | Field or meaning |
|---|---|---|---|
| −8..−5 | 4 | 03 00 00 00 | Observed end marker |
| −4..−3 | 2 | 40 00 | UNKNOWN; observed constants |
| −2 | 1 | 00 or 01 | Repeats screen from header |
| −1 | 1 | 00 | UNKNOWN; observed constant |

Table: D01/D02. The footer is distinct from the body; 03 is not a fourth pixel opcode. No checksum has been demonstrated.

Nominal RGB565 uses R5 in bits 15..11, G6 in bits 10..5, and B5 in bits 4..0. Nominal organization and BE serialization are different matters. The corpus supports byte order and geometry; unambiguous physical red/blue channel assignment remains in an RGB/BGR conflict. Black 0x0000 and white 0xFFFF do not resolve it; do not reverse bytes to try to resolve channels. [D01;D04;DOCUMENTARY_DERIVATION]

Historically, 6110 complete frames passed the parser, containing 539293 LITERAL, 523719 REPEAT, and 51773 SKIP operations. These numbers are not tests performed for this edition. The 522264-byte limit is cited as an implementation limit without sufficient observational provenance to establish a universal device maximum. [D02;W03;E02]

Validator for the known format: check header/footer, matching screen numbers, each opcode's data, truncation, cursor overflow/underflow, exact coverage, and absence of excess bytes. Maintain previous state separately per screen. Reject unknown opcodes. These are documentary criteria derived from the codec, not an exhaustive list of what firmware accepts. [D01;D03;DOCUMENTARY_DERIVATION]

### §11. Known Payloads and Examples

Observed left BLACK frame, 32-byte complete frame: [D01;D02]

```text
84 00 00 60 00 00 00 00 00 00 00 00 01 E0 01 10
01 00 FF 00 00 00 00 00
03 00 00 00 40 00 00 00
```

Observed right BLACK frame, 32 bytes: [D01;D02]

```text
84 00 01 60 00 00 00 00 00 00 00 00 01 E0 01 10
01 00 FF 00 00 00 00 00
03 00 00 00 40 00 01 00
```

Each BLACK frame was observed twice per screen. REPEAT covers 0xFF00 black pairs without depending on previous pixels. Only the minimum factual bytes are reproduced here, without PCAPs or images. Only the minimum factual bytes are reproduced; the related opaque assets remain excluded from this edition. A known payload neither authorizes nor guarantees transmission without initialization (§12). [D01;D02;E01]

Complete left no-op, 28 bytes, instantiated documentarily from the observed framing and body: [D01;DOCUMENTARY_DERIVATION]

```text
84 00 00 60 00 00 00 00 00 00 00 00 01 E0 01 10
02 00 FF 00
03 00 00 00 40 00 00 00
```

The right no-op changes byte 2 and byte −2 to 01. A SKIP body of 0xFF00 pairs was observed; the no-op preserves the preceding image, does not equal BLACK, and does not initialize a determined image when the previous state is unknown. [D01;D03]

Complete synthetic left example, 40 bytes: LITERAL writes two white pixels, and REPEAT fills the remaining pairs with black. It was not transmitted or physically validated in this edition. [D01;DOCUMENTARY_DERIVATION]

```text
84 00 00 60 00 00 00 00 00 00 00 00 01 E0 01 10
00 00 00 01 FF FF FF FF
01 00 FE FF 00 00 00 00
03 00 00 00 40 00 00 00
```

Coverage = 1 + 0xFEFF = 0xFF00 pairs; size = 16+8+8+8 = 40 bytes. [Documentary vectors](../data/display-payloads.json) contain hex, size, and classification without raw captures. [D01;DOCUMENTARY_DERIVATION]

### §12. Initialization and Dependence on IF5

Supported order of the observed and reproduced complete startup: IF5/EP03 report 0x80 → report 0x81 → report 0x82 → EP0 Feature F8 on IF5 → IF6 LEFT → IF6 RIGHT. Historical EP03 reports are 119, 119, and 74 bytes including ID; historical complete frames are 255092 and 260996 bytes. The order does not prove that each step is indispensable or establish universal timing. [I01;I02;I03;D02]

The full contents of the three EP03 reports and historical images are excluded from this candidate excluded from this edition;. Their IDs, lengths, and order are documented. Do not fill them with zeros or assume that BLACK replaces the tested visual restoration. This edition provides the frame and F8 but not a complete replay recipe for all six historical payloads; this is an explicit limitation, not proof of IF6 self-sufficiency. [I01;I02;E01]

Observed F8 request: [D01;D02;I01]

```text
bmRequestType = 0x21
bRequest      = 0x09
wValue        = 0x03F8
wIndex        = 5
wLength       = 11
setup bytes   = 21 09 F8 03 05 00 0B 00
```

| Byte 8 | Complete 11-byte payload | Status/context |
|---|---|---|
| 0x14 | F8 E0 01 10 01 05 60 00 14 32 00 | Observed and used in the documented experimental startup |
| 0x64 | F8 E0 01 10 01 05 60 00 64 32 00 | Described in an implementation, in a brightness context without a semantic conclusion |
| 0x50 | F8 E0 01 10 01 05 60 00 50 32 00 | Observed during initialization |

Table: D02/I01/I04/E02. F8 ID is at byte 0; bytes 1–2 E0 01 and 3–4 10 01 correspond to 480/272 in LE. Other constant bytes: UNKNOWN; byte 8: `UNRESOLVED`. The brightness hypothesis is not a fact. Variant frequency does not select a universal value. [D01;I01;I04;E02]

F8 on IF5 preceded the first display transfer in all three compared sequences. A connection with initialization is strongly indicated; isolated IF6 has not been demonstrated. Do not infer that F8+BLACK is sufficient or that all steps are necessary without a specific test. This edition performs neither ablation nor transmission. [D02;I01;I03]

§18 brings together, in its own section, this edition's initialization limitations, the published elements, and the material deliberately excluded from the package.

### §13. Platform Implementation

Separate the S8 protocol (reports/frame), USB transport (interfaces/endpoints), host driver/API (permissions/ownership/completion), and renderer/frontend (content/actions). A renderer does not change framing, and its existence does not prove USB access. [D01;I04;W01;C01]

Windows: IF5 uses the system's HID/hidapi; MI_06/IF6 is bound to `niks8usb` 4.1.0.80. A libusb claim against this binding returned NOT_SUPPORTED. A known write was accepted through the direct driver path; later dual-display validation retained a Browse gap. This does not prove WinUSB transport or replacement of the NI driver. Causality of the first visual change was not confirmed in time; the intermediate session stopped for lack of IF5 response. [W01;W02;W04;W05;W06]

The NI driver's numeric contract, GUID, flags, and specific calls remain internal pending a human decision. This edition does not provide complete instructions for implementing the Windows-specific transport; it provides the frame and demonstrated binding. Those details are neither a universal USB protocol nor portable to Android. [W01–W05;E01]

Experimental Android used application ownership of IF5/IF6, F8 via controlTransfer, and a complete frame via UsbRequest/ByteBuffer. Twenty dynamic frames per screen completed in the restricted diagnostic, with no continuous IF5 reader after startup. This is not end-to-end validation of the later frontend. Another attempt with IF5 under usbhid returned −1 for F8 and did not test IF6/BLACK. Preserve differences in environment and ownership. [I02;I03;D03;C01;P01]

Confirm USB permission and expected transfer length; a partial transfer/error/timeout does not confirm that a frame was applied. Proposed host requirement: invalidate the generation upon detach and do not automatically repeat an operation with an uncertain outcome. No universal recovery or shutdown has been demonstrated. [I02;C01;E02;DOCUMENTARY_DERIVATION]

Linux/macOS: no current, fully validated native path in this evidence set. A partial historical Linux HID/MIDI-preset reference does not prove IF6, audio, or current support; no operational macOS evidence was located. Do not fill gaps with plausible APIs. [P01]

## Part IV — Audio, Independence, and Platforms

## Part IV — Audio, Independence, and Platforms

### §14. Separation of Audio, Controls, and Displays

The architecture separates IF0–IF2 AUDIO, IF5 HID, and IF6 DISPLAY/BULK; IF3 MIDI and IF4 DFU are defined by the descriptors. A host can manage the subsystems separately while observing bindings/ownership/APIs. The described audio is UAC2 and is not claimed as a novel discovery. The contribution is making the operational boundaries explicit for system audio alongside independent controls/displays. [U01;U02;A01;C02]

Described playback: four channels host→S8, IF1 alt1, 24 bits in a four-byte subslot, 0x01 ISO OUT; 0x81 ISO IN is described feedback. Capture: ten channels S8→host, IF2 alt1, 0x82 ISO IN; this does not prove functional Android capture. Eight host→mixer channels are contradicted by the descriptor/ASIO capability; no evidence supports an alternative vendor mechanism. Four analog channel strips do not prove four digital pairs from the host. [U02;A01;A02]

Windows exposed 10 inputs/4 outputs in an ASIO probe that neither created buffers nor started a stream. Outputs: Master L/R and Monitor L/R; inputs: Channel A/B/C/D L/R and Master L/R. Simultaneous isochronous playback/capture transfers were observed separately, without latency or long-term stability metrics in this edition. Do not state that the probe physically validated every channel. [A01;A02;P01]

Android exposed a TYPE_USB_DEVICE/sink output, 48000 Hz, four channels, mask 0x0F, and PCM float/PCM32 in the API. AudioTrack received physical confirmation for 10 s: CH0 MASTER L; CH1 MASTER R; CH2 CUE L; CH3 CUE R. An observed PCM32/frame size 16 HAL does not prove bit-perfect operation. An accepted preferred device does not guarantee route or sound. Capture NOT_IMPLEMENTED; duplex NOT_TESTED. [A03;A04;P01]

Android audio follows AudioTrack/Audio Framework/USB Audio HAL/ALSA/snd-usb-audio. The public USB API used does not schedule isochronous transfers via UsbRequest. Do not move audio to the HID/display dispatcher or claim IF0–IF2 in this architecture. Startup completed before playback, with no active proprietary transfers; full continuous coexistence remains unvalidated. [C02;A04;P01]

### §15. Operation Independent of Native Instruments Service

Verified names: `NIHardwareService`, a Windows user-space service; `niks8usb`, a kernel driver. Stopping the former does not remove the latter: the binding remained active. Absence of the service does not mean absence of the NI driver. [W01;N01]

Windows: one replay of six startup/visual-restoration payloads completed with NIHardwareService stopped. Human observation confirmed an image equivalent to startup with the service active. Demonstrated independence is narrow—startup/restoration only; it does not prove a full stack, statistical reliability, NI-free ASIO audio, all LEDs/MIDI/hotplug/recovery/shutdown. Service state cannot be inferred solely from USB bytes. [I01;N01]

Android: direct visual startup and live HID IN in diagnostics, with separate semantic validation of eight bindings. Runtime without NIHardwareService/Traktor on the tablet does not prove physical coverage of all 185 catalogued signals. Playback without the NI driver is a separate result with the limitations in §14. No result establishes full independence on any operating system; undemonstrated internal functions/protocols are not specified. [I03;H05;A03;N01;P01]

### §16. Requirements by Operating System

[The platform matrix](platform-support.md), [CSV](../data/platform-support.csv) and [JSON](../data/platform-support.json) separate enumeration, playback/capture, HID IN/OUT, F4, F8, Display/BULK, coexistence, independence and physical validation. Physical status is always limited to a subsystem/environment and is not certified for the entire system. [P01]

Windows and Android can only be compared using criteria with the same denominator. [H01;H02;H05;L04;P01]

| Criterion | Windows | Android |
|---|---|---|
| Shared HID inventory | 181 entries: 165 from M255 and 16 display side buttons from M259 [H01;H02] | The same 181 entries; this version documents no independent Android mapping campaign [H01;H02;I03] |
| Implemented decoding | 181 signals catalogued with offset, mask, encoding, direction and edges [H01;H02] | Same catalogue; functional port in development, with decoder coverage measured in an offline test [I03;H05;H08] |
| Offline tests | 162 controls classified as functional in the Mixxx integration: implementation, not device testing; the public reference validates 169 physical records as a group, also without individual testing [L04;H10] | Decoder and integration coverage for the in-development branch; not promoted to physical validation [H08;H09] |
| Historical physical validation | Mapping for 163 of 165 historical signals derived from physical capture; bilateral PLAY/CUE/FLUX LED feedback and F4 family, with pads/hotcues not approved [H01;H02;H07] | Visual startup with live IF5 input, eight semantic bindings, 40 display frames and four audio outputs in separate tests [I03;H05;C01;A03;A04] |
| Latest update | 16 display side buttons incorporated into the successor baseline; touchstrip positions resolved in a physical delta after these baselines [H02;H06] | 16 display side buttons and Mixer Filter incorporated into the offline port; diagnostic integration [H05;C01;H09] |
| Recent physical gaps | Pads/hotcues, LEDs outside PLAY/CUE/FLUX, and no isolated physical map for SYNC, LOOP, FX, SNAP and QUANTIZE [H07;L04] | 16 display side buttons, TEMPO, touchstrip, hotcue colors, F8 variant and IF6 display have no confirmed Android physical function [H09;P01] |
| Protocol gaps | Raw HID descriptor; 2 touchstrip position GAPs in this version, although resolved in a later delta [H01;H02;H06]; display RGB/BGR order [D04] | Raw HID descriptor; F8 under kernel driver; audio capture not implemented [P01] |

Windows requires the observed NI driver for the demonstrated display and the system HID driver for IF5. Android requires app USB permission and coordinated ownership of IF5/IF6; audio remains with the framework. Linux has partial historical reference; no operational macOS evidence was located. A generic API, build or offline test does not change physical-validation status. Geometry/framing/encodings belong to the device; handles, claims, completions, routing and frontend belong to the host. Do not transfer evidence between platforms or between diagnostic and later application builds. [W01;I02;D01;H01;C01;P01]

### §17. Verified Limitations and Non-Goals

Limitations supported by H01/D01/D04/I04/E02/P01:

- Firmware/SKU/revision not stated; other units not characterized.
- Raw HID report descriptor not located; known reports are not a complete descriptor.
- Touchstrip positions resolved through later physical characterization; no universal scale, calibration, or musical action, and the position field must only be interpreted while its associated touch gate is active.
- Historical TEMPO 247/248 versus later counter both preserved; no normative correction.
- F8 variants 0x14/0x64/0x50, byte 8 UNRESOLVED; brightness not established.
- RGB/BGR unresolved; BE byte order is separate from color channels.
- UNKNOWN constants; no checksum demonstrated.
- The 522264-byte maximum lacks sufficient observational provenance; it is only an implementation contract.
- Shutdown/recovery from uncertain operations unknown; isolated IF6 unproven.
- HID OUT/LEDs incomplete; independent F4 transmission not validated; Android F4 lacks physical evidence; combinations not exhaustive.
- 32 additional LED fields resolved only on the bus, without observed light response; classification separated in §19.
- Four outputs, not eight host→mixer; Android capture/duplex not implemented/tested; clock, latency, and resampling not characterized; feedback 0x81 lacks verified data in the audited excerpts.
- Long-term coexistence of audio/MIDI/HID/display with real hotplug not validated.
- Complete replay of six startup payloads unavailable in this candidate; opaque assets await a disclosure decision, as delimited in §18.
- Windows contract retained internally; its specific transport cannot be fully implemented from this edition alone.
- Linux/macOS have no current complete native validation; MIDI Mode is not confirmed by message in the audited set.

This version enables decoding catalogued HID fields, constructing known feedback and the display frame/codec, and planning operational separation. It is neither a fully validated complete protocol nor official support. This edition includes provenance notes, creator credit, and community contribution routes. It does not include private discoveries, captures, code, firmware, drivers, or third-party assets. [E01]
