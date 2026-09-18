import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const SignUpScreen = ({ onSignUp, onGoSignIn, onBack }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const btnScale = useRef(new Animated.Value(1)).current;

  const getPasswordStrength = () => {
    if (!password) return null;
    if (password.length < 6) return { label: 'Weak', color: '#D32F2F', width: '25%' };
    if (password.length < 10 || !/[0-9]/.test(password)) return { label: 'Fair', color: '#F57C00', width: '55%' };
    if (!/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) return { label: 'Good', color: '#1976D2', width: '75%' };
    return { label: 'Strong', color: '#1B6B2F', width: '100%' };
  };

  const validate = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!email.trim() || !email.includes('@')) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must agree to the terms';
    return e;
  };

  const handleSignUp = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});

    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.94, useNativeDriver: true, speed: 50 }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSignUp({ email: email.trim(), name: `${firstName.trim()} ${lastName.trim()}` });
    }, 1200);
  };

  const strength = getPasswordStrength();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Top Nav */}
        <View style={styles.topNav}>
          {onBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.navTitle}>Create Account</Text>
          <View style={{ minWidth: onBack ? 64 : 0 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.logoCircle}>
              <View style={styles.logoBarsRow}>
                <View style={[styles.logoBar, { height: 18 }]} />
                <View style={[styles.logoBar, { height: 26 }]} />
                <View style={[styles.logoBar, { height: 14 }]} />
              </View>
            </View>
            <Text style={styles.headerTitle}>Join BookNest</Text>
            <Text style={styles.headerSub}>Create your account to start shopping</Text>
          </View>

          {/* Form card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Personal Information</Text>

            {/* Name row */}
            <View style={styles.row2}>
              <View style={styles.halfField}>
                <Text style={styles.label}>First name <Text style={styles.req}>*</Text></Text>
                <View style={[styles.inputRow, errors.firstName && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    placeholderTextColor="#BBB"
                    value={firstName}
                    onChangeText={(v) => { setFirstName(v); setErrors((p) => ({ ...p, firstName: null })); }}
                  />
                </View>
                {errors.firstName && <Text style={styles.errText}>{errors.firstName}</Text>}
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Last name <Text style={styles.req}>*</Text></Text>
                <View style={[styles.inputRow, errors.lastName && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    placeholderTextColor="#BBB"
                    value={lastName}
                    onChangeText={(v) => { setLastName(v); setErrors((p) => ({ ...p, lastName: null })); }}
                  />
                </View>
                {errors.lastName && <Text style={styles.errText}>{errors.lastName}</Text>}
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email address <Text style={styles.req}>*</Text></Text>
              <View style={[styles.inputRow, errors.email && styles.inputError]}>
                <Text style={styles.icon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#BBB"
                  value={email}
                  onChangeText={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: null })); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={styles.errText}>{errors.email}</Text>}
            </View>

            <View style={styles.divider} />
            <Text style={styles.formTitle}>Security</Text>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password <Text style={styles.req}>*</Text></Text>
              <View style={[styles.inputRow, errors.password && styles.inputError]}>
                <Text style={styles.icon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#BBB"
                  value={password}
                  onChangeText={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: null })); }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errText}>{errors.password}</Text>}
              {/* Strength meter */}
              {strength && (
                <View style={styles.strengthMeter}>
                  <View style={styles.strengthTrack}>
                    <View style={[styles.strengthFill, { width: strength.width, backgroundColor: strength.color }]} />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
                </View>
              )}
            </View>

            {/* Confirm password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm password <Text style={styles.req}>*</Text></Text>
              <View style={[styles.inputRow, errors.confirmPassword && styles.inputError]}>
                <Text style={styles.icon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#BBB"
                  value={confirmPassword}
                  onChangeText={(v) => { setConfirmPassword(v); setErrors((p) => ({ ...p, confirmPassword: null })); }}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.eyeIcon}>{showConfirm ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errText}>{errors.confirmPassword}</Text>}
              {!errors.confirmPassword && confirmPassword.length > 0 && password === confirmPassword && (
                <Text style={styles.matchText}>✓ Passwords match</Text>
              )}
            </View>

            {/* Terms agreement */}
            <TouchableOpacity
              style={styles.agreeRow}
              onPress={() => { setAgreed((v) => !v); setErrors((p) => ({ ...p, agreed: null })); }}
            >
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={[styles.agreeText, errors.agreed && { color: '#D32F2F' }]}>
                I agree to the{' '}
                <Text style={styles.agreeLink}>Terms & Conditions</Text>
                {' '}and{' '}
                <Text style={styles.agreeLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Create Account button */}
            <Animated.View style={[{ transform: [{ scale: btnScale }] }, { marginTop: 6 }]}>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnLoading]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.primaryBtnText}>
                  {loading ? '⏳  Creating account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Sign in link */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <TouchableOpacity onPress={onGoSignIn}>
              <Text style={styles.switchLink}>Sign in</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F5F6F8' },

  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', minWidth: 64 },
  backArrow: { fontSize: 28, color: '#1B6B2F', fontWeight: '300', lineHeight: 32, marginRight: 2 },
  backText: { fontSize: 15, color: '#1B6B2F', fontWeight: '700' },
  navTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#111' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },

  headerSection: { alignItems: 'center', marginBottom: 24 },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1B6B2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#1B6B2F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  logoBarsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  logoBar: { width: 7, backgroundColor: '#4FC3F7', borderRadius: 2 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1B6B2F', marginBottom: 4 },
  headerSub: { fontSize: 13, color: '#888' },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    marginBottom: 20,
  },
  formTitle: { fontSize: 15, fontWeight: '800', color: '#111', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 18 },

  row2: { flexDirection: 'row', gap: 10, marginBottom: 0 },
  halfField: { flex: 1, marginBottom: 14 },
  fieldGroup: { marginBottom: 14 },

  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 7 },
  req: { color: '#D32F2F' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    height: 50,
    gap: 8,
  },
  inputError: { borderColor: '#D32F2F', backgroundColor: '#FFF5F5' },
  icon: { fontSize: 16 },
  input: { flex: 1, fontSize: 14, color: '#111', paddingVertical: 0 },
  eyeIcon: { fontSize: 18, paddingLeft: 4 },
  errText: { fontSize: 11, color: '#D32F2F', marginTop: 4, marginLeft: 2 },
  matchText: { fontSize: 11, color: '#1B6B2F', marginTop: 4, marginLeft: 2, fontWeight: '600' },

  strengthMeter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 7,
  },
  strengthTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#EBEBEB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthFill: { height: '100%', borderRadius: 3 },
  strengthLabel: { fontSize: 11, fontWeight: '700', minWidth: 44 },

  agreeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 18,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#DDD',
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: '#1B6B2F', borderColor: '#1B6B2F' },
  checkMark: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  agreeText: { flex: 1, fontSize: 12, color: '#555', lineHeight: 18 },
  agreeLink: { color: '#1B6B2F', fontWeight: '700', textDecorationLine: 'underline' },

  primaryBtn: {
    backgroundColor: '#1B6B2F',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1B6B2F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  primaryBtnLoading: { backgroundColor: '#555' },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900', letterSpacing: 0.3 },

  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchText: { fontSize: 13, color: '#666' },
  switchLink: { fontSize: 13, color: '#1B6B2F', fontWeight: '800', textDecorationLine: 'underline' },
});

export default SignUpScreen;
