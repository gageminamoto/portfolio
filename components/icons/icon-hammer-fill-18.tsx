import { Icon, type IconProps } from "nucleo-ui-essential-fill-18"

/** Hammer (18px fill), drawn to match the Nucleo UI Fill set. */
export function IconHammerFill18(props: IconProps) {
  return (
    <Icon size="18px" {...props}>
      <g transform="translate(-1 1.5) rotate(45 9 9)">
        <rect x="4.5" y="1.75" width="9" height="4.75" rx="1.5" fill="currentColor" />
        <rect x="7.75" y="6.5" width="2.5" height="9.75" rx="1.25" fill="currentColor" data-color="color-2" />
      </g>
    </Icon>
  )
}
