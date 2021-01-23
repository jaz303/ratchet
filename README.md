# ratchet

Initial targets:

  - Atmel SAMD21
  - Atmel SAMD5x/E5x
  - Raspberry Pi RP2040

Current status: evolving a toy TypeScript interpreter

## TODO

  - [ ] yield
  - [ ] `task.running` -> `task.state` (runnable, paused, exited)
  - [ ] implement "return" op
  - [ ] test case with builtins to perform basic arithmetic
  - [ ] proper function lookup
  - [ ] argument passing to spawned tasks
