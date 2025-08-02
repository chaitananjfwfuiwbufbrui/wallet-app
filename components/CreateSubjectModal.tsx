import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Alert } from 'react-native';
import { X, Plus, Camera, Type, Trash2 } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

interface CreateSubjectModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateSubject: (subject: { name: string; topics: string[]; icon: string; color: string }) => void;
}

const SUBJECT_COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', 
  '#EF4444', '#06B6D4', '#8B5A2B', '#EC4899'
];

const SUBJECT_ICONS = ['📚', '💻', '🔬', '🎨', '🏃‍♂️', '🌍', '🎵', '🍳'];

export function CreateSubjectModal({ visible, onClose, onCreateSubject }: CreateSubjectModalProps) {
  const [mode, setMode] = useState<'manual' | 'camera'>('manual');
  const [subjectName, setSubjectName] = useState('');
  const [topics, setTopics] = useState<string[]>(['']);
  const [selectedIcon, setSelectedIcon] = useState(SUBJECT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0]);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const resetForm = () => {
    setSubjectName('');
    setTopics(['']);
    setSelectedIcon(SUBJECT_ICONS[0]);
    setSelectedColor(SUBJECT_COLORS[0]);
    setMode('manual');
    setShowCamera(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addTopic = () => {
    setTopics([...topics, '']);
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const removeTopic = (index: number) => {
    if (topics.length > 1) {
      const newTopics = topics.filter((_, i) => i !== index);
      setTopics(newTopics);
    }
  };

  const handleCreateSubject = () => {
    if (!subjectName.trim()) {
      Alert.alert('Error', 'Please enter a subject name');
      return;
    }

    const validTopics = topics.filter(topic => topic.trim() !== '');
    if (validTopics.length === 0) {
      Alert.alert('Error', 'Please add at least one topic');
      return;
    }

    onCreateSubject({
      name: subjectName.trim(),
      topics: validTopics,
      icon: selectedIcon,
      color: selectedColor
    });

    handleClose();
  };

  const handleCameraCapture = () => {
    // Simulate OCR processing
    setSubjectName('Photography Basics');
    setTopics([
      'Camera Settings',
      'Composition Rules',
      'Lighting Techniques',
      'Post-Processing',
      'Portrait Photography'
    ]);
    setSelectedIcon('📷');
    setShowCamera(false);
    setMode('manual');
  };

  const openCamera = async () => {
    if (!permission) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to capture learning content');
        return;
      }
    }
    
    if (!permission?.granted) {
      Alert.alert('Permission Required', 'Camera access is needed to capture learning content');
      return;
    }

    setShowCamera(true);
  };

  if (showCamera) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={facing}>
            <View style={styles.cameraOverlay}>
              <TouchableOpacity style={styles.cameraCloseButton} onPress={() => setShowCamera(false)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.cameraInstructions}>
                <Text style={styles.cameraInstructionText}>
                  Point camera at text, book, or document to create a new subject
                </Text>
              </View>
              
              <View style={styles.cameraActions}>
                <TouchableOpacity style={styles.captureButton} onPress={handleCameraCapture}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Create New Subject</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'manual' && styles.activeModeButton]}
            onPress={() => setMode('manual')}
          >
            <Type size={20} color={mode === 'manual' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.modeButtonText, mode === 'manual' && styles.activeModeButtonText]}>
              Manual Entry
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modeButton, mode === 'camera' && styles.activeModeButton]}
            onPress={() => setMode('camera')}
          >
            <Camera size={20} color={mode === 'camera' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.modeButtonText, mode === 'camera' && styles.activeModeButtonText]}>
              Camera Capture
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {mode === 'manual' ? (
            <View style={styles.manualForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subject Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={subjectName}
                  onChangeText={setSubjectName}
                  placeholder="e.g., Advanced Mathematics"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Choose Icon</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
                  {SUBJECT_ICONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[styles.iconOption, selectedIcon === icon && styles.selectedIconOption]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Text style={styles.iconText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Choose Color</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorSelector}>
                  {SUBJECT_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[styles.colorOption, { backgroundColor: color }, selectedColor === color && styles.selectedColorOption]}
                      onPress={() => setSelectedColor(color)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.topicsHeader}>
                  <Text style={styles.label}>Topics to Cover</Text>
                  <TouchableOpacity style={styles.addTopicButton} onPress={addTopic}>
                    <Plus size={16} color="#3B82F6" />
                    <Text style={styles.addTopicText}>Add Topic</Text>
                  </TouchableOpacity>
                </View>
                
                {topics.map((topic, index) => (
                  <View key={index} style={styles.topicInputContainer}>
                    <TextInput
                      style={styles.topicInput}
                      value={topic}
                      onChangeText={(value) => updateTopic(index, value)}
                      placeholder={`Topic ${index + 1}`}
                      placeholderTextColor="#9CA3AF"
                    />
                    {topics.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeTopicButton}
                        onPress={() => removeTopic(index)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.cameraMode}>
              <View style={styles.cameraInstructionCard}>
                <Camera size={48} color="#3B82F6" />
                <Text style={styles.cameraInstructionTitle}>Capture Learning Content</Text>
                <Text style={styles.cameraInstructionDescription}>
                  Take a photo of textbooks, notes, or any learning material. Our AI will analyze 
                  the content and automatically create a subject with relevant topics.
                </Text>
                
                <TouchableOpacity style={styles.openCameraButton} onPress={openCamera}>
                  <Camera size={20} color="#FFFFFF" />
                  <Text style={styles.openCameraButtonText}>Open Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.createButton, (!subjectName.trim() || topics.filter(t => t.trim()).length === 0) && styles.disabledButton]} 
            onPress={handleCreateSubject}
            disabled={!subjectName.trim() || topics.filter(t => t.trim()).length === 0}
          >
            <Text style={styles.createButtonText}>Create Subject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeModeButton: {
    backgroundColor: '#3B82F6',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeModeButtonText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  manualForm: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconSelector: {
    flexDirection: 'row',
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconOption: {
    borderColor: '#3B82F6',
    backgroundColor: '#EEF2FF',
  },
  iconText: {
    fontSize: 20,
  },
  colorSelector: {
    flexDirection: 'row',
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#1F2937',
  },
  topicsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addTopicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addTopicText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  topicInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  removeTopicButton: {
    marginLeft: 12,
    padding: 8,
  },
  cameraMode: {
    paddingBottom: 20,
  },
  cameraInstructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cameraInstructionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  cameraInstructionDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  openCameraButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openCameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  createButton: {
    flex: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  cameraCloseButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  cameraInstructions: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cameraInstructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  cameraActions: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});