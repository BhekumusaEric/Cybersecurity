import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Card, Title, Paragraph, Chip } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const OfflineLabSimulation = ({ lab }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodeInfo, setShowNodeInfo] = useState(false);
  const [scale, setScale] = useState(1);
  const [lastPinchDistance, setLastPinchDistance] = useState(null);
  
  // Initialize nodes and edges from lab topology
  useEffect(() => {
    if (lab && lab.topology) {
      // Create nodes with positions
      const initialNodes = lab.topology.nodes.map((node, index) => {
        // Calculate position in a circle
        const angle = (2 * Math.PI * index) / lab.topology.nodes.length;
        const radius = Math.min(width, height) * 0.3;
        const x = width / 2 + radius * Math.cos(angle);
        const y = height / 2 + radius * Math.sin(angle);
        
        return {
          ...node,
          x: new Animated.Value(x),
          y: new Animated.Value(y),
          panResponder: createPanResponder(index),
        };
      });
      
      setNodes(initialNodes);
      setEdges(lab.topology.edges);
    }
  }, [lab]);
  
  // Create pan responder for dragging nodes
  const createPanResponder = (nodeIndex) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // When the user starts dragging, make this node the selected one
        setSelectedNode(nodeIndex);
      },
      onPanResponderMove: (event, gesture) => {
        // Update node position as user drags
        nodes[nodeIndex].x.setValue(gesture.moveX);
        nodes[nodeIndex].y.setValue(gesture.moveY);
      },
      onPanResponderRelease: () => {
        // When the user stops dragging, keep this node as selected
        // but allow showing its info
        setShowNodeInfo(true);
      },
    });
  };
  
  // Handle pinch to zoom
  const viewPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event) => {
      // Only handle multi-touch events for pinch
      return event.nativeEvent.touches.length === 2;
    },
    onPanResponderMove: (event) => {
      if (event.nativeEvent.touches.length === 2) {
        const touch1 = event.nativeEvent.touches[0];
        const touch2 = event.nativeEvent.touches[1];
        
        // Calculate distance between touches
        const distance = Math.sqrt(
          Math.pow(touch2.pageX - touch1.pageX, 2) +
          Math.pow(touch2.pageY - touch1.pageY, 2)
        );
        
        if (lastPinchDistance !== null) {
          // Calculate scale change
          const change = distance / lastPinchDistance;
          const newScale = scale * change;
          
          // Limit scale to reasonable values
          if (newScale >= 0.5 && newScale <= 2) {
            setScale(newScale);
          }
        }
        
        setLastPinchDistance(distance);
      }
    },
    onPanResponderRelease: () => {
      setLastPinchDistance(null);
    },
  });
  
  // Get node position
  const getNodePosition = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : null;
  };
  
  // Render node
  const renderNode = (node, index) => {
    const isSelected = selectedNode === index;
    
    // Determine icon based on node type
    let iconName = 'laptop';
    let iconColor = '#1976d2';
    
    if (node.type === 'attacker') {
      iconName = 'laptop';
      iconColor = '#f44336';
    } else if (node.type === 'target') {
      iconName = 'server';
      iconColor = '#4caf50';
    } else if (node.type === 'network') {
      iconName = 'router-wireless';
      iconColor = '#ff9800';
    }
    
    return (
      <Animated.View
        key={node.id}
        style={[
          styles.node,
          {
            transform: [
              { translateX: Animated.subtract(node.x, 30) },
              { translateY: Animated.subtract(node.y, 30) },
              { scale: scale },
            ],
            borderColor: isSelected ? '#1976d2' : 'transparent',
          },
        ]}
        {...node.panResponder.panHandlers}
      >
        <Icon name={iconName} size={36} color={iconColor} />
        <Text style={styles.nodeLabel}>{node.label}</Text>
      </Animated.View>
    );
  };
  
  // Render edge between nodes
  const renderEdge = (edge, index) => {
    const fromPosition = getNodePosition(edge.from);
    const toPosition = getNodePosition(edge.to);
    
    if (!fromPosition || !toPosition) return null;
    
    // Calculate line properties
    const lineStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      transform: [{ scale: scale }],
    };
    
    return (
      <Svg key={`edge-${index}`} style={lineStyle}>
        <Line
          x1={fromPosition.x.__getValue()}
          y1={fromPosition.y.__getValue()}
          x2={toPosition.x.__getValue()}
          y2={toPosition.y.__getValue()}
          stroke="#666"
          strokeWidth="2"
        />
      </Svg>
    );
  };
  
  // Render node info card
  const renderNodeInfo = () => {
    if (selectedNode === null || !showNodeInfo) return null;
    
    const node = nodes[selectedNode];
    
    return (
      <Card style={styles.nodeInfoCard}>
        <Card.Content>
          <Title>{node.label}</Title>
          <Chip style={styles.nodeTypeChip}>
            {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
          </Chip>
          
          <Paragraph style={styles.nodeInfoText}>
            {node.type === 'attacker' && 'This is your attack machine. Use it to scan and exploit targets.'}
            {node.type === 'target' && 'This is a target machine. Scan it for vulnerabilities.'}
            {node.type === 'network' && 'This is a network device that connects other machines.'}
          </Paragraph>
          
          <View style={styles.nodeInfoDetails}>
            <Text style={styles.nodeInfoLabel}>IP Address:</Text>
            <Text style={styles.nodeInfoValue}>
              {node.type === 'attacker' && '192.168.1.10'}
              {node.type === 'target' && node.label.includes('Web') && '192.168.1.100'}
              {node.type === 'target' && node.label.includes('Database') && '192.168.1.101'}
              {node.type === 'network' && '192.168.1.1'}
            </Text>
          </View>
          
          <View style={styles.nodeInfoDetails}>
            <Text style={styles.nodeInfoLabel}>OS:</Text>
            <Text style={styles.nodeInfoValue}>
              {node.type === 'attacker' && 'Kali Linux'}
              {node.type === 'target' && node.label.includes('Web') && 'Ubuntu Server 20.04'}
              {node.type === 'target' && node.label.includes('Database') && 'CentOS 7'}
              {node.type === 'network' && 'Custom Firmware'}
            </Text>
          </View>
          
          <View style={styles.nodeInfoDetails}>
            <Text style={styles.nodeInfoLabel}>Services:</Text>
            <Text style={styles.nodeInfoValue}>
              {node.type === 'attacker' && 'SSH, HTTP'}
              {node.type === 'target' && node.label.includes('Web') && 'SSH, HTTP, HTTPS'}
              {node.type === 'target' && node.label.includes('Database') && 'SSH, MySQL'}
              {node.type === 'network' && 'SSH, HTTP, DNS'}
            </Text>
          </View>
        </Card.Content>
        
        <Card.Actions>
          <Button onPress={() => setShowNodeInfo(false)}>Close</Button>
          <Button
            mode="contained"
            onPress={() => {
              // In a real implementation, this would interact with the node
              setShowNodeInfo(false);
            }}
          >
            Interact
          </Button>
        </Card.Actions>
      </Card>
    );
  };
  
  // Render simulation controls
  const renderControls = () => {
    return (
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setScale(Math.min(2, scale + 0.1))}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setScale(Math.max(0.5, scale - 0.1))}
        >
          <Icon name="minus" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setScale(1)}
        >
          <Icon name="restore" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <View style={styles.container} {...viewPanResponder.panHandlers}>
      <View style={styles.topologyContainer}>
        {/* Render edges first so they appear behind nodes */}
        {edges.map(renderEdge)}
        {nodes.map(renderNode)}
      </View>
      
      {renderNodeInfo()}
      {renderControls()}
      
      <View style={styles.offlineIndicator}>
        <Icon name="wifi-off" size={16} color="#fff" />
        <Text style={styles.offlineText}>Offline Simulation</Text>
      </View>
    </View>
  );
};

// Mock SVG components for the example
// In a real implementation, you would use react-native-svg
const Svg = ({ children, style }) => (
  <View style={style}>
    {children}
  </View>
);

const Line = ({ x1, y1, x2, y2, stroke, strokeWidth }) => {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  
  return (
    <View
      style={{
        position: 'absolute',
        left: x1,
        top: y1,
        width: length,
        height: parseInt(strokeWidth),
        backgroundColor: stroke,
        transform: [
          { translateX: 0 },
          { translateY: -parseInt(strokeWidth) / 2 },
          { rotate: `${angle}deg` },
          { translateX: 0 },
        ],
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topologyContainer: {
    flex: 1,
  },
  node: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nodeLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  nodeInfoCard: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    elevation: 8,
  },
  nodeTypeChip: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  nodeInfoText: {
    marginVertical: 8,
  },
  nodeInfoDetails: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  nodeInfoLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  nodeInfoValue: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 4,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
});

export default OfflineLabSimulation;
