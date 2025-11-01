import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  Animated, 
  ScrollView,
  Dimensions
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isFocused, setIsFocused] = useState({
    employeeId: false,
    password: false,
  });

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('Dashboard');
    });
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPasswordModal(false);
    navigation.replace('Dashboard');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={styles.root}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Background Gradient Effect */}
        <View style={styles.backgroundContainer}>
          <View style={styles.gradientCircle1} />
          <View style={styles.gradientCircle2} />
        </View>

        <Animated.View 
          style={[
            styles.container,
            { 
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Header with Logo */}
          <Animated.View 
            style={[
              styles.header,
              {
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoInner}>
                <Text style={styles.logoIcon}>🚗</Text>
              </View>
              <View style={styles.logoGlow} />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your credentials to access Smart Parking</Text>
          </Animated.View>

          {/* Form Container */}
          <View style={styles.form}>
            {/* Employee ID Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                <Text style={styles.labelIcon}>👤</Text> Employee ID
              </Text>
              <View style={[
                styles.inputContainer,
                isFocused.employeeId && styles.inputContainerFocused,
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your employee ID"
                  placeholderTextColor="#94a3b8"
                  value={employeeId}
                  onChangeText={setEmployeeId}
                  keyboardType="default"
                  autoCapitalize="none"
                  onFocus={() => setIsFocused({ ...isFocused, employeeId: true })}
                  onBlur={() => setIsFocused({ ...isFocused, employeeId: false })}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>
                  <Text style={styles.labelIcon}>🔒</Text> Password
                </Text>
                <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                  <Text style={styles.forgotPassword}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={[
                styles.passwordContainer,
                isFocused.password && styles.inputContainerFocused,
              ]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[
                  styles.signInButton,
                  (employeeId && password) && styles.signInButtonActive,
                ]}
                onPress={handleSignIn}
                activeOpacity={0.9}
                disabled={!employeeId || !password}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
                <Text style={styles.signInButtonIcon}>→</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Secure login with{' '}
              <Text style={styles.footerHighlight}>enterprise authentication</Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        visible={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSuccess={handleForgotPasswordSuccess}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  gradientCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#1e40af',
    opacity: 0.15,
    top: -width * 0.3,
    right: -width * 0.2,
  },
  gradientCircle2: {
    position: 'absolute',
    width: width * 1.0,
    height: width * 1.0,
    borderRadius: width * 0.5,
    backgroundColor: '#3b82f6',
    opacity: 0.1,
    bottom: -width * 0.2,
    left: -width * 0.2,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    justifyContent: 'center',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 56,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
    opacity: 0.3,
    zIndex: 1,
  },
  logoIcon: {
    fontSize: 52,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
    fontWeight: '500',
  },
  form: {
    marginBottom: 40,
  },
  fieldGroup: {
    marginBottom: 26,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  labelIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 16,
    backgroundColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainerFocused: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e293b',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    letterSpacing: -0.1,
  },
  passwordContainer: {
    position: 'relative',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 16,
    backgroundColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  passwordInput: {
    paddingHorizontal: 20,
    paddingRight: 60,
    paddingVertical: 18,
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  eyeIcon: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    zIndex: 10,
  },
  eyeIconText: {
    fontSize: 24,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
    borderRadius: 16,
    paddingVertical: 20,
    marginTop: 8,
    opacity: 0.6,
    gap: 10,
  },
  signInButtonActive: {
    backgroundColor: '#3b82f6',
    opacity: 1,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  signInButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  signInButtonIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    paddingHorizontal: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  footerHighlight: {
    color: '#60a5fa',
    fontWeight: '700',
  },
});

export default React.memo(LoginScreen);
