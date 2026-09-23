# Displays / Bulk

IF6 is vendor-specific (`FF/BD/00`) and uses Bulk OUT EP04, MPS 512. The observed framing consists of a 16-byte header, a body of RGB565 pixel pairs nominally serialized in big-endian order, and an 8-byte footer. Documented opcodes are LITERAL, REPEAT and SKIP; the count sum of a complete 480×272 frame is `0xFF00` pairs.

F8 is Feature SET_REPORT on IF5 (`wValue=0x03F8`, `wIndex=5`, `wLength=11`), with observed byte-8 variants `0x14`, `0x50` and `0x64`. The meaning of that byte, physical RGB versus BGR order, shutdown, recovery, universal maximum frame size and full startup recipe remain unresolved. The Mixxx renderer and Windows path are implementation evidence, not a universal normative specification.

See [`display-bulk-reference.md`](display-bulk-reference.md) and [`known-limitations.md`](known-limitations.md). No opaque payload, third-party image or claim beyond the sources has been added here.
