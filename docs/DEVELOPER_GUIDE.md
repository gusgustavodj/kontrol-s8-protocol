# Developer guide

1. **HID INPUT:** Open the Atlas, locate the control, read its report, length, offset, mask and encoding in the derived table, then generate the software event. Preserve the evidence key; do not treat unobserved values as normative.
2. **LEDs:** Locate the group or OUTPUT RECORD, verify report, offset, mask and transport, and implement feedback only for documented states. One group does not imply one distinct physical LED.
3. **Displays:** Consult IF6/EP04, framing and observed payloads; implement the renderer and transport from documented bytes. Synthetic examples are marked and were not transmitted.
4. **USB/audio:** Enumerate interfaces and keep UAC2, MIDI, HID IF5 and Displays/Bulk IF6 ownership separate.

Windows and Android mappings are concrete applications, subject to the rights and limits of their identified revisions. Derived examples are not new captures.
