# ratchet

Initial targets:

  - Atmel SAMD21
  - Atmel SAMD5x/E5x
  - Raspberry Pi RP2040

Current status: evolving a toy TypeScript interpreter

## TODO

  - [x] yield
  - [ ] `task.running` -> `task.state` (runnable, paused, exited)
  - [ ] implement "return" op
  - [ ] test case with builtins to perform basic arithmetic
  - [ ] proper function lookup
  - [ ] argument passing to spawned tasks

## High-level features

Need to think about these sooner rather than later:

  - blocks
  - closures
  - method calls
  - class construction
  - arrays, slices. including typed arrays
  - tuples
  - pattern matching

