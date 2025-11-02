import React, { useMemo, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootState } from '../app/store';
import { RootStackParamList } from '../navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateProfile } from '../features/auth/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const AnimatedView = Animated.createAnimatedComponent(View);

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { slots } = useSelector((s: RootState) => s.parking);
  const auth = useSelector((s: RootState) => s.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, _setProfilePhoto] = useState<string | null>(null);
  
  // User details state - getting from Redux auth state
  const [userDetails, setUserDetails] = useState({
    name: auth.name || '',
    email: auth.email || '',
    phone: auth.phone || '',
    customerId: auth.customerId || '',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Get all booked slots by the current user
  const bookedSlotsCount = useMemo(() => {
    return slots.filter(s => s.status === 'booked' && s.bookedBy === auth.customerId).length;
  }, [slots, auth.customerId]);

  // Update user details when auth state changes
  useEffect(() => {
    setUserDetails({
      name: auth.name || '',
      email: auth.email || '',
      phone: auth.phone || '',
      customerId: auth.customerId || '',
    });
  }, [auth]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handlePhotoSelect = () => {
    // For now, we'll use a placeholder approach
    // In production, you'd integrate with react-native-image-picker
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Gallery', onPress: () => console.log('Open gallery') },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleSave = () => {
    // Basic validation
    const trimmedName = userDetails.name?.trim();
    const trimmedEmail = userDetails.email?.trim();
    const trimmedPhone = userDetails.phone?.trim();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName || trimmedName.length < 2) {
      Alert.alert('Validation Error', 'Please enter a valid name (at least 2 characters)');
      return;
    }

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    if (!trimmedPhone || trimmedPhone.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid phone number (at least 10 digits)');
      return;
    }

    // Save to Redux
    dispatch(updateProfile({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
    }));
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values from Redux
    setUserDetails({
      name: auth.name || '',
      email: auth.email || '',
      phone: auth.phone || '',
      customerId: auth.customerId || '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header Background */}
      <AnimatedView
        style={[
          styles.headerBackground,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.decorationCircle1} />
        <View style={styles.decorationCircle2} />
      </AnimatedView>

      <AnimatedView
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header with back button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your personal information</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Profile Photo Section */}
            <View style={styles.photoSection}>
              <TouchableOpacity
                onPress={handlePhotoSelect}
                style={styles.photoContainer}
                activeOpacity={0.8}
              >
                {profilePhoto ? (
                  <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoIcon}>👤</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Stats Card */}
            <View style={styles.statsCard}>
              <View style={styles.statsItem}>
                <Text style={styles.statsNumber}>{bookedSlotsCount}</Text>
                <Text style={styles.statsLabel}>
                  {bookedSlotsCount === 1 ? 'Slot' : 'Slots'} Booked
                </Text>
              </View>
              <View style={styles.statsDivider} />
                <View style={styles.statsItem}>
                  <Text style={[styles.statsNumber, styles.sizeCustomerId]}>{userDetails.customerId}</Text>
                  <Text style={styles.statsLabel}>Customer ID</Text>
                </View>
            </View>

            {/* Personal Details Section */}
            <Text style={styles.sectionTitle}>Personal Details</Text>

            <View style={styles.detailsCard}>
              {/* Name Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.inputField}
                    value={userDetails.name}
                    onChangeText={(text) => setUserDetails({ ...userDetails, name: text })}
                    placeholder="Enter your name"
                  />
                ) : (
                  <Text style={styles.fieldValue}>
                    {userDetails.name || 'Not provided'}
                  </Text>
                )}
              </View>

              <View style={styles.fieldDivider} />

              {/* Email Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Email</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.inputField}
                    value={userDetails.email}
                    onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.fieldValue}>
                    {userDetails.email || 'Not provided'}
                  </Text>
                )}
              </View>

              <View style={styles.fieldDivider} />

              {/* Phone Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.inputField}
                    value={userDetails.phone}
                    onChangeText={(text) => setUserDetails({ ...userDetails, phone: text })}
                    placeholder="Enter your phone"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.fieldValue}>
                    {userDetails.phone || 'Not provided'}
                  </Text>
                )}
              </View>
            </View>

            {/* Edit/Save Buttons */}
            {!isEditing ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.editButtonText}> Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                  activeOpacity={0.85}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSave}
                  activeOpacity={0.85}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </AnimatedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: '#0ea5e9',
  },
  decorationCircle1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorationCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  photoIcon: {
    fontSize: 60,
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editPhotoIcon: {
    fontSize: 20,
  },
  photoHint: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statsItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsNumber: {
    fontSize: 25,
    fontWeight: '900',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  sizeCustomerId : {
    fontSize: 20,
    marginTop : 5,
  },
  statsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  fieldContainer: {
    paddingVertical: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  inputField: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  editButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default React.memo(ProfileScreen);

