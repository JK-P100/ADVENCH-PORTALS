<template>
  <v-app>
    <v-main class="login-main">
      <v-container fluid class="fill-height pa-0">
        <v-row no-gutters class="fill-height">
          <!-- Left side: Company name and slogan at the bottom -->
          <v-col cols="12" md="6" class="left-side d-flex flex-column justify-center align-center pa-0">
            <div class="company-block">
              <img src="@/assets/logo.png" alt="Advench Realty Logo" class="company-logo mb-2" />
              <div class="slogan slogan-tight mb-0">"Where Dreams Find a Home."</div>
            </div>
          </v-col>

          <!-- Right side: Login form, centered and larger -->
          <v-col cols="12" md="6" class="right-side d-flex align-center justify-center pa-0">
            <v-card class="pa-14 login-card" max-width="540" min-width="420" elevation="2" rounded="xl">
              <v-card-title class="justify-center text-h4 font-weight-bold mb-8">Log In</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="onLogin">
                  <v-text-field
                    v-model="username"
                    label="Username"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    density="comfortable"
                    class="mb-8 big-input"
                    required
                  />
                  <v-text-field
                    v-model="password"
                    label="Password"
                    prepend-inner-icon="mdi-lock"
                    type="password"
                    variant="outlined"
                    density="comfortable"
                    class="mb-6 big-input"
                    required
                  />
                  <v-btn
                    type="submit"
                    color="#555"
                    block
                    class="login-btn big-btn"
                    height="56"
                  >
                    LOGIN
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    onLogin: async function() {
      if (this.username && this.password) {
        try {
          const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, password: this.password })
          });
          const data = await response.json();
          if (data.success) {
            localStorage.setItem('isAuthenticated', 'true');
            this.$router.push('/dashboard');
          } else {
            alert(data.message || 'Login failed');
          }
        } catch (err) {
          alert('Server error');
        }
      } else {
        alert('Please enter both username and password');
      }
    }
  }
}
</script>

<style scoped>
.login-main {
  background: #222;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}
.left-side {
  background: #fff;
  color: #222;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}
.right-side {
  background: #00723a;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}
.company-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: 0;
}
.company-logo {
  width: 400px;
  max-width: 100%;
  display: block;
  margin: 0 auto 8px auto;
}
.company-name {
  font-size: 2.3rem;
  font-weight: bold;
  letter-spacing: 1px;
  font-family: 'Montserrat', Arial, sans-serif;
  text-align: center;
  margin-bottom: 0;
}
.company-sub {
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-align: center;
  font-family: 'Montserrat', Arial, sans-serif;
  margin-bottom: 0;
}
.slogan {
  font-size: 1.25rem;
  font-style: italic;
  text-align: center;
  font-family: 'Montserrat', Arial, sans-serif;
  margin-top: 0.5rem;
  color: #222;
}
.slogan-tight {
  margin-top: 0.5rem;
}
.forgot-link {
  font-size: 1rem;
  color: #05723a;
  text-decoration: underline;
}
.login-btn {
  font-weight: bold;
  font-size: 1.3rem;
  background: #555 !important;
  color: #222 !important;
  letter-spacing: 1px;
}
.login-card {
  min-width: 420px;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.big-input .v-input__control {
  font-size: 1.2rem;
  min-height: 56px;
}
.big-btn {
  font-size: 1.3rem !important;
  height: 56px !important;
}
.v-card-title {
  font-family: 'Montserrat', Arial, sans-serif;
  font-weight: bold;
  font-size: 2rem !important;
}
.v-label {
  font-weight: bold;
  font-size: 1.15rem;
  font-family: 'Montserrat', Arial, sans-serif;
}
</style> 