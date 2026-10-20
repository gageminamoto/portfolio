import { forwardRef, type CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { bodyCopyClassName } from "@/components/bio-section"
import { CompanyIcon } from "./company-icon"
import {
  getLifelineEventEffect,
  getLifelineEventImage,
  getLifelineEventKey,
  LifelineEventText,
} from "./lifeline-event"
import { useLifelineFireworks } from "./lifeline-fireworks"
import { useLifelineHoverImage } from "./lifeline-hover-image"
import { aggregateLifelinePeople, LifelinePeople } from "./lifeline-people"
import type { LifelineMarker } from "./types"

interface LifelineMarkerColumnProps {
  marker: LifelineMarker
  birthYear: number
  minWidth: number
  animateIntro?: boolean
  introDelay?: number
  introDuration?: number
  showSecondaryAxis?: boolean
}

export const LifelineMarkerColumn = forwardRef<
  HTMLDivElement,
  LifelineMarkerColumnProps
>(function LifelineMarkerColumn(
  {
    marker,
    birthYear,
    minWidth,
    animateIntro = false,
    introDelay = 0,
    introDuration = 420,
    showSecondaryAxis = true,
  },
  ref,
) {
  const age = marker.age ?? marker.year - birthYear
  const people = aggregateLifelinePeople(marker)
  const hoverImage = useLifelineHoverImage()
  const fireworks = useLifelineFireworks()

  return (
    <div
      ref={ref}
      className="group relative shrink-0 pr-8 transition-opacity duration-300 ease-out will-change-opacity"
      style={{ width: minWidth }}
      aria-label={marker.label ?? `${marker.year}`}
    >
      <div
        className={cn("relative", animateIntro && "lifeline-marker-intro")}
        style={{
          animationDelay: animateIntro ? `${introDelay}ms` : undefined,
          ...(animateIntro
            ? ({
                "--lifeline-marker-fade-ms": `${introDuration}ms`,
              } as CSSProperties)
            : {}),
        }}
      >
        <span
          className="absolute left-0 top-[var(--lifeline-rail)] z-10 h-[10px] w-px -translate-y-1/2 bg-muted-foreground/40"
          aria-hidden="true"
        />

        <div className="flex w-full flex-col items-start text-left">
          {showSecondaryAxis && (
            <p className="mb-5 h-4 text-xs font-medium leading-4 tabular-nums text-muted-foreground">
              {age}
            </p>
          )}

          <p className="mb-6 h-5 whitespace-nowrap text-sm font-medium leading-5 tabular-nums text-muted-foreground">
            {marker.label ?? marker.year}
          </p>

          <div className="relative w-full text-muted-foreground">
            {/* When this column carries people, the content block reserves
                the band's height as a floor: short and average columns put
                their portraits on the same line as every other column, and
                a column whose events run past the floor pushes its own
                portraits below them instead of under them. pb-6 is the gap
                in the overflow case — absorbed by the floor otherwise. */}
            <div
              className={cn(
                "flex w-full flex-col items-start pt-6",
                people.length > 0 &&
                  "min-h-[var(--lifeline-people-top)] pb-6",
              )}
            >
              {marker.badges && marker.badges.length > 0 && (
                <div className="mb-3 flex items-center justify-start gap-2">
                  {marker.badges.map((badge) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={badge.src}
                      src={badge.src}
                      alt={badge.alt}
                      className="h-6 w-6 object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ))}
                </div>
              )}

              {marker.companies && marker.companies.length > 0 && (
                <div className="mb-2 flex items-center justify-start gap-1.5">
                  {marker.companies.map((company) => (
                    <CompanyIcon
                      key={company.id}
                      id={company.id}
                      label={company.name}
                      className="opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  ))}
                </div>
              )}

              <div className="min-h-[3.25rem] space-y-4">
                {marker.events.map((event, index) => {
                  const image = getLifelineEventImage(event)
                  const effect = getLifelineEventEffect(event)

                  return (
                    <p
                      key={getLifelineEventKey(event, index)}
                      className={cn(
                        bodyCopyClassName,
                        "max-w-[18rem] text-left text-muted-foreground",
                        effect && "cursor-pointer",
                      )}
                      data-lifeline-interactive={effect ? "" : undefined}
                      onMouseEnter={
                        image && hoverImage
                          ? () => hoverImage.show(image)
                          : undefined
                      }
                      onMouseLeave={
                        image && hoverImage ? hoverImage.hide : undefined
                      }
                      onClick={
                        effect && fireworks
                          ? () => fireworks.launch(effect)
                          : undefined
                      }
                    >
                      <LifelineEventText event={event} />
                    </p>
                  )
                })}
              </div>
            </div>

            {people.length > 0 && (
              <div className="w-full">
                <LifelinePeople people={people} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
