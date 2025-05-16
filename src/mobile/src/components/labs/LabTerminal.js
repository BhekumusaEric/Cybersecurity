import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LabTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Ethical Hacking LMS Terminal v1.0' },
    { type: 'system', content: 'Type "help" for available commands.' },
    { type: 'system', content: 'Connected to lab environment.' },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const scrollViewRef = useRef();
  const inputRef = useRef();

  // Scroll to bottom when history changes
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [history]);

  // Process command
  const processCommand = (cmd) => {
    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: cmd }]);

    // Add to command history for up/down navigation
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Process command
    let response;

    switch (cmd.trim().toLowerCase()) {
      case 'help':
        response = [
          { type: 'output', content: 'Available commands:' },
          { type: 'output', content: '  help - Show this help message' },
          { type: 'output', content: '  clear - Clear the terminal' },
          { type: 'output', content: '  ls - List files in current directory' },
          { type: 'output', content: '  cd [dir] - Change directory' },
          { type: 'output', content: '  cat [file] - Display file contents' },
          { type: 'output', content: '  nmap [options] [target] - Network scanning' },
          { type: 'output', content: '  ping [host] - Ping a host' },
          { type: 'output', content: '  ifconfig - Display network configuration' },
        ];
        break;

      case 'clear':
        setHistory([
          { type: 'system', content: 'Terminal cleared.' },
        ]);
        return;

      case 'ls':
        response = [
          { type: 'output', content: 'Documents  Downloads  Pictures  tools  scan_results.txt' },
        ];
        break;

      case 'ifconfig':
        response = [
          { type: 'output', content: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500' },
          { type: 'output', content: '        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255' },
          { type: 'output', content: '        inet6 fe80::216:3eff:fe74:5555  prefixlen 64  scopeid 0x20<link>' },
          { type: 'output', content: '        ether 00:16:3e:74:55:55  txqueuelen 1000  (Ethernet)' },
          { type: 'output', content: '        RX packets 8935  bytes 13342770 (12.7 MiB)' },
          { type: 'output', content: '        RX errors 0  dropped 0  overruns 0  frame 0' },
          { type: 'output', content: '        TX packets 4637  bytes 421209 (411.3 KiB)' },
          { type: 'output', content: '        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0' },
        ];
        break;

      case 'ping 192.168.1.1':
        response = [
          { type: 'output', content: 'PING 192.168.1.1 (192.168.1.1) 56(84) bytes of data.' },
          { type: 'output', content: '64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.354 ms' },
          { type: 'output', content: '64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.427 ms' },
          { type: 'output', content: '64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=0.411 ms' },
          { type: 'output', content: '64 bytes from 192.168.1.1: icmp_seq=4 ttl=64 time=0.401 ms' },
          { type: 'output', content: '' },
          { type: 'output', content: '--- 192.168.1.1 ping statistics ---' },
          { type: 'output', content: '4 packets transmitted, 4 received, 0% packet loss, time 3055ms' },
          { type: 'output', content: 'rtt min/avg/max/mdev = 0.354/0.398/0.427/0.030 ms' },
        ];
        break;

      case 'nmap 192.168.1.0/24':
        response = [
          { type: 'output', content: 'Starting Nmap 7.92 ( https://nmap.org ) at 2023-08-15 14:30 UTC' },
          { type: 'output', content: 'Nmap scan report for router.lab (192.168.1.1)' },
          { type: 'output', content: 'Host is up (0.0054s latency).' },
          { type: 'output', content: 'Not shown: 995 closed ports' },
          { type: 'output', content: 'PORT     STATE SERVICE' },
          { type: 'output', content: '22/tcp   open  ssh' },
          { type: 'output', content: '53/tcp   open  domain' },
          { type: 'output', content: '80/tcp   open  http' },
          { type: 'output', content: '443/tcp  open  https' },
          { type: 'output', content: '8080/tcp open  http-proxy' },
          { type: 'output', content: '' },
          { type: 'output', content: 'Nmap scan report for webserver.lab (192.168.1.100)' },
          { type: 'output', content: 'Host is up (0.0076s latency).' },
          { type: 'output', content: 'Not shown: 997 closed ports' },
          { type: 'output', content: 'PORT    STATE SERVICE' },
          { type: 'output', content: '22/tcp  open  ssh' },
          { type: 'output', content: '80/tcp  open  http' },
          { type: 'output', content: '443/tcp open  https' },
          { type: 'output', content: '' },
          { type: 'output', content: 'Nmap scan report for database.lab (192.168.1.101)' },
          { type: 'output', content: 'Host is up (0.0082s latency).' },
          { type: 'output', content: 'Not shown: 998 closed ports' },
          { type: 'output', content: 'PORT     STATE SERVICE' },
          { type: 'output', content: '22/tcp   open  ssh' },
          { type: 'output', content: '3306/tcp open  mysql' },
          { type: 'output', content: '' },
          { type: 'output', content: 'Nmap done: 256 IP addresses (3 hosts up) scanned in 8.76 seconds' },
        ];
        break;

      case 'cat scan_results.txt':
        response = [
          { type: 'output', content: '# Network Scan Results' },
          { type: 'output', content: 'Date: 2023-08-15' },
          { type: 'output', content: '' },
          { type: 'output', content: '## Discovered Hosts' },
          { type: 'output', content: '- 192.168.1.1 (Router)' },
          { type: 'output', content: '- 192.168.1.100 (Web Server)' },
          { type: 'output', content: '- 192.168.1.101 (Database Server)' },
          { type: 'output', content: '' },
          { type: 'output', content: '## Potential Vulnerabilities' },
          { type: 'output', content: '1. Web server running outdated Apache version' },
          { type: 'output', content: '2. SSH allowing password authentication' },
          { type: 'output', content: '3. MySQL exposed to network' },
        ];
        break;

      default:
        if (cmd.startsWith('cd ')) {
          response = [
            { type: 'output', content: `Changed directory to ${cmd.substring(3)}` },
          ];
        } else if (cmd.startsWith('nmap ')) {
          response = [
            { type: 'output', content: 'Starting Nmap scan...' },
            { type: 'output', content: 'This would perform a real Nmap scan in an actual lab environment.' },
            { type: 'output', content: 'Scan completed in 3.45s' },
          ];
        } else {
          response = [
            { type: 'error', content: `Command not found: ${cmd}` },
            { type: 'error', content: 'Type "help" for available commands.' },
          ];
        }
    }

    // Add response to history
    setHistory(prev => [...prev, ...response]);
  };

  // Handle command submission
  const handleSubmit = () => {
    if (input.trim()) {
      processCommand(input.trim());
      setInput('');
    }
  };

  // Navigate command history
  const navigateHistory = (direction) => {
    if (commandHistory.length === 0) return;

    let newIndex;
    if (direction === 'up') {
      newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
    } else {
      newIndex = historyIndex === -1 ? -1 : Math.min(commandHistory.length - 1, historyIndex + 1);
    }

    setHistoryIndex(newIndex);

    if (newIndex !== -1) {
      setInput(commandHistory[newIndex]);
    } else {
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.output}
        contentContainerStyle={styles.outputContent}
      >
        {history.map((item, index) => (
          <Text
            key={index}
            style={[
              styles.text,
              item.type === 'command' && styles.command,
              item.type === 'error' && styles.error,
              item.type === 'system' && styles.system,
            ]}
          >
            {item.type === 'command' ? '$ ' + item.content : item.content}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Text style={styles.prompt}>$</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          returnKeyType="go"
          blurOnSubmit={false}
          placeholder="Enter command..."
        />

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigateHistory('up')}
            accessibilityLabel="Up"
          >
            <Icon name="arrow-up" size={20} color="#fff" />
            <Text style={styles.hiddenText}>↑</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => navigateHistory('down')}
            accessibilityLabel="Down"
          >
            <Icon name="arrow-down" size={20} color="#fff" />
            <Text style={styles.hiddenText}>↓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleSubmit}
            accessibilityLabel="Submit"
          >
            <Icon name="send" size={20} color="#fff" />
            <Text style={styles.hiddenText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }}
            accessibilityLabel="Keyboard"
          >
            <Icon name="keyboard" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  output: {
    flex: 1,
    padding: 8,
  },
  outputContent: {
    paddingBottom: 8,
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 4,
  },
  command: {
    color: '#4CAF50',
  },
  error: {
    color: '#F44336',
  },
  system: {
    color: '#2196F3',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: 8,
  },
  prompt: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    color: '#f0f0f0',
    height: 40,
    padding: 0,
  },
  controls: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  controlButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 15,
    marginLeft: 4,
  },
  hiddenText: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

export default LabTerminal;
