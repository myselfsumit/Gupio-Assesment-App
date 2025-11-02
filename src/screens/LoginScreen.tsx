import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { login } from '../features/auth/authSlice';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '../validation/Validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isFocused, setIsFocused] = useState({
    employeeId: false,
    password: false,
  });

  // Form with Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      employeeId: '',
      password: '',
    },
  });


  // Optimized fade animations - no slide, just smooth fade
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const formFade = useRef(new Animated.Value(0)).current;
  const footerFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Smooth fade-in sequence with staggered timing for better UX
    Animated.parallel([
      // Overall container fade
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Logo animation with scale and fade
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          delay: 100,
          useNativeDriver: true,
        }),
      ]),
      // Header fade
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
      // Form fade
      Animated.timing(formFade, {
        toValue: 1,
        duration: 700,
        delay: 400,
        useNativeDriver: true,
      }),
      // Footer fade
      Animated.timing(footerFade, {
        toValue: 1,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, logoScale, logoOpacity, headerFade, formFade, footerFade]);

  const handleSignIn = (data: LoginFormData) => {
    // Save customer ID to Redux (data.employeeId is already uppercase due to transform)
    dispatch(login({ customerId: data.employeeId }));
    
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

  const handleForgotPassword = () => setShowForgotPasswordModal(true);

  const handleForgotPasswordSuccess = () => {
    setShowForgotPasswordModal(false);
    navigation.replace('Dashboard');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  // Refs for inputs
  const employeeIdInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Main Container - Smooth Fade Only */}
        <AnimatedView style={[styles.mainContainer, { opacity: fadeAnim }]}>
          {/* Car Icon - Optimized Animation */}
          <AnimatedView style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
            <AnimatedView style={styles.logoIcon}>
              <AnimatedText style={styles.logoIconText}>🚗</AnimatedText>
            </AnimatedView>

            <AnimatedView
              style={[
                styles.logoGlow,
                {
                  opacity: logoOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.3],
                  }),
                },
              ]}
            />
          </AnimatedView>

          {/* Header - Smooth Fade */}
          <AnimatedView style={[styles.header, { opacity: headerFade }]}>
            {/* Welcome Back Test  */}
            <AnimatedText style={styles.welcomeText}>
              Welcome Back
            </AnimatedText>
            <AnimatedText style={styles.subtitleText}>
              Enter your credentials to access Smart Parking
            </AnimatedText>
          </AnimatedView>

          {/* Form - Smooth Fade */}
          <AnimatedView style={[styles.formContainer, { opacity: formFade }]}>
            {/* Employee ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.iconSpacing}>👤</Text> Employee ID
              </Text>

              <Controller
                control={control}
                name="employeeId"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <AnimatedView
                      style={[
                        styles.inputContainer,
                        {
                          borderColor: errors.employeeId 
                            ? '#ef4444' 
                            : isFocused.employeeId 
                            ? '#3b82f6' 
                            : '#334155',
                          shadowColor: errors.employeeId
                            ? '#ef4444'
                            : isFocused.employeeId ? '#3b82f6' : '#000',
                          shadowOffset: {
                            width: 0,
                            height: isFocused.employeeId ? 0 : 2,
                          },
                          shadowOpacity: isFocused.employeeId ? 0.3 : 0.1,
                          shadowRadius: isFocused.employeeId ? 12 : 8,
                          elevation: isFocused.employeeId ? 6 : 3,
                        },
                      ]}
                    >
                      <TextInput
                        ref={employeeIdInputRef}
                        style={styles.textInput}
                        placeholder="Enter your employee ID"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                        onBlur={() => {
                          onBlur();
                          setIsFocused({ ...isFocused, employeeId: false });
                        }}
                        onFocus={() => {
                          setIsFocused({ ...isFocused, employeeId: true });
                        }}
                        keyboardType="default"
                        autoCapitalize="characters"
                        maxLength={6}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                          passwordInputRef.current?.focus();
                        }}
                      />
                    </AnimatedView>
                    {errors.employeeId && (
                      <Text style={styles.errorText}>
                        {errors.employeeId.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.iconSpacing}>🔒</Text> Password
              </Text>

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <AnimatedView
                      style={[
                        styles.passwordContainer,
                        {
                          borderColor: errors.password 
                            ? '#ef4444' 
                            : isFocused.password 
                            ? '#3b82f6' 
                            : '#334155',
                          shadowColor: errors.password
                            ? '#ef4444'
                            : isFocused.password ? '#3b82f6' : '#000',
                          shadowOffset: {
                            width: 0,
                            height: isFocused.password ? 0 : 2,
                          },
                          shadowOpacity: isFocused.password ? 0.3 : 0.1,
                          shadowRadius: isFocused.password ? 12 : 8,
                          elevation: isFocused.password ? 6 : 3,
                        },
                      ]}
                    >
                      <TextInput
                        ref={passwordInputRef}
                        style={styles.passwordInput}
                        placeholder="Enter your password"
                        placeholderTextColor="#94a3b8"
                        secureTextEntry={!showPassword}
                        value={value}
                        onChangeText={onChange}
                        onBlur={() => {
                          onBlur();
                          setIsFocused({ ...isFocused, password: false });
                        }}
                        onFocus={() => setIsFocused({ ...isFocused, password: true })}
                        autoCapitalize="none"
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={() => {
                          if (isValid) {
                            handleSubmit(handleSignIn)();
                          }
                        }}
                      />

                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.toggleIcon}>
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </Text>
                      </TouchableOpacity>
                    </AnimatedView>
                    {errors.password && (
                      <Text style={styles.errorText}>
                        {errors.password.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Sign In */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={handleSubmit(handleSignIn)}
                activeOpacity={0.9}
                disabled={!isValid}
                style={[
                  styles.signInButton,
                  {
                    backgroundColor: isValid ? '#3b82f6' : '#334155',
                    shadowColor: isValid ? '#3b82f6' : undefined,
                    shadowOffset: isValid ? { width: 0, height: 8 } : undefined,
                    shadowOpacity: isValid ? 0.4 : undefined,
                    shadowRadius: isValid ? 16 : undefined,
                    elevation: isValid ? 8 : 3,
                    opacity: isValid ? 1 : 0.6,
                  },
                ]}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Forgot Password Link */}
            <View style={styles.forgotContainer}>
              <TouchableOpacity
                onPress={handleForgotPassword}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>Forgot your password?</Text>
              </TouchableOpacity>
            </View>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have Employee ID?{' '}
                <Text style={styles.signupLink} onPress={handleSignup}>
                  Signup
                </Text>
              </Text>
            </View>
          </AnimatedView>
        </AnimatedView>
      </ScrollView>

      <ForgotPasswordModal
        visible={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSuccess={handleForgotPasswordSuccess}
      />
    </KeyboardAvoidingView>
  );
};

export default React.memo(LoginScreen);

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  mainContainer: {
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 32,
    position: 'relative',
  },
  logoIcon: {
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
  logoIconText: {
    fontSize: 52,
    transform: [{ scaleX: -1 }],
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 56,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 26,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  iconSpacing: {
    marginRight: 8,
    fontSize: 16,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  textInput: {
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
  forgotContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    letterSpacing: -0.1,
  },
  signupContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  signupLink: {
    color: '#60a5fa',
    fontWeight: '700',
  },
  passwordContainer: {
    position: 'relative',
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  passwordInput: {
    paddingHorizontal: 20,
    paddingRight: 60,
    paddingVertical: 18,
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  passwordToggle: {
    position: 'absolute',
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    zIndex: 10,
  },
  toggleIcon: {
    fontSize: 24,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 20,
    marginTop: 8,
    gap: 10,
  },
  signInButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
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
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
});
