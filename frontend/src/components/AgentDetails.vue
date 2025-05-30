<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      color="#f5f5f5"
      width="260"
      class="elevation-3 rounded-drawer"
    >
      <!-- Logo and App Name -->
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
      <!-- Navigation List -->
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

    <v-main>
      <v-container fluid class="pa-0" style="max-width: 85vw; margin: 0 auto;">
        <!-- Top Navigation Row (matches AgentRecords.vue) -->
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

        <!-- Profile Card -->
        <v-card class="mb-6 pa-4 profile-card">
          <v-row align="center" justify="space-between" class="px-4 mb-8 mt-4">
            <v-col cols="auto">
              <v-avatar size="80">
                <v-icon size="80" color="grey lighten-2">mdi-account</v-icon>
              </v-avatar>
            </v-col>
            <v-col>
              <div class="profile-title">
                <span v-if="!isEditing">{{ agent.first_name }} {{ agent.last_name }}</span>
                <span v-else>
                  <v-text-field v-model="editableAgent.first_name" label="First Name" dense hide-details style="max-width: 120px; display: inline-block;" />
                  <v-text-field v-model="editableAgent.last_name" label="Last Name" dense hide-details style="max-width: 120px; display: inline-block;" />
                </span>
              </div>
              <div class="profile-subtitle">
                <span v-if="!isEditing">{{ agent.position }}</span>
                <v-select
                  v-else
                  v-model="editableAgent.position"
                  :items="positionOptions"
                  label="Position"
                  dense
                  hide-details
                  style="max-width: 160px;"
                ></v-select>
              </div>
              <div class="profile-location">
                <span v-if="!isEditing">{{ agent.address }}</span>
                <v-text-field v-else v-model="editableAgent.address" label="Address" dense hide-details style="max-width: 200px;" />
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn icon color="primary" v-if="isEditing" @click="saveEdit">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Personal Information Card -->
        <v-card class="mb-6 pa-6">
          <div class="d-flex align-center mb-4">
            <span class="section-title mr-2" style="color:#26a69a;">Personal Information</span>
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <div class="label">First Name</div>
              <div v-if="!isEditing">{{ agent.first_name }}</div>
              <v-text-field v-else v-model="editableAgent.first_name" dense hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <div class="label">Last Name</div>
              <div v-if="!isEditing">{{ agent.last_name }}</div>
              <v-text-field v-else v-model="editableAgent.last_name" dense hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <div class="label">Middle Name</div>
              <div v-if="!isEditing">{{ agent.middle_name }}</div>
              <v-text-field v-else v-model="editableAgent.middle_name" dense hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <div class="label">Date of Birth</div>
              <div v-if="!isEditing">{{ agent.dob }}</div>
              <v-text-field
                v-else
                v-model="editableAgent.dob"
                label="Date of Birth"
                type="date"
                dense
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <div class="label">Address</div>
              <div v-if="!isEditing">{{ agent.address }}</div>
              <v-text-field v-else v-model="editableAgent.address" dense hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <div class="label">Civil Status</div>
              <div v-if="!isEditing">{{ agent.civil_status }}</div>
              <v-select
                v-else
                v-model="editableAgent.civil_status"
                :items="civilStatusOptions"
                label="Civil Status"
                dense
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <div class="label">Educational Attainment</div>
              <div v-if="!isEditing">{{ agent.educational_attainment }}</div>
              <v-select
                v-else
                v-model="editableAgent.educational_attainment"
                :items="educationOptions"
                label="Educational Attainment"
                dense
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <div class="label">Position</div>
              <div v-if="!isEditing">{{ agent.position }}</div>
              <v-select
                v-else
                v-model="editableAgent.position"
                :items="positionOptions"
                label="Position"
                dense
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card>
        <div class="d-flex justify-end mb-8">
          <v-btn color="primary" @click="toggleEdit" small v-if="!isEditing">
            Edit
          </v-btn>
          <v-btn color="primary" @click="saveEdit" small v-else>
            Save
          </v-btn>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      agent: {},
      editableAgent: {},
      isEditing: false,
      drawer: false,
      civilStatusOptions: [
        'Single',
        'Married',
        'Widowed',
        'Separated',
        'Divorced',
      ],
      educationOptions: [
        'High School Graduate',
        'College Graduate',
        'Vocational',
        'Post Graduate',
        'Others',
      ],
      positionOptions: [
        'Sales Agent',
        'Sales Manager',
        'Broker',
        'Admin',
        'Other',
      ],
      drawerItems: [
        { title: 'DASHBOARD', icon: 'mdi-account-group', to: '/dashboard' },
        { title: 'CLIENT TRACKING', icon: 'mdi-account-group', to: '/clients' },
        { title: 'AGENT RECORDS', icon: 'mdi-account-tie', to: '/agent' },
        { title: 'COMMS. MGMT.', icon: 'mdi-message-text-outline', to: '/commission-management' },
        { title: 'SALES TRACKING', icon: 'mdi-chart-line', to: '/sales-tracking' },
        { title: 'PROPERTY LISTING', icon: 'mdi-home-city-outline', to: { name: 'PropertyListing' } },
      ],
    };
  },
  created() {
    const agentId = this.$route.params.id;
    this.fetchAgentDetails(agentId);
  },
  methods: {
    fetchAgentDetails(agentId) {
      axios
        .get(`http://localhost:3000/api/agents/${agentId}`)
        .then((response) => {
          this.agent = response.data;
          this.editableAgent = { ...response.data };
        })
        .catch((error) => {
          console.error('Error fetching agent details:', error);
        });
    },
    toggleEdit() {
      this.isEditing = true;
      this.editableAgent = { ...this.agent };
    },
    saveEdit() {
      axios
        .put(`http://localhost:3000/api/agents/${this.agent.id}`, this.editableAgent)
        .then(() => {
          this.agent = { ...this.editableAgent };
          this.isEditing = false;
        })
        .catch((error) => {
          alert('Failed to update agent.');
          console.error('Error updating agent:', error);
        });
    },
    logout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push('/login');
    },
  },
};
</script>

<style>
.profile-card {
  border-radius: 14px;
}
.profile-title {
  font-size: 1.6rem;
  font-weight: 700;
}
.profile-subtitle {
  color: #757575;
  font-size: 1.1rem;
}
.profile-location {
  color: #bdbdbd;
  font-size: 1rem;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
}
.label {
  color: #757575;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 2px;
}
.text-success {
  color: #4CAF50;
}
.drawer-link {
  transition: background-color 0.3s;
}
.drawer-link:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.drawer-link--active {
  background-color: rgba(56, 142, 60, 0.1);
}
</style>