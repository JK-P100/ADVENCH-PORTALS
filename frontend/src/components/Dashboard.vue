<template>
  <v-app style="overflow: hidden; height:100vh">
    <v-navigation-drawer
      v-model="drawer"
      app
      color="#f5f5f5"
      width="260"
      class="elevation-3 rounded-drawer"
    >
      <v-sheet color="white" class="pa-4 d-flex align-center" elevation="0">
        <img src="../assets/logo.png" alt="Advench Realty Logo" style="max-width: 48px; margin-right: 12px;" />
        <div>
          <div class="font-weight-bold" style="color:#388e3c;">ADVЕNCH</div>
          <div class="text-caption" style="color:#757575;">REALTY</div>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon @click="drawer = false">
          <v-icon color="grey darken-2">mdi-close</v-icon>
        </v-btn>
      </v-sheet>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          v-for="item in drawerItems"
          :key="item.title"
          :to="item.to"
          link
          class="drawer-link"
          active-class="drawer-link--active"
          @click="drawer = false"
        >
          <v-list-item-icon>
            <v-icon :color="item.iconColor || 'green darken-2'">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="ml-2">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider class="my-2"></v-divider>
      <v-list dense>
        <v-list-item link @click="logout" class="drawer-link">
          <v-list-item-icon>
            <v-icon color="red darken-1">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="ml-2">LOGOUT</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="dashboard-bg">
      <v-container fluid class="pa-0" style="max-width: 90vw; margin: 0 auto;">
        <!-- Duplicated Header from SalesTracking.vue -->
        <v-row align="center" justify="space-between" class="px-4 mt-4">
          <v-col cols="auto" class="d-flex align-center">
            <img src="../assets/logo.png" alt="Advench Realty Logo" style="max-width: 60px; margin-right: 12px;" />
            <div>
              <h2 class="text-h6 font-weight-bold mb-0">ADVЕNCH REALTY</h2>
              <p class="text-subtitle-2 mb-0">AND DEVELOPMENT CO.</p>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-btn icon @click="drawer = true">
              <v-icon color="green darken-4">mdi-menu</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- End Duplicated Header -->

        <v-row class="mt-8" align="stretch">
          <!-- Welcome Section -->
          <v-col cols="12" md="8">
            <v-card outlined class="pa-6" style="background-color: #f4fbf4; min-height: 200px;">
              <div class="d-flex align-center mb-4">
                <div>
                  <h1 class="text-h4 font-weight-bold mb-1">Welcome to ADVЕNCH REALTY</h1>
                  <p class="text-subtitle-1 mb-0">Your trusted partner in real estate and property development.Your trusted partner in real estate and property development.Your trusted partner in real estate and property development.Your trusted partner in real estate and property development. 
                    Stay updated with real-time tracking of clients, agents, properties, commissions, and sales performance right here on your dashboard.
                  </p>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- Sales Section -->
          <v-col cols="12" md="4">
            <v-card outlined class="pa-3 d-flex flex-column align-center justify-center" style="background-color: #f4fbf4; min-height: 120px;">
              <v-icon size="40" color="green darken-4" class="mb-1">mdi-currency-usd</v-icon>
              <div class="text-h5 font-weight-bold mb-1">SALES</div>
              <div class="text-h4 font-weight-bold mb-1">${{ Number(stats.totalSales).toLocaleString() }}</div>
              <div class="text-caption mb-2">This Month So Far</div>
              <v-divider></v-divider>
              <div class="text-h6 font-weight-bold mt-2 mb-1">${{ Number(stats.totalSalesPrevMonth).toLocaleString() }}</div>
              <div class="text-caption">Previous Month</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Modules Row (Clients, Properties, Agents, Commission) -->
        <v-row class="mt-6" dense>
          <v-col cols="12" md="3">
            <v-card class="module-card pa-4" style="background: linear-gradient(135deg, #e0f7fa, #f4fbf4); box-shadow: 0 4px 24px #e0e0e0;">
              <v-icon size="40" color="green darken-4" class="mb-2">mdi-account-group</v-icon>
              <div class="module-title">CLIENTS</div>
              <div class="module-value">
                <span>{{ stats.totalClients }}</span>
                <v-icon small color="green" v-if="stats.totalClients > lastStats.totalClients">mdi-arrow-up</v-icon>
                <v-icon small color="red" v-else-if="stats.totalClients < lastStats.totalClients">mdi-arrow-down</v-icon>
              </div>
              <div class="module-desc">Total Clients</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="module-card pa-4">
              <v-icon size="40" color="green darken-4" class="mb-2">mdi-home-city-outline</v-icon>
              <div class="module-title">PROPERTIES</div>
              <div class="module-value">
                <span>{{ stats.totalProperties }}</span>
                <v-icon small color="green" v-if="stats.totalProperties > lastStats.totalProperties">mdi-arrow-up</v-icon>
                <v-icon small color="red" v-else-if="stats.totalProperties < lastStats.totalProperties">mdi-arrow-down</v-icon>
              </div>
              <div class="module-desc">Total Properties</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="module-card pa-4">
              <v-icon size="40" color="green darken-4" class="mb-2">mdi-account-tie</v-icon>
              <div class="module-title">AGENTS</div>
              <div class="module-value">
                <span>{{ stats.totalAgents }}</span>
                <v-icon small color="green" v-if="stats.totalAgents > lastStats.totalAgents">mdi-arrow-up</v-icon>
                <v-icon small color="red" v-else-if="stats.totalAgents < lastStats.totalAgents">mdi-arrow-down</v-icon>
              </div>
              <div class="module-desc">Total Agents</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="module-card pa-4">
              <v-icon size="40" color="green darken-4" class="mb-2">mdi-message-text-outline</v-icon>
              <div class="module-title">COMMISSION</div>
              <div class="module-value">
                ${{ Number(stats.totalCommission).toLocaleString() }}
                <v-icon small color="green" v-if="stats.totalCommission > lastStats.totalCommission">mdi-arrow-up</v-icon>
                <v-icon small color="red" v-else-if="stats.totalCommission < lastStats.totalCommission">mdi-arrow-down</v-icon>
              </div>
              <div class="module-desc">This Month</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app color="green darken-4" dark style="border-top: 2px solid #fff;">
      <v-container>
        <span>Copyright © 2023. ADVЕNCH REALTY and development co. All rights Reserved.</span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AppDashboard',
  data() {
    return {
      drawer: false,
      stats: {
        totalClients: 0,
        totalProperties: 0,
        totalSales: 0,
        totalSalesPrevMonth: 0, // <-- add this
        totalAgents: 0,
        totalCommission: 0,
      },
      lastStats: {
        totalClients: 0,
        totalProperties: 0,
        totalSales: 0,
        totalSalesPrevMonth: 0, // <-- add this
        totalAgents: 0,
        totalCommission: 0,
      },
      drawerItems: [
        { title: 'DASHBOARD', icon: 'mdi-view-dashboard', to: '/dashboard' },
        { title: 'CLIENT TRACKING', icon: 'mdi-account-group', to: '/clients' },
        { title: 'AGENT TRACKING', icon: 'mdi-account-tie', to: '/agents' },
        { title: 'COMMS. MGMT.', icon: 'mdi-message-text-outline', to: '/commission-management' },
        { title: 'SALES TRACKING', icon: 'mdi-chart-line', to: '/sales-tracking' },
        { title: 'PROPERTY LISTING', icon: 'mdi-home-city-outline', to: { name: 'PropertyListing' } },
      ],
      statsInterval: null,
    };
  },
  methods: {
    fetchStats() {
      axios
        .get('http://localhost:3000/api/stats')
        .then((response) => {
          this.lastStats = { ...this.stats };
          this.stats = response.data;
        })
        .catch((error) => {
          console.error('Error fetching stats:', error);
        });
    },
    logout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.fetchStats();
    this.statsInterval = setInterval(this.fetchStats, 10000);
  },
  beforeUnmount() {
    if (this.statsInterval) clearInterval(this.statsInterval);
  },
};
</script>

<style>
html, body, #app, .v-application {
  background: #f4fbf4 !important;
}

.dashboard-bg {
  background: #f4fbf4 !important;
}

.rounded-drawer {
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
}
.drawer-link {
  border-radius: 8px;
  margin: 2px 4px;
  transition: background 0.2s;
}
.drawer-link:hover {
  background: #e0f2f1 !important;
}
.drawer-link--active {
  background: #c8e6c9 !important;
  font-weight: bold;
}
.module-card {
  background: #f4fbf4 !important;
  border-radius: 18px;
  min-height: 180px;
  text-align: center;
  box-shadow: 0 2px 8px #e0e0e0;
}
.module-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a2340;
}
.module-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a2340;
}
.module-desc {
  font-size: 0.95rem;
  color: #7b7b7b;
}
</style>



