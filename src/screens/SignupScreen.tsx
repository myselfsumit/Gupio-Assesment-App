import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { login } from '../features/auth/authSlice';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignupFormData, signupSchema } from '../validation/Validation';

const { height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form with Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      employeeId: '',
      password: '',
      confirmPassword: '',
      gender: 'Male',
    },
  });



  // Optimized fade animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const formFade = useRef(new Animated.Value(0)).current;
  const footerFade = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
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
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(formFade, {
        toValue: 1,
        duration: 700,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(footerFade, {
        toValue: 1,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, logoScale, logoOpacity, headerFade, formFade, footerFade]);

  const handleSignup = (data: SignupFormData) => {
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
    ]).start(() => navigation.replace('Dashboard'));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Container */}
        <AnimatedView style={[styles.mainContainer, { opacity: fadeAnim }]}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          {/* Car Icon */}
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

          {/* Header */}
          <AnimatedView style={[styles.header, { opacity: headerFade }]}>
            <AnimatedText style={styles.welcomeText}>
              Create Account
            </AnimatedText>
            <AnimatedText style={styles.subtitleText}>
              Join Smart Parking and get started
            </AnimatedText>
          </AnimatedView>

          {/* Form */}
          <AnimatedView style={[styles.formContainer, { opacity: formFade }]}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.iconSpacing}>👤</Text> Full Name
              </Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <AnimatedView
                      style={[
                        styles.inputContainer,
                        {
                          borderColor: errors.fullName ? '#ef4444' : '#334155',
                          shadowColor: errors.fullName ? '#ef4444' : '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 3,
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your full name"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="words"
                      />
                    </AnimatedView>
                    {errors.fullName && (
                      <Text style={styles.errorText}>{errors.fullName.message}</Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.iconSpacing}>📧</Text> Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <AnimatedView
                      style={[
                        styles.inputContainer,
                        {
                          borderColor: errors.email ? '#ef4444' : '#334155',
                          shadowColor: errors.email ? '#ef4444' : '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 3,
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </AnimatedView>
                    {errors.email && (
                      <Text style={styles.errorText}>{errors.email.message}</Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.iconSpacing}>📱</Text> Phone Number
              </Text>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <AnimatedView
                      style={[
                        styles.inputContainer,
                        {
                          borderColor: errors.phoneNumber ? '#ef4444' : '#334155',
                          shadowColor: errors.phoneNumber ? '#ef4444' : '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 3,
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your phone number"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </AnimatedView>
                    {errors.phoneNumber && (
                      <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Employee ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.iconSpacing}>🆔</Text> Employee ID
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
                          borderColor: errors.employeeId ? '#ef4444' : '#334155',
                          shadowColor: errors.employeeId ? '#ef4444' : '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 3,
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter your employee ID"
                        placeholderTextColor="#94a3b8"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="characters"
                        maxLength={6}
                      />
                    </AnimatedView>
                    {errors.employeeId && (
                      <Text style={styles.errorText}>{errors.employeeId.message}</Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.iconSpacing}>👥</Text> Gender
              </Text>
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <>
                    <View style={styles.genderContainer}>
                      <TouchableOpacity
                        style={[
                          styles.genderButton,
                          value === 'Male' && styles.genderButtonActive,
                        ]}
                        onPress={() => {
                          onChange('Male');
                          setValue('gender', 'Male');
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={[
                          styles.genderButtonText,
                          value === 'Male' && styles.genderButtonTextActive,
                        ]}>Male</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.genderButton,
                          value === 'Female' && styles.genderButtonActive,
                        ]}
                        onPress={() => {
                          onChange('Female');
                          setValue('gender', 'Female');
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={[
                          styles.genderButtonText,
                          value === 'Female' && styles.genderButtonTextActive,
                        ]}>Female</Text>
                      </TouchableOpacity>
                    </View>
                    {errors.gender && (
                      <Text style={styles.errorText}>{errors.gender.message}</Text>
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
                          borderColor: errors.password ? '#ef4444' : '#334155',
                          shadowColor: errors.password ? '#ef4444' : '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 3,
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter your password"
                        placeholderTextColor="#94a3b8"
                        secureTextEntry={!showPassword}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
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
                      <Text style={styles.errorText}>{errors.password.message}</Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                <Text style={styles.iconSpacing}>🔒</Text> Confirm Password
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <AnimatedView
                      style={[
                        styles.passwordContainer,
                        {
                          borderColor: errors.confirmPassword ? '#ef4444' : '#334155',
                          shadowColor: errors.confirmPassword ? '#ef4444' : '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 8,
                          elevation: 3,
                        },
                      ]}
                    >
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Confirm your password"
                        placeholderTextColor="#94a3b8"
                        secureTextEntry={!showConfirmPassword}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.toggleIcon}>
                          {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </Text>
                      </TouchableOpacity>
                    </AnimatedView>
                    {errors.confirmPassword && (
                      <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Signup Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                onPress={handleSubmit(handleSignup)}
                activeOpacity={0.9}
                disabled={!isValid}
                style={[
                  styles.signupButton,
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
                <Text style={styles.signupButtonText}>Create Account</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink} onPress={() => navigation.goBack()}>
                  Login
                </Text>
              </Text>
            </View>
          </AnimatedView>
          
        </AnimatedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default React.memo(SignupScreen);

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
    zIndex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 28,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 40,
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
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 10,
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
    paddingVertical: 16,
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  genderButtonTextActive: {
    color: '#ffffff',
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
    paddingVertical: 16,
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
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 20,
    marginTop: 8,
  },
  signupButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  loginContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  loginLink: {
    color: '#60a5fa',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
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

