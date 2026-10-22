// 丹青 (si-style) — import the styles once, wrap the app in <SiProvider>.
import "./tokens.css";
import "./base.css";
import "./components.css";

export { BrushStroke, cn, ease, inkHandler, SiProvider, spawnInk, spring, useTheme, type ThemeChoice } from "./core";
export { Button, CopyButton, IconButton, type ButtonProps, type Color, type IconButtonProps } from "./components/Button";
export { Avatar, AvatarStack, Card, Chip, ListItem, Seal, Tag } from "./components/Display";
export { BrushSpinner, InkBars, InkDrop, Skeleton } from "./components/Feedback";
export { PasswordField, passwordStrength, SelectField, StrengthMeter, TextAreaField, TextField, type PasswordFieldProps, type SelectFieldProps, type TextAreaFieldProps, type TextFieldProps } from "./components/Field";
export { Input, Select, TextArea } from "./components/Input";
export { Dialog } from "./components/Dialog";
export { ConfirmDialog, Group, GroupRow, IconBadge, NavItem, Note, RadioCard, SearchField, Steps } from "./components/Layout";
export { InkWash } from "./components/InkWash";
export { Slider } from "./components/Slider";
export { Menu, type MenuEntry } from "./components/Menu";
export { Checkbox, Radio, RadioGroup, Switch } from "./components/Selection";
export { Segmented, Tabs, type Option } from "./components/Tabs";
export { Tooltip } from "./components/Tooltip";
