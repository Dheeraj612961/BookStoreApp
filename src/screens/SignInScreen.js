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

const SignInScreen = ({ onSignIn, onGoSignUp, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const btnScale = useRef(new Animated.Value(1)).current;

  const validate = () => {
    const e = {};
    if (!email.trim() || !email.includes('@')) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSignIn = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});

    Animated.sequence([
      Animated.spring(btnScale, { toValue: 0.94, useNativeDriver: true, speed: 50 }),
      Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();

    setLoading(true);
    // Simulate auth — any valid-format credentials pass
    setTimeout(() => {
      setLoading(false);
      onSignIn({ email: email.trim(), name: email.split('@')[0] });
    }, 1200);
  };

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
          <Text style={styles.navTitle}>Sign In</Text>
          <View style={{ minWidth: onBack ? 64 : 0 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo area */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <View style={styles.logoBarsRow}>
                <View style={[styles.logoBar, { height: 18 }]} />
                <View style={[styles.logoBar, { height: 26 }]} />
                <View style={[styles.logoBar, { height: 14 }]} />
              </View>
            </View>
            <Text style={styles.logoName}>BookNest</Text>
            <Text style={styles.logoTagline}>Welcome back, book lover!</Text>
          </View>

          {/* Form card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Sign in to your account</Text>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email address <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputRow, errors.email && styles.inputRowError]}>
                <Text style={styles.inputIcon}>✉️</Text>
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
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
              <View style={[styles.inputRow, errors.password && styles.inputRowError]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#BBB"
                  value={password}
                  onChangeText={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: null })); }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotRow}
              onPress={() => Alert.alert('Reset Password', 'Password reset email functionality coming soon!')}
            >
              <Text style={styles.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Sign In button */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnLoading]}
                onPress={handleSignIn}
                disabled={loading}
              >
                <Text style={styles.primaryBtnText}>
                  {loading ? '⏳  Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => Alert.alert('Google Sign In', 'Google OAuth coming soon!')}
              >
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => Alert.alert('Apple Sign In', 'Apple Sign In coming soon!')}
              >
                <Text style={styles.socialIcon}>🍎</Text>
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign up link */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onGoSignUp}>
              <Text style={styles.switchLink}>Create account</Text>
            </TouchableOpacity>
          </View>
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

  scrollContent: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40 },

  logoSection: { alignItems: 'center', marginBottom: 28 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  logoName: { fontSize: 20, fontWeight: '900', color: '#1B6B2F', marginBottom: 4 },
  logoTagline: { fontSize: 13, color: '#888' },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    marginBottom: 20,
  },
  formTitle: { fontSize: 17, fontWeight: '800', color: '#111', marginBottom: 20 },

  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 7 },
  required: { color: '#D32F2F' },
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
  inputRowError: { borderColor: '#D32F2F', backgroundColor: '#FFF5F5' },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 14, color: '#111', paddingVertical: 0 },
  eyeIcon: { fontSize: 18, paddingLeft: 4 },
  errorText: { fontSize: 11, color: '#D32F2F', marginTop: 4, marginLeft: 2 },

  forgotRow: { alignItems: 'flex-end', marginBottom: 20, marginTop: -4 },
  forgotText: { fontSize: 12, color: '#1B6B2F', fontWeight: '600' },

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

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E8E8E8' },
  dividerText: { fontSize: 12, color: '#AAA', fontWeight: '500' },

  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 11,
    gap: 7,
    backgroundColor: '#FAFAFA',
  },
  socialIcon: { fontSize: 16, fontWeight: '700', color: '#DB4437' },
  socialText: { fontSize: 13, fontWeight: '700', color: '#333' },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: { fontSize: 13, color: '#666' },
  switchLink: { fontSize: 13, color: '#1B6B2F', fontWeight: '800', textDecorationLine: 'underline' },
});

export default SignInScreen;
