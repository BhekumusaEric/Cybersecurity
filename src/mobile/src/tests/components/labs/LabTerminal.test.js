import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import LabTerminal from '../../../components/labs/LabTerminal';

// Mock the Icon component
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

// Mock the Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android',
  select: jest.fn().mockImplementation(obj => obj.android),
}));

describe('LabTerminal', () => {
  it('renders correctly', () => {
    const { getByText } = render(<LabTerminal />);
    
    // Check if initial messages are displayed
    expect(getByText('Ethical Hacking LMS Terminal v1.0')).toBeTruthy();
    expect(getByText('Type "help" for available commands.')).toBeTruthy();
    expect(getByText('Connected to lab environment.')).toBeTruthy();
  });
  
  it('processes help command correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LabTerminal />);
    
    // Find the input field
    const input = getByPlaceholderText('Enter command...');
    
    // Type and submit the help command
    fireEvent.changeText(input, 'help');
    fireEvent.press(getByText('Submit'));
    
    // Check if help text is displayed
    expect(getByText('Available commands:')).toBeTruthy();
    expect(getByText('  help - Show this help message')).toBeTruthy();
    expect(getByText('  clear - Clear the terminal')).toBeTruthy();
  });
  
  it('processes clear command correctly', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<LabTerminal />);
    
    // Find the input field
    const input = getByPlaceholderText('Enter command...');
    
    // Type and submit the clear command
    fireEvent.changeText(input, 'clear');
    fireEvent.press(getByText('Submit'));
    
    // Check if terminal was cleared
    expect(queryByText('Ethical Hacking LMS Terminal v1.0')).toBeNull();
    expect(getByText('Terminal cleared.')).toBeTruthy();
  });
  
  it('processes invalid command correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LabTerminal />);
    
    // Find the input field
    const input = getByPlaceholderText('Enter command...');
    
    // Type and submit an invalid command
    fireEvent.changeText(input, 'invalid-command');
    fireEvent.press(getByText('Submit'));
    
    // Check if error message is displayed
    expect(getByText('Command not found: invalid-command')).toBeTruthy();
    expect(getByText('Type "help" for available commands.')).toBeTruthy();
  });
  
  it('navigates command history correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LabTerminal />);
    
    // Find the input field
    const input = getByPlaceholderText('Enter command...');
    
    // Type and submit multiple commands
    fireEvent.changeText(input, 'ls');
    fireEvent.press(getByText('Submit'));
    
    fireEvent.changeText(input, 'pwd');
    fireEvent.press(getByText('Submit'));
    
    // Press up arrow to navigate history
    fireEvent.press(getByText('↑'));
    
    // Check if input field contains the last command
    expect(input.props.value).toBe('pwd');
    
    // Press up arrow again
    fireEvent.press(getByText('↑'));
    
    // Check if input field contains the second-to-last command
    expect(input.props.value).toBe('ls');
    
    // Press down arrow
    fireEvent.press(getByText('↓'));
    
    // Check if input field contains the last command again
    expect(input.props.value).toBe('pwd');
  });
  
  it('processes nmap command correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LabTerminal />);
    
    // Find the input field
    const input = getByPlaceholderText('Enter command...');
    
    // Type and submit the nmap command
    fireEvent.changeText(input, 'nmap 192.168.1.0/24');
    fireEvent.press(getByText('Submit'));
    
    // Check if nmap output is displayed
    expect(getByText('Starting Nmap 7.92 ( https://nmap.org ) at 2023-08-15 14:30 UTC')).toBeTruthy();
    expect(getByText('Nmap scan report for router.lab (192.168.1.1)')).toBeTruthy();
  });
  
  it('processes cat command correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LabTerminal />);
    
    // Find the input field
    const input = getByPlaceholderText('Enter command...');
    
    // Type and submit the cat command
    fireEvent.changeText(input, 'cat scan_results.txt');
    fireEvent.press(getByText('Submit'));
    
    // Check if file content is displayed
    expect(getByText('# Network Scan Results')).toBeTruthy();
    expect(getByText('Date: 2023-08-15')).toBeTruthy();
  });
});
