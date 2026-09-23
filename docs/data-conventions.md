# Table conventions

The tables derive technical facts; they contain no raw captures or implementation code. No license or publication permission has been selected.

JSON is a list of objects. CSV uses the same row and field order. An empty CSV cell represents `null`; strings are literal; numeric fields are decimal integers. Arrays use JSON syntax inside a CSV cell. `related_control_ids`, `byte_masks` and `compatible_carrier_lengths` are arrays. Report IDs, lengths, values, codes, observed bounds, offsets, widths, masks, shifts and moduli are numbers or `null`. USB interface, alternate and max-packet-size fields are numbers or `null`. There is no Boolean field in this schema.

`report_length` retains the historical input family or carrier. `canonical_view_length` and `canonical_view_kind` delimit the known view. An empty compatible-carrier array means no extra length is listed, not that all other lengths are incompatible. The report 1 41/109 compatibility described in section 3 does not automatically extend to report 2.

A `null` mask does not establish width: consult `field_width` and `byte_masks`. A known field without a selective mask consumes `0xFF` per byte of its width. `null` GAP fields consume no byte. Observed minima, maxima and resolution are historical observations, not calibration or guaranteed hardware limits. Endianness and signedness belong to each entry. Historical `TWOS_COMPLEMENT_OBSERVED` for BROWSE RIGHT does not make the whole nibble a signed delta; its encoding is a circular counter.

`touch_control_id` identifies a separate touch signal if recorded; it does not require every host read to be touch-gated. Assemblies do not define a music application's functions. `confidence` and `reconciliation_status` preserve baseline assessments without certifying this specification. `evidence_ref` is a public traceability key; private source paths and hashes remain in the internal evidence package.

`EncTempoMixer` preserves historical codes 247/248. Consult section 6 for later interpretation. Control IDs are stable technical inventory identifiers, not session or device identifiers.

## Output inventory files

`HID_OUTPUT_LEDS` contains only interrupt HID Output reports. Feature Report records, USB control OUT transfers and optional display initialization each have separate CSV/JSON files. These four public transport inventories contain 122 addressed rows: 110 HID Output, 2 Feature Report, 8 USB control OUT and 2 display initialization entries. Ninety historical MIDI mapping declarations had no address or usable transmitted LED command and are retained in the private mission references. The 16 pad rows reference `PAD_COLOR_PALETTE`, which is one reusable 17-entry value table. `ATLAS_OUTPUT_STATE_INDEX` is a derived view of the approved Atlas fields, not a fifth command transport or a second canonical protocol source.

Each output file uses the same columns: control or mapping label, function, transport, report/request code, offsets with/without the Report ID, field encoding or mask, activation/deactivation/dim values, logical state, platform and evidence status. Capture names, historical row numbers, mission labels and private source paths are not part of the distribution tables. Values and addresses are retained from the source records. The `evidence_status` text describes source scope and is not a claim that every physical LED was independently tested.
