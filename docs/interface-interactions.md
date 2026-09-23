# Interface interactions

Audio IF0–IF2, MIDI IF3, DFU IF4, HID IF5 and Display IF6 need distinct owners and consumers. This architectural rule follows the observed interface boundaries. Android `requestWait()` incidents demonstrate a coordination risk, but do not establish stability or failure on every platform. Sustained coexistence with live callbacks remains unproven.
