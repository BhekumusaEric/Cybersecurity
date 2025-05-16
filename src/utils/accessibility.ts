import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Utility functions for accessibility features
 */

/**
 * Check if screen reader is enabled
 * @returns Promise<boolean>
 */
export const isScreenReaderEnabled = async (): Promise<boolean> => {
  return await AccessibilityInfo.isScreenReaderEnabled();
};

/**
 * Add event listener for screen reader status change
 * @param listener Function to call when screen reader status changes
 * @returns Function to remove the listener
 */
export const addScreenReaderChangeListener = (
  listener: (isEnabled: boolean) => void
): (() => void) => {
  return AccessibilityInfo.addEventListener('screenReaderChanged', listener);
};

/**
 * Check if reduce motion is enabled
 * @returns Promise<boolean>
 */
export const isReduceMotionEnabled = async (): Promise<boolean> => {
  return await AccessibilityInfo.isReduceMotionEnabled();
};

/**
 * Add event listener for reduce motion status change
 * @param listener Function to call when reduce motion status changes
 * @returns Function to remove the listener
 */
export const addReduceMotionChangeListener = (
  listener: (isEnabled: boolean) => void
): (() => void) => {
  return AccessibilityInfo.addEventListener('reduceMotionChanged', listener);
};

/**
 * Check if bold text is enabled
 * @returns Promise<boolean>
 */
export const isBoldTextEnabled = async (): Promise<boolean> => {
  return await AccessibilityInfo.isBoldTextEnabled();
};

/**
 * Add event listener for bold text status change
 * @param listener Function to call when bold text status changes
 * @returns Function to remove the listener
 */
export const addBoldTextChangeListener = (
  listener: (isEnabled: boolean) => void
): (() => void) => {
  return AccessibilityInfo.addEventListener('boldTextChanged', listener);
};

/**
 * Check if grayscale is enabled
 * @returns Promise<boolean>
 */
export const isGrayscaleEnabled = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    return false; // Not supported on Android
  }
  return await AccessibilityInfo.isGrayscaleEnabled();
};

/**
 * Add event listener for grayscale status change
 * @param listener Function to call when grayscale status changes
 * @returns Function to remove the listener
 */
export const addGrayscaleChangeListener = (
  listener: (isEnabled: boolean) => void
): (() => void) => {
  if (Platform.OS === 'android') {
    return () => {}; // Not supported on Android
  }
  return AccessibilityInfo.addEventListener('grayscaleChanged', listener);
};

/**
 * Check if invert colors is enabled
 * @returns Promise<boolean>
 */
export const isInvertColorsEnabled = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    return false; // Not supported on Android
  }
  return await AccessibilityInfo.isInvertColorsEnabled();
};

/**
 * Add event listener for invert colors status change
 * @param listener Function to call when invert colors status changes
 * @returns Function to remove the listener
 */
export const addInvertColorsChangeListener = (
  listener: (isEnabled: boolean) => void
): (() => void) => {
  if (Platform.OS === 'android') {
    return () => {}; // Not supported on Android
  }
  return AccessibilityInfo.addEventListener('invertColorsChanged', listener);
};

/**
 * Announce a message to screen readers
 * @param message Message to announce
 */
export const announceForAccessibility = (message: string): void => {
  AccessibilityInfo.announceForAccessibility(message);
};

/**
 * Get accessibility props for a component
 * @param label Accessibility label
 * @param hint Accessibility hint
 * @param role Accessibility role
 * @param state Accessibility state
 * @returns Accessibility props
 */
export const getAccessibilityProps = (
  label: string,
  hint?: string,
  role?: 'none' | 'button' | 'link' | 'search' | 'image' | 'text' | 'adjustable' | 'header' | 'summary' | 'imagebutton',
  state?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  }
) => {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: role,
    accessibilityState: state,
  };
};

/**
 * Get accessibility props for a button
 * @param label Accessibility label
 * @param hint Accessibility hint
 * @param disabled Whether the button is disabled
 * @returns Accessibility props
 */
export const getButtonAccessibilityProps = (
  label: string,
  hint?: string,
  disabled?: boolean
) => {
  return getAccessibilityProps(label, hint, 'button', { disabled });
};

/**
 * Get accessibility props for a link
 * @param label Accessibility label
 * @param hint Accessibility hint
 * @returns Accessibility props
 */
export const getLinkAccessibilityProps = (
  label: string,
  hint?: string
) => {
  return getAccessibilityProps(label, hint, 'link');
};

/**
 * Get accessibility props for an image
 * @param label Accessibility label
 * @param hint Accessibility hint
 * @returns Accessibility props
 */
export const getImageAccessibilityProps = (
  label: string,
  hint?: string
) => {
  return getAccessibilityProps(label, hint, 'image');
};

/**
 * Get accessibility props for a header
 * @param label Accessibility label
 * @param hint Accessibility hint
 * @returns Accessibility props
 */
export const getHeaderAccessibilityProps = (
  label: string,
  hint?: string
) => {
  return getAccessibilityProps(label, hint, 'header');
};

/**
 * Get accessibility props for a checkbox
 * @param label Accessibility label
 * @param hint Accessibility hint
 * @param checked Whether the checkbox is checked
 * @param disabled Whether the checkbox is disabled
 * @returns Accessibility props
 */
export const getCheckboxAccessibilityProps = (
  label: string,
  hint?: string,
  checked?: boolean,
  disabled?: boolean
) => {
  return getAccessibilityProps(label, hint, 'button', { checked, disabled });
};

/**
 * Get accessibility props for a switch
 * @param label Accessibility label
 * @param hint Accessibility hint
 * @param checked Whether the switch is checked
 * @param disabled Whether the switch is disabled
 * @returns Accessibility props
 */
export const getSwitchAccessibilityProps = (
  label: string,
  hint?: string,
  checked?: boolean,
  disabled?: boolean
) => {
  return getAccessibilityProps(label, hint, 'button', { checked, disabled });
};

/**
 * Get accessibility props for a tab
 * @param label Accessibility label
 * @param hint Accessibility hint
 * @param selected Whether the tab is selected
 * @returns Accessibility props
 */
export const getTabAccessibilityProps = (
  label: string,
  hint?: string,
  selected?: boolean
) => {
  return getAccessibilityProps(label, hint, 'button', { selected });
};

/**
 * Get accessibility props for an expandable section
 * @param label Accessibility label
 * @param hint Accessibility hint
 * @param expanded Whether the section is expanded
 * @returns Accessibility props
 */
export const getExpandableAccessibilityProps = (
  label: string,
  hint?: string,
  expanded?: boolean
) => {
  return getAccessibilityProps(label, hint, 'button', { expanded });
};

export default {
  isScreenReaderEnabled,
  addScreenReaderChangeListener,
  isReduceMotionEnabled,
  addReduceMotionChangeListener,
  isBoldTextEnabled,
  addBoldTextChangeListener,
  isGrayscaleEnabled,
  addGrayscaleChangeListener,
  isInvertColorsEnabled,
  addInvertColorsChangeListener,
  announceForAccessibility,
  getAccessibilityProps,
  getButtonAccessibilityProps,
  getLinkAccessibilityProps,
  getImageAccessibilityProps,
  getHeaderAccessibilityProps,
  getCheckboxAccessibilityProps,
  getSwitchAccessibilityProps,
  getTabAccessibilityProps,
  getExpandableAccessibilityProps,
};
