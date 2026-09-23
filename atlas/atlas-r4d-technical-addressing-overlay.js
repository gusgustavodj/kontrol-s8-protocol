/*
 * Public-safe overlay for the complete R4D Atlas.
 * It extends the interactive index without rewriting the preserved JSON sources.
 */
(function () {
  "use strict";

  const transport = "EP0 / USB Control OUT; bmRequestType=0x21; bRequest=0x09; wValue=0x03F4; wIndex=0x0005; wLength=33";
  const limitation = "Technical addressing reference. It does not establish a complete native light behavior or a physical pass.";
  const deckOutputs = [
    ["DECK_WHITE_LEFT", "DECK indicator white", "LEFT", "0x80", "53", "54", "White indicator identified by technical addressing reference."],
    ["DECK_BLUE_LEFT", "DECK indicator blue", "LEFT", "0x80", "54", "55", "Blue indicator identified by technical addressing reference."],
    ["DECK_WHITE_RIGHT", "DECK indicator white", "RIGHT", "0x81", "53", "54", "White indicator identified by technical addressing reference."],
    ["DECK_BLUE_RIGHT", "DECK indicator blue", "RIGHT", "0x81", "54", "55", "Blue indicator identified by technical addressing reference."],
  ];

  function addOutput(id, name, side, report, payloadOffset, rawOffset, note) {
    if (!LED[id]) {
      LED[id] = {
        output_id: id,
        source: "technical-addressing-freeze-deck-direct-thru.md",
        transport: "HID_OUTPUT_REPORT",
        usb_interface: "IF5",
        report_id: report,
        report_length_with_id: "119",
        payload_length_without_id: "118",
        side,
        physical_target: name,
        payload_offsets: payloadOffset,
        raw_offsets_with_report_id: rawOffset,
        encoding: "INTENSITY_U8",
        off_value: "0x00",
        dim_value: "NOT_DOCUMENTED",
        on_value: "0x7F",
        validation_status: "TECHNICAL_ADDRESSING_REFERENCE",
        evidence_class: "DERIVED_TECHNICAL_REFERENCE",
        notes: note,
        label: id.replaceAll("_", " "),
      };
    }
    if (!outputMetaById.has(id)) {
      const meta = {
        original_id: id,
        public_id: id,
        name_or_function: name,
        side_channel: side,
        physical_component: name,
        output_class: "HID_OUTPUT",
        operating_mode: "HID_OUTPUT_REPORT",
        report_id: report,
        interface_transport: "IF5 / HID_OUTPUT_REPORT",
        offset_with_report_id: rawOffset,
        offset_without_report_id: payloadOffset,
        mask_width: "0x7F",
        off_dim_on: "0x00 / NOT_DOCUMENTED / 0x7F",
        bus_evidence: "DERIVED_TECHNICAL_REFERENCE",
        physical_response: "TECHNICAL_ADDRESSING_REFERENCE",
        source_original: "TECHNICAL_ADDRESSING_REFERENCE",
        reconciliation_status: "HTML_ASSOCIATED",
        limitations: `${note} ${limitation}`,
      };
      OUTPUT_META.push(meta);
      outputMetaById.set(id, meta);
    }
  }

  deckOutputs.forEach((args) => addOutput(...args));

  for (const [id, side, report] of [["FREEZE_LEFT", "LEFT", "0x80"], ["FREEZE_RIGHT", "RIGHT", "0x81"]]) {
    const meta = outputMetaById.get(id);
    if (meta) {
      Object.assign(meta, {
        physical_component: "FREEZE indicator",
        report_id: report,
        interface_transport: "IF5 / HID_OUTPUT_REPORT",
        offset_with_report_id: "50",
        offset_without_report_id: "49",
        mask_width: "0x7F",
        off_dim_on: "0x00–0x7F (observed transition does not establish a full state contract)",
        bus_evidence: "DERIVED_TECHNICAL_REFERENCE",
        physical_response: "INCONCLUSIVE",
        source_original: "TECHNICAL_ADDRESSING_REFERENCE",
        reconciliation_status: "HTML_ASSOCIATED",
        limitations: "FREEZE is a distinct field from the white companion at payload offset 48. Its complete behavior is inconclusive; no field-specific physical pass is asserted.",
      });
    }
  }

  for (const [id, mask] of [["LED_DIRECT_THRU_LIVE_INPUT_A", "0x01"], ["LED_DIRECT_THRU_LIVE_INPUT_B", "0x02"], ["LED_DIRECT_THRU_LIVE_INPUT_C", "0x04"], ["LED_DIRECT_THRU_LIVE_INPUT_D", "0x08"]]) {
    const meta = outputMetaById.get(id);
    if (meta) {
      Object.assign(meta, {
        output_class: "HID_FEATURE_LED",
        operating_mode: "HID_SET_REPORT_FEATURE",
        interface_transport: transport,
        report_id: "0xF4",
        offset_with_report_id: "2 (SS in F4 24 SS)",
        offset_without_report_id: "2 (SS in F4 24 SS)",
        mask_width: mask,
        off_dim_on: `0x00 / NOT_APPLICABLE / ${mask}`,
        bus_evidence: "TECHNICAL_FEATURE_REPORT_REFERENCE",
        physical_response: "INCONCLUSIVE",
        source_original: "TECHNICAL_ADDRESSING_REFERENCE",
        reconciliation_status: "HTML_ASSOCIATED",
        limitations: "SS is an accumulated channel mask. A=0x01, B=0x02, C=0x04 and D=0x08. DIRECT_THRU_PHYSICAL_VALIDATION remains INCONCLUSIVE.",
      });
    }
  }

  for (const [assemblyId, outputIds] of [["left.deck_switch", ["DECK_WHITE_LEFT", "DECK_BLUE_LEFT"]], ["right.deck_switch", ["DECK_WHITE_RIGHT", "DECK_BLUE_RIGHT"]]]) {
    const assembly = byId.get(assemblyId);
    if (assembly) {
      assembly.public_technical_output_references = outputIds.map((output_id) => ({
        output_id,
        status: "TECHNICAL_OUTPUT_REFERENCE",
        limitation: "The physical DECK button is an HID input. These are separate indicator output fields.",
      }));
      assembly.notes = "DECK input is report 0x01, 41 bytes: left byte 8 mask 0x04; right byte 16 mask 0x04; active high. The separate white and blue indicator outputs are linked as technical references.";
    }
  }

  window.__atlasR4TestApi.getOutputMeta = (id) => outputMetaById.get(id);
  window.__atlasR4TestApi.technicalAddressingOverlay = true;
  render();
})();
