# Traktor Kontrol S8 Hardware Protocol — Independent Reverse Engineering

An independent reverse-engineering reference for the Traktor Kontrol S8, including USB/HID, LEDs and displays. Created by **gusgustavofreitas** with AI assistance.

### Related project — Mixxx Mappings

This repository documents the independent Kontrol S8 hardware protocol. The companion [Kontrol S8 for Mixxx — Cross-Platform Mappings](https://github.com/gusgustavodj/kontrol-s8-mixxx-mappings) implements mappings for Mixxx, with Windows as its initial implementation and additional platforms welcome.

The [interactive Hardware Protocol Atlas](atlas/Kontrol-S8-Hardware-Protocol-Atlas-v1.00.html) helps locate physical controls, inspect HID INPUT addresses, consult HID OUTPUT/LED messages, and review Displays/Bulk records. Supporting material covers USB/audio architecture, HID INPUT, HID OUTPUT/LEDs, Displays/Bulk, and CSV/JSON data. See [overview](docs/overview.md), [known limitations](docs/known-limitations.md), and [contribution guide](docs/contribution-guide.md).

The independent tables report 181 HID INPUT rows; the Atlas has 185 INPUT records, 154 OUTPUT records and 164 assemblies under separately documented criteria. Public transport inventories contain 122 addressed source rows: 110 HID Output, 2 Feature, 8 USB control OUT and 2 optional display initialization records. The shared pad palette documents 17 transmitted values. See the linked technical records for evidence and limitations.

## Contributing

Contributions are welcome through [GitHub Issues](https://github.com/gusgustavodj/kontrol-s8-protocol/issues) and [Pull Requests](https://github.com/gusgustavodj/kontrol-s8-protocol/pulls). Report protocol findings, documentation corrections, technical questions, compatibility results, or propose changes. See [CONTRIBUTING.md](CONTRIBUTING.md) and the templates in `.github/`.

Contributions are reviewed before incorporation. The maintainer decides whether changes enter the official repository; Issues and Pull Requests do not create an obligation to implement, accept or merge a proposal.

## License and notices

Original protocol documentation and tables are licensed under [CC BY 4.0](LICENSES/CC-BY-4.0.txt), limited to rights held by the creator. Atlas software code and the technical overlay are licensed under the MIT License in [LICENSE](LICENSE). See [license scope](docs/licensing.md) and [NOTICE.md](NOTICE.md). Third-party material, trademarks, firmware, drivers and raw captures are not relicensed.
