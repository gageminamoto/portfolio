"use client"

import { useEffect, useState } from "react"

const TRAIN = `      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|__
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__
 |/-=|___|=    ||    ||    ||    |_____/~\\___/
  \\_/      \\O=====O=====O=====O_/      \\_/           `

const SMOKE_FRAMES = [
  ["                 (  ) (@@) ( )  (@)  ()    @@    O",
   "            (@@@)                                  ",
   "         (    )                                    "],
  ["                    (@@) (  ) (@)  ( )  @@    O   ",
   "              (@@@)                                ",
   "          (    )                                   "],
  ["                  ( ) (@@)  (@) (  )   O    @@    ",
   "             (@@@ )                                ",
   "          (   )                                    "],
]

export function AsciiTrainFooter() {
  const [smokeFrame, setSmokeFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSmokeFrame((f) => (f + 1) % SMOKE_FRAMES.length)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  const smoke = SMOKE_FRAMES[smokeFrame]

  return (
    <div className="relative w-full overflow-hidden border-t border-border mt-8">
      <div className="train-scroll py-4">
        <pre
          className="inline-block font-mono text-[10px] leading-[1.2] text-muted-foreground/60 select-none sm:text-xs whitespace-pre"
          aria-hidden="true"
        >
          {smoke.join("\n") + "\n" + TRAIN}
        </pre>
      </div>
    </div>
  )
}
