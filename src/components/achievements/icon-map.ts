import {
  Footprints,
  CircleCheckBig,
  ClipboardList,
  CircleCheck,
  CalendarClock,
  Activity,
  Link2,
  Sunrise,
  ShieldCheck,
  Flame,
  Medal,
  ArrowUp,
  Dumbbell,
  BarChart3,
  ChevronsUp,
  TrendingUp,
  PersonStanding,
  Shield,
  Moon,
  Ruler,
  LayoutGrid,
  CalendarCheck2,
  Swords,
  Award,
  Star,
  Trophy,
  Heart,
} from "lucide-react";

export type AchievementIconComponent = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}>;

/**
 * icon_key → glyph. These are lucide icons (the same icon language used everywhere else in the
 * product) rather than hand-drawn art — the Sportpark Milestones look comes from the medallion
 * frame in AchievementIcon.tsx (metallic tier ring, engraved dark face, red accent glow), which
 * is exactly the "standard icon adapted to the Sportpark design" the brief asks for. A custom
 * SVG uploaded via the admin (achievements.custom_icon_media_id) overrides this entirely.
 */
export const ACHIEVEMENT_ICONS: Record<string, AchievementIconComponent> = {
  shoe_print: Footprints,
  goal_check: CircleCheckBig,
  plan_start: ClipboardList,
  check_circle: CircleCheck,
  calendar_bolt: CalendarClock,
  pulse_wave: Activity,
  chain_link: Link2,
  sunrise: Sunrise,
  calendar_shield: ShieldCheck,
  flame_refresh: Flame,
  medal: Medal,
  arrow_up: ArrowUp,
  dumbbell: Dumbbell,
  chart: BarChart3,
  level_arrow: ChevronsUp,
  bars_growth: TrendingUp,
  body_line: PersonStanding,
  spine: Shield,
  wave_moon: Moon,
  body_measure: Ruler,
  four_areas: LayoutGrid,
  calendar_check: CalendarCheck2,
  fist_shield: Swords,
  belt: Award,
  belt_star: Star,
  laurel_one: Trophy,
  link_symbol: Heart,
};

export const DEFAULT_ACHIEVEMENT_ICON: AchievementIconComponent = Award;
