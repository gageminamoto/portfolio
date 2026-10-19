import { Icon, type IconProps } from "nucleo-ui-essential-fill-18"

/* Sun and moon (18px fill), drawn to sit alongside the Nucleo UI Fill set,
 * which has no sun or moon icon of its own. */

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315]

/** Sun: solid disc with eight rounded rays. */
export function IconSunFill18(props: IconProps) {
  return (
    <Icon size="18px" {...props}>
      <circle cx="9" cy="9" r="3.5" fill="currentColor" />
      {RAYS.map((deg) => (
        <rect
          key={deg}
          x="8.25"
          y="0.75"
          width="1.5"
          height="2.75"
          rx="0.75"
          fill="currentColor"
          data-color="color-2"
          transform={`rotate(${deg} 9 9)`}
        />
      ))}
    </Icon>
  )
}

/** Moon: solid crescent opening to the top right. */
export function IconMoonFill18(props: IconProps) {
  return (
    <Icon size="18px" {...props}>
      <path
        d="M15.5,10.6A6.65,6.65,0,1,1,7.4,2.6A5.6,5.6,0,0,0,15.5,10.6Z"
        fill="currentColor"
      />
    </Icon>
  )
}
