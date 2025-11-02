import React, { useState, useRef, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgetPasswordFormData, forgetPasswordSchema, OtpFormData, otpSchema } from '../validation/Validation';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const ForgotPasswordModal: React.FC<Props> = ({ visible, onClose, onSuccess }) => {
  const [step, setStep] = useState<'employeeId' | 'otp'>('employeeId');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);
  
  // Form for Employee ID
  const {
    control: employeeIdControl,
    handleSubmit: handleEmployeeIdSubmit,
    formState: { errors: employeeIdErrors, isValid: isEmployeeIdValid },
    reset: resetEmployeeId,
    getValues: getEmployeeIdValues,
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      employeeId: '',
    },
  });

  // Form for OTP
  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtp,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: 'onChange',
    defaultValues: {
      otp: '',
    },
  });
  
  // Mock OTP for validation
  const mockOtp = '123456';

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setStep('employeeId');
      resetEmployeeId();
      resetOtp();
      setOtp(['', '', '', '', '', '']);
      
      // Animate backdrop first
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Then animate modal
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      // Fade out animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Initialize OTP refs
  useEffect(() => {
    if (otpInputRefs.current.length === 0) {
      otpInputRefs.current = Array(6).fill(null);
    }
  }, []);

  const handleSendOTP = (data?: ForgetPasswordFormData) => {
    // This will be called by form submission or directly
    const employeeIdValue = data?.employeeId || '';
    
    if (employeeIdValue.trim()) {
      // Animate to OTP step
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStep('otp');
        // Focus first OTP input after a short delay
        setTimeout(() => {
          if (otpInputRefs.current[0]) {
            otpInputRefs.current[0]?.focus();
          }
        }, 100);
      });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    // Handle backspace to move to previous input
    if (key === 'Backspace' && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = (data: OtpFormData) => {
    const enteredOtp = data.otp;
    // Mock validation - check if OTP matches
    if (enteredOtp === mockOtp) {
      // Success - redirect to Dashboard
      onSuccess();
    } else {
      // Show error (you can add toast here)
      // For now, just reset OTP
      setOtp(['', '', '', '', '', '']);
      resetOtp();
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0]?.focus();
      }
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('employeeId');
      setOtp(['', '', '', '', '', '']);
    } else {
      onClose();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <Pressable style={styles.backdropContainer} onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </Pressable>
        
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: opacityAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim },
                ],
              },
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>

            {/* Header Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🔐</Text>
            </View>

            {step === 'employeeId' ? (
              <>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                  Enter your Employee ID to receive an OTP
                </Text>

                {/* Employee ID Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Text style={styles.labelIcon}>👤</Text> Employee ID
                  </Text>
                  <Controller
                    control={employeeIdControl}
                    name="employeeId"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <View style={[
                          styles.inputContainer,
                          employeeIdErrors.employeeId && styles.inputContainerError,
                        ]}>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter your employee ID"
                            placeholderTextColor="#94a3b8"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="default"
                            autoCapitalize="characters"
                            autoFocus
                          />
                        </View>
                        {employeeIdErrors.employeeId && (
                          <Text style={styles.errorText}>
                            {employeeIdErrors.employeeId.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>

                {/* Send OTP Button */}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    !isEmployeeIdValid && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleEmployeeIdSubmit(handleSendOTP)}
                  activeOpacity={0.9}
                  disabled={!isEmployeeIdValid}
                >
                  <Text style={styles.primaryButtonText}>Send OTP</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.subtitle}>
                  We've sent a 6-digit code to your registered contact
                </Text>

                {/* OTP Input Container */}
                <Controller
                  control={otpControl}
                  name="otp"
                  render={({ field: { onChange } }) => (
                    <>
                      <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                          <TextInput
                            key={index}
                            ref={(ref) => {
                              otpInputRefs.current[index] = ref;
                            }}
                            style={[
                              styles.otpInput,
                              digit && styles.otpInputFilled,
                              focusedOtpIndex === index && styles.otpInputFocused,
                              otpErrors.otp && styles.otpInputError,
                            ]}
                            value={digit}
                            onChangeText={(inputValue) => {
                              handleOtpChange(index, inputValue);
                              // Update form value
                              const newOtp = [...otp];
                              newOtp[index] = inputValue;
                              onChange(newOtp.join(''));
                            }}
                            onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                            onFocus={() => setFocusedOtpIndex(index)}
                            onBlur={() => setFocusedOtpIndex(null)}
                          />
                        ))}
                      </View>
                      {otpErrors.otp && (
                        <Text style={styles.errorText}>{otpErrors.otp.message}</Text>
                      )}
                    </>
                  )}
                />

                {/* Resend OTP */}
                <TouchableOpacity 
                  style={styles.resendContainer}
                  onPress={() => {
                    // Get current employee ID value from form
                    const currentEmployeeId = getEmployeeIdValues('employeeId');
                    if (currentEmployeeId) {
                      handleSendOTP({ employeeId: currentEmployeeId });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resendText}>
                    Didn't receive? <Text style={styles.resendLink}>Resend OTP</Text>
                  </Text>
                </TouchableOpacity>

                {/* Verify Button */}
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    !isOtpComplete && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleOtpSubmit(handleVerifyOTP)}
                  activeOpacity={0.9}
                  disabled={!isOtpComplete}
                >
                  <Text style={styles.primaryButtonText}>Verify OTP</Text>
                </TouchableOpacity>

                {/* Back Button */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  backdropContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 32,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeIcon: {
    fontSize: 24,
    color: '#94a3b8',
    fontWeight: '300',
    lineHeight: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    alignSelf: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  inputGroup: {
    marginBottom: 24,
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
    backgroundColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainerFocused: {
    borderColor: '#3b82f6',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 12,
    backgroundColor: '#0f172a',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    paddingVertical: 0,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e293b',
  },
  otpInputFocused: {
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  resendLink: {
    color: '#60a5fa',
    fontWeight: '700',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 16,
    gap: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: '#334155',
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  primaryButtonIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 15,
    color: '#60a5fa',
    fontWeight: '600',
  },
  inputContainerError: {
    borderColor: '#ef4444',
  },
  otpInputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ForgotPasswordModal;

