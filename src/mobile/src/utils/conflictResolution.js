/**
 * Utility functions for resolving conflicts between local and remote data
 */

/**
 * Resolve conflicts between local and remote progress data
 * @param {Object} localProgress - Local progress data
 * @param {Object} remoteProgress - Remote progress data
 * @returns {Object} Resolved progress data
 */
export const resolveProgressConflicts = (localProgress, remoteProgress) => {
  const resolvedProgress = { ...remoteProgress };
  
  // For each local progress item
  for (const [key, localValue] of Object.entries(localProgress)) {
    const remoteValue = remoteProgress[key];
    
    // If remote doesn't have this key, use local value
    if (remoteValue === undefined) {
      resolvedProgress[key] = localValue;
      continue;
    }
    
    // Handle different types of progress data
    if (key.includes('_progress')) {
      // For progress values (0-1), use the higher value
      resolvedProgress[key] = Math.max(localValue, remoteValue);
    } else if (key.includes('_completed')) {
      // For completion flags, true wins over false
      resolvedProgress[key] = localValue || remoteValue;
    } else if (key.includes('_timestamp')) {
      // For timestamps, use the more recent one
      const localDate = new Date(localValue);
      const remoteDate = new Date(remoteValue);
      resolvedProgress[key] = localDate > remoteDate ? localValue : remoteValue;
    } else if (key.includes('_score')) {
      // For scores, use the higher value
      resolvedProgress[key] = Math.max(localValue, remoteValue);
    } else if (key.includes('_attempts')) {
      // For attempt counts, use the higher value
      resolvedProgress[key] = Math.max(localValue, remoteValue);
    } else if (key.includes('_answers')) {
      // For answers, merge the arrays and remove duplicates
      if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
        const mergedAnswers = [...localValue, ...remoteValue];
        const uniqueAnswers = [...new Set(mergedAnswers)];
        resolvedProgress[key] = uniqueAnswers;
      } else {
        // If not arrays, use the local value (more recent)
        resolvedProgress[key] = localValue;
      }
    } else {
      // For other types, prefer local value (more recent)
      resolvedProgress[key] = localValue;
    }
  }
  
  return resolvedProgress;
};

/**
 * Resolve conflicts between local and remote content data
 * @param {Object} localContent - Local content data
 * @param {Object} remoteContent - Remote content data
 * @returns {Object} Resolved content data
 */
export const resolveContentConflicts = (localContent, remoteContent) => {
  // If one is null/undefined, return the other
  if (!localContent) return remoteContent;
  if (!remoteContent) return localContent;
  
  // Start with remote content as base
  const resolvedContent = { ...remoteContent };
  
  // Check if content has a lastModified field
  if (localContent.lastModified && remoteContent.lastModified) {
    const localDate = new Date(localContent.lastModified);
    const remoteDate = new Date(remoteContent.lastModified);
    
    // If local is more recent, use local content
    if (localDate > remoteDate) {
      return localContent;
    }
    
    // If remote is more recent, use remote content
    return remoteContent;
  }
  
  // If no lastModified field, merge the content
  // For arrays, concatenate and remove duplicates
  for (const [key, localValue] of Object.entries(localContent)) {
    const remoteValue = remoteContent[key];
    
    // Skip if key doesn't exist in remote
    if (remoteValue === undefined) {
      resolvedContent[key] = localValue;
      continue;
    }
    
    // Handle arrays
    if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
      // For arrays of objects with IDs, merge by ID
      if (localValue.length > 0 && typeof localValue[0] === 'object' && localValue[0].id) {
        const mergedArray = [...remoteValue];
        
        // Add or update items from local array
        for (const localItem of localValue) {
          const existingIndex = mergedArray.findIndex(item => item.id === localItem.id);
          
          if (existingIndex >= 0) {
            // Item exists, resolve conflicts recursively
            mergedArray[existingIndex] = resolveContentConflicts(localItem, mergedArray[existingIndex]);
          } else {
            // Item doesn't exist, add it
            mergedArray.push(localItem);
          }
        }
        
        resolvedContent[key] = mergedArray;
      } else {
        // For simple arrays, concatenate and remove duplicates
        const mergedArray = [...remoteValue, ...localValue];
        
        // Remove duplicates if items are primitive types
        if (mergedArray.length > 0 && typeof mergedArray[0] !== 'object') {
          resolvedContent[key] = [...new Set(mergedArray)];
        } else {
          resolvedContent[key] = mergedArray;
        }
      }
    } else if (typeof localValue === 'object' && localValue !== null && 
               typeof remoteValue === 'object' && remoteValue !== null) {
      // For nested objects, resolve conflicts recursively
      resolvedContent[key] = resolveContentConflicts(localValue, remoteValue);
    } else {
      // For primitive types, prefer local value (more recent)
      resolvedContent[key] = localValue;
    }
  }
  
  return resolvedContent;
};

/**
 * Detect conflicts between local and remote data
 * @param {Object} localData - Local data
 * @param {Object} remoteData - Remote data
 * @returns {Array} Array of conflict objects
 */
export const detectConflicts = (localData, remoteData) => {
  const conflicts = [];
  
  // For each key in local data
  for (const [key, localValue] of Object.entries(localData)) {
    const remoteValue = remoteData[key];
    
    // Skip if remote doesn't have this key
    if (remoteValue === undefined) {
      continue;
    }
    
    // Check for conflicts
    if (typeof localValue === 'object' && localValue !== null && 
        typeof remoteValue === 'object' && remoteValue !== null) {
      // For objects, check recursively
      const nestedConflicts = detectConflicts(localValue, remoteValue);
      
      if (nestedConflicts.length > 0) {
        conflicts.push({
          key,
          type: 'nested',
          localValue,
          remoteValue,
          nestedConflicts,
        });
      }
    } else if (JSON.stringify(localValue) !== JSON.stringify(remoteValue)) {
      // For primitive types, check if values are different
      conflicts.push({
        key,
        type: 'value',
        localValue,
        remoteValue,
      });
    }
  }
  
  return conflicts;
};

/**
 * Generate a conflict resolution strategy
 * @param {Array} conflicts - Array of conflict objects
 * @returns {Object} Resolution strategy
 */
export const generateResolutionStrategy = (conflicts) => {
  const strategy = {};
  
  for (const conflict of conflicts) {
    if (conflict.type === 'nested') {
      // For nested conflicts, generate strategy recursively
      strategy[conflict.key] = generateResolutionStrategy(conflict.nestedConflicts);
    } else {
      // For value conflicts, determine resolution strategy
      if (conflict.key.includes('_progress') || conflict.key.includes('_score')) {
        // For progress and scores, use the higher value
        strategy[conflict.key] = 'max';
      } else if (conflict.key.includes('_completed')) {
        // For completion flags, true wins
        strategy[conflict.key] = 'boolean_or';
      } else if (conflict.key.includes('_timestamp')) {
        // For timestamps, use the more recent one
        strategy[conflict.key] = 'recent';
      } else {
        // For other types, prefer local value
        strategy[conflict.key] = 'local';
      }
    }
  }
  
  return strategy;
};

/**
 * Apply resolution strategy to resolve conflicts
 * @param {Object} localData - Local data
 * @param {Object} remoteData - Remote data
 * @param {Object} strategy - Resolution strategy
 * @returns {Object} Resolved data
 */
export const applyResolutionStrategy = (localData, remoteData, strategy) => {
  const resolvedData = { ...remoteData };
  
  for (const [key, strategyValue] of Object.entries(strategy)) {
    const localValue = localData[key];
    const remoteValue = remoteData[key];
    
    // Skip if key doesn't exist in either data
    if (localValue === undefined || remoteValue === undefined) {
      continue;
    }
    
    if (typeof strategyValue === 'object') {
      // For nested strategy, apply recursively
      resolvedData[key] = applyResolutionStrategy(localValue, remoteValue, strategyValue);
    } else {
      // Apply strategy based on type
      switch (strategyValue) {
        case 'local':
          resolvedData[key] = localValue;
          break;
        case 'remote':
          resolvedData[key] = remoteValue;
          break;
        case 'max':
          resolvedData[key] = Math.max(localValue, remoteValue);
          break;
        case 'min':
          resolvedData[key] = Math.min(localValue, remoteValue);
          break;
        case 'boolean_or':
          resolvedData[key] = localValue || remoteValue;
          break;
        case 'boolean_and':
          resolvedData[key] = localValue && remoteValue;
          break;
        case 'recent':
          const localDate = new Date(localValue);
          const remoteDate = new Date(remoteValue);
          resolvedData[key] = localDate > remoteDate ? localValue : remoteValue;
          break;
        default:
          resolvedData[key] = localValue;
      }
    }
  }
  
  return resolvedData;
};
