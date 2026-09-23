# Windows and Android physical validation

## Formal state

`OWNER_ATTESTED_PHYSICAL_PASS`: the owner reports that independent mappings operated HID INPUT controls, HID OUTPUT/LEDs and Displays on real hardware outside Traktor. This applies to the implementations and configurations actually tested, not every revision or build. Lack of video does not reduce the attestation to a hypothesis.

## Windows

`FARROUPILHA_3` is the recorded functional baseline. A later owner statement confirms that the updated four-file Windows v1.0 composition with a 7000 ms splash works in a physical test. The exact Windows version, Mixxx build, patch used, test date and functions checked still need to be recorded. The earlier checkpoint correctly reflected the state before this later statement.

## Android

The physically identified pair is APK TESTE_10 with mappings TESTE_14. The APK SHA-256 is `63DDF505F3F59A9A18CD2D909475E680426D605D25F45889180B4FE32953A8D4`. TESTE_14 has separate 19/19 offline evidence and owner-reported physical PASS. Later M10026/M10031 builds are performance candidates and are not automatically promoted.

## Scope

The PASS does not cover every operating system, Mixxx build, audio function, later build, LED combination or startup byte. An unidentified revision needs artifact identification; it does not erase the reported result.
