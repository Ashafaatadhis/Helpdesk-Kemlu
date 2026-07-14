<template>
  <div class="login-container">
    <!-- Left Side - Logo & Branding -->
    <div class="login-left">
      <div class="logo-section">
        <img src="@/assets/img/kemlu-logo.jpg" alt="Kemlu Logo" class="main-logo" />
        <h1 class="brand-title">KEMENTERIAN LUAR NEGERI</h1>
        <p class="brand-subtitle">REPUBLIK INDONESIA</p>
        <div class="brand-divider"></div>
        <p class="system-name">Pusat Data dan Teknologi Informasi</p>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="login-right">
      <div class="form-container">
        <div class="form-header">
          <h2 class="form-title">Welcome Back</h2>
          <p class="form-subtitle">Silakan login untuk melanjutkan</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Alert Error -->
          <div v-if="error" class="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="alert-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ error }}
          </div>

          <!-- Username Input -->
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <div class="input-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="input-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                type="text"
                id="username"
                v-model="username"
                class="form-input"
                placeholder="Masukkan username"
                required
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="input-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="form-input"
                placeholder="Masukkan password"
                required
                :disabled="loading"
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
                :disabled="loading"
              >
                <svg
                  v-if="!showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  class="toggle-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="toggle-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <!-- <a href="#" class="forgot-password">Lupa password?</a> -->
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="!loading">LOG IN</span>
            <span v-else class="loading-spinner">
              <svg
                class="spinner"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses...
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="form-footer">
          <p>&copy; 2025 Kementerian Luar Negeri Republik Indonesia</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  name: "Login",
  setup() {
    const store = useStore();
    const router = useRouter();

    const username = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    const error = ref("");

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const handleLogin = async () => {
      error.value = "";
      loading.value = true;

      try {
        const u = username.value?.toString().trim();
        const p = password.value?.toString().trim();
        console.log("[login debug] username=", u);

        const res = await axios.post("http://localhost:3001/api/login", {
          username: u,
          password: p,
        });

        if (res.data && res.data.success) {
          store.dispatch("login", {
            token: res.data.token,
            user: res.data.user,
          });
          // simpan ke localStorage juga (store sudah lakukan ini jika kamu sudah ubah store)
          router.push("/dashboard-default");
          return;
        }

        error.value = res.data?.message || "Login gagal.";
      } catch (err) {
        if (err.response && err.response.status === 401) {
          error.value = "Username atau password salah.";
        } else {
          error.value = "Gagal terhubung ke server.";
        }
        console.error("[login error]", err);
      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      showPassword,
      loading,
      error,
      togglePassword,
      handleLogin,
    };
  },
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  display: flex;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Left Side - Logo & Branding */
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: moveBackground 20s linear infinite;
}

@keyframes moveBackground {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.logo-section {
  text-align: center;
  position: relative;
  z-index: 1;
  max-width: 500px;
}

.logo-placeholder {
  margin-bottom: 30px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  animation: float 3s ease-in-out infinite;
}

.main-logo {
  width: 500px;
  height: 200px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  color: rgb(13, 83, 197);
  margin-bottom: 8px;
  letter-spacing: 1px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.brand-subtitle {
  font-size: 20px;
  font-weight: 600;
  color: #e92a2a;
  margin-bottom: 25px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.brand-divider {
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgb(242, 46, 46), transparent);
  margin: 0 auto 25px;
  border-radius: 2px;
}

.system-name {
  font-size: 18px;
  color: rgba(23, 22, 127, 0.9);
  font-weight: 500;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Right Side - Login Form */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f8fafc;
}

.form-container {
  width: 100%;
  max-width: 440px;
  background: white;
  padding: 50px 45px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.form-header {
  margin-bottom: 40px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 15px;
  color: #64748b;
}

/* Alert */
.alert {
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 14px;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Form Elements */
.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 20px;
  height: 20px;
  color: #94a3b8;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 13px 16px 13px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f8fafc;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-input::placeholder {
  color: #cbd5e1;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.password-toggle:hover:not(:disabled) {
  background: #f1f5f9;
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.toggle-icon {
  width: 20px;
  height: 20px;
  color: #64748b;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #64748b;
}

.remember-me input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #1e40af;
}

/* Submit Button */
.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Footer */
.form-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.form-footer p {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-left {
    display: none;
  }

  .login-right {
    flex: 1;
  }
}

@media (max-width: 640px) {
  .login-right {
    padding: 24px;
  }

  .form-container {
    padding: 40px 30px;
    border-radius: 16px;
  }

  .form-title {
    font-size: 24px;
  }

  .form-subtitle {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 35px 24px;
  }

  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>