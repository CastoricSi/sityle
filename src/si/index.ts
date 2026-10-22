// 丹青 (si-style) — import the styles once ("sityle/style.css", plus the optional
// page ground "sityle/base.css"), wrap the app in <SiProvider>.
import "./tokens.css";
import "./components.css";

export { BrushStroke, ease, inkHandler, SiProvider, spawnInk, spring, themeScript, useTheme, type ThemeChoice } from "./core";
export { Button, CopyButton, IconButton, type ButtonProps, type Tone, type CopyButtonProps, type IconButtonProps } from "./components/Button";
export { Avatar, AvatarStack, Card, Chip, ListItem, Seal, Tag, type AvatarProps, type CardProps, type ChipProps, type ListItemProps, type SealProps, type TagProps } from "./components/Display";
export { BrushSpinner, InkBars, InkDrop, Skeleton } from "./components/Feedback";
export { PasswordField, passwordStrength, SelectField, StrengthMeter, TextAreaField, TextField, type PasswordFieldProps, type SelectFieldProps, type SelectOption, type TextAreaFieldProps, type TextFieldProps } from "./components/Field";
export { Input, Select, TextArea } from "./components/Input";
export { Dialog } from "./components/Dialog";
export {
	AutoHeight,
	ConfirmDialog,
	Fab,
	Group,
	GroupRow,
	IconBadge,
	NavItem,
	Note,
	RadioCard,
	SearchField,
	Steps,
	type FabProps,
	type GroupProps,
	type GroupRowProps,
	type NavItemProps,
	type NoteProps,
	type RadioCardProps,
	type SearchFieldProps,
	type StepsProps,
} from "./components/Layout";
export { InkWash, type InkBlot } from "./components/InkWash";
export { Slider, type SliderProps } from "./components/Slider";
export { Menu, type MenuEntry, type MenuProps } from "./components/Menu";
export { Checkbox, Radio, RadioGroup, Switch, type CheckboxProps, type RadioGroupProps, type RadioProps, type SwitchProps } from "./components/Selection";
export { Segmented, TabPanel, Tabs, type Option, type SegmentedProps, type TabPanelProps, type TabsProps } from "./components/Tabs";
export { Tooltip } from "./components/Tooltip";
export { en, useMessages, zh, type Messages } from "./messages";
