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
        <!-- Title -->
        <v-row class="mt-6 mb-4">
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold">RECORDS OF AGENTS</h1>
          </v-col>
        </v-row>
        <!-- Search Bar -->
        <v-row class="mb-1" align="center">
          <v-col cols="12" md="10">
            <v-text-field
              label="Search..."
              outlined
              dense
              hide-details
              v-model="searchQuery"
            ></v-text-field>
          </v-col>
          <v-col cols="auto" class="d-flex justify-end">
            <v-btn color="grey darken-1" dark style="width: 150px;">Search</v-btn>
          </v-col>
        </v-row>
        <!-- Table -->
        <v-row class="pa-0 ma-0" style="width: 100%;">
          <v-col cols="12" class="pa-0 ma-0" style="width: 100%;">
            <div class="table-container">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th class="table-header">Agent Name</th>
                    <th class="table-header">Position</th>
                    <th class="table-header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(agent, index) in filteredAgents" :key="index" class="table-row">
                    <td>{{ agent.last_name }}, {{ agent.first_name }} {{ agent.middle_name }}</td>
                    <td>{{ agent.position }}</td>
                    <td>
                      <v-btn icon @click="viewAgentDetails(agent)">
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-col>
        </v-row>
        <!-- Add Button -->
        <v-row justify="end" class="mt-4 add-button-row">
          <v-col cols="auto">
            <v-btn color="grey darken-1" dark style="width: 200px;" @click="showAddAgentModal = true">Add</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- Agent Details Modal -->
      <v-dialog v-model="showDetailsModal" max-width="600px">
        <v-card>
          <v-card-title>Agent Details</v-card-title>
          <v-card-text>
            <p><strong>Last Name:</strong> {{ selectedAgent.last_name }}</p>
            <p><strong>First Name:</strong> {{ selectedAgent.first_name }}</p>
            <p><strong>Middle Name:</strong> {{ selectedAgent.middle_name }}</p>
            <p><strong>Date of Birth:</strong> {{ selectedAgent.dob }}</p>
            <p><strong>Address:</strong> {{ selectedAgent.address }}</p>
            <p><strong>Civil Status:</strong> {{ selectedAgent.civil_status }}</p>
            <p><strong>Educational Attainment:</strong> {{ selectedAgent.educational_attainment }}</p>
            <p><strong>Position:</strong> {{ selectedAgent.position }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="showDetailsModal = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Add Agent Modal -->
      <v-dialog v-model="showAddAgentModal" max-width="700px">
        <v-card>
          <v-card-title class="justify-center pb-0">
            <v-row align="center" justify="center" no-gutters>
              <v-col cols="12" class="text-center">
                <img src="../assets/logo.png" alt="Advench Realty Logo" style="max-width: 80px; margin-bottom: 8px;" />
              </v-col>
              <v-col cols="12" class="text-center">
                <span class="text-h5 font-weight-bold">Add Agent Details</span>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-form ref="addAgentForm">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field v-model="newAgent.last_name" label="Last Name" outlined dense required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="newAgent.first_name" label="First Name" outlined dense required></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="newAgent.middle_name" label="Middle Name" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="newAgent.dob"
                      label="Date of Birth"
                      type="date"
                      dense
                      outlined
                      hide-details
                      required
                    />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="newAgent.address" label="Address" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="newAgent.civil_status" :items="civilStatusOptions" label="Civil Status" outlined dense></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="newAgent.educational_attainment" :items="educationOptions" label="Educational Attainment" outlined dense></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="newAgent.position" :items="positionOptions" label="Agent Position" outlined dense required></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-between px-4 pb-4">
            <v-btn text color="green" @click="showAddAgentModal = false">Cancel</v-btn>
            <v-btn color="grey darken-1" dark @click="addAgent">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Add Agent Dialog -->
      <v-dialog v-model="addDialog" max-width="700">
        <v-card>
          <v-card-title>
            <span class="headline">Add Agent Details</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="agentForm" v-model="formValid">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="agent.lastName"
                    label="Last Name"
                    :rules="[rules.required, rules.name]"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="agent.firstName"
                    label="First Name"
                    :rules="[rules.required, rules.name]"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="agent.middleName"
                    label="Middle Name"
                    :rules="[rules.optionalName]"
                  />
                </v-col>
                <v-col cols="6">
                 <v-text-field
                      v-model="agent.dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      :rules="[rules.required, rules.dob]"
                      required
                    />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="agent.address"
                    label="Address"
                    :rules="[rules.required, rules.address]"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="agent.civilStatus"
                    :items="['Single', 'Married']"
                    label="Civil Status"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="agent.education"
                    label="Educational Attainment"
                    :rules="[rules.required, rules.education]"
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="agent.position"
                    :items="positions"
                    label="Agent Position"
                    :rules="[rules.required]"
                    required
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="addDialog = false">Cancel</v-btn>
            <v-btn color="primary" :disabled="!formValid" @click="submitAgent">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
    <!-- Footer -->
    <v-footer app color="green darken-4" dark class="custom-footer">
      <v-container>
        <span>Copyright © 2023. ADVЕNCH REALTY and development co. All rights Reserved.</span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      drawer: false,
      drawerItems: [
        { title: 'DASHBOARD', icon: 'mdi-view-dashboard', to: '/dashboard' },
        { title: 'CLIENT TRACKING', icon: 'mdi-account-group', to: '/clients' },
        { title: 'AGENT TRACKING', icon: 'mdi-account-tie', to: '/agents' },
        { title: 'COMMS. MGMT.', icon: 'mdi-message-text-outline', to: '/commission-management' },
        { title: 'SALES TRACKING', icon: 'mdi-chart-line', to: '/sales-tracking' },
        { title: 'PROPERTY LISTING', icon: 'mdi-home-city-outline', to: { name: 'PropertyListing' } },
      ],
      agents: [],
      showDetailsModal: false,
      showAddAgentModal: false,
      addDialog: false,
      selectedAgent: {},
      newAgent: {
        last_name: '',
        first_name: '',
        middle_name: '',
        dob: '',
        address: '',
        civil_status: '',
        educational_attainment: '',
        position: '',
      },
      agent: {
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        address: '',
        civilStatus: '',
        education: '',
        position: '',
      },
      searchQuery: '',
      dobMenu: false,
      formValid: false,
      civilStatusOptions: ['Single', 'Married', 'Widowed', 'Divorced'],
      educationOptions: ['High School', 'College', 'Masteral', 'Doctorate'],
      positionOptions: ['Broker', 'Sales Manager', 'Sales Agent'],
      positions: ['Agent', 'Manager', 'Supervisor'],
      rules: {
        required: v => !!v || 'This field is required',
        name: v => /^[a-zA-Z.\-| ]{1,25}$/.test(v) || 'Letters, dot, dash, pipe, space (max 25)',
        optionalName: v => !v || /^[a-zA-Z.\-| ]{1,25}$/.test(v) || 'Letters, dot, dash, pipe, space (max 25)',
        dob: v => {
          if (!v) return true;
          const d = new Date(v);
          return (d >= new Date('1900-01-01') && d <= new Date('3000-12-31')) || 'Date must be 1900-01-01 to 3000-12-31';
        },
        address: v => /^[a-zA-Z0-9.\-|@, ]{1,100}$/.test(v) || 'Up to 100 chars: letters, numbers, dot, dash, pipe, @, comma, space',
        education: v => /^[a-zA-Z0-9.\-|@, ]{1,40}$/.test(v) || 'Up to 40 chars: letters, numbers, dot, dash, pipe, @, comma, space',
      }
    };
  },
  mounted() {
    this.fetchAgents();
  },
  computed: {
    filteredAgents() {
      return this.agents.filter(agent => {
        const name = `${agent.last_name} ${agent.first_name} ${agent.middle_name}`.toLowerCase();
        return name.includes(this.searchQuery.toLowerCase()) ||
          (agent.position && agent.position.toLowerCase().includes(this.searchQuery.toLowerCase()));
      });
    },
  },
  methods: {
    fetchAgents() {
      axios.get('http://localhost:3000/api/agents') // Change port if needed
        .then(res => {
          this.agents = res.data;
        })
        .catch(err => {
          console.error('Failed to fetch agents:', err);
        });
    },
    viewAgentDetails(agent) {
      // Assuming agent.id is the unique identifier
      this.$router.push({ name: 'AgentDetails', params: { id: agent.id } });
    },
    addAgent() {
      // Add agent logic here (API call or local update)
      if (!this.newAgent.last_name || !this.newAgent.first_name || !this.newAgent.position) {
        alert('Please fill in all required fields.');
        return;
      }
      axios.post('http://localhost:3000/api/agents', this.newAgent)
        .then(() => {
          this.fetchAgents();
          this.showAddAgentModal = false;
          this.newAgent = {
            last_name: '',
            first_name: '',
            middle_name: '',
            dob: '',
            address: '',
            civil_status: '',
            educational_attainment: '',
            position: '',
          };
          if (this.$refs.addAgentForm) this.$refs.addAgentForm.reset();
        })
        .catch(err => {
          alert('Failed to save agent: ' + err);
        });
    },
    submitAgent() {
      if (this.$refs.agentForm.validate()) {
        // Submit logic here
        alert('Form is valid and ready to submit!');
        this.addDialog = false;
      }
    },
    logout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push('/login');
    },
  },
};
</script>

<style>
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
.table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
}
.custom-table {
  width: 100%;
  border-collapse: collapse; /* Make header full width */
  table-layout: fixed;
}
.table-header {
  background-color: #4CAF50;
  color: white;
  text-align: center; /* Center header text */
  padding: 12px;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 1;
}
.table-row {
  background-color: #F5F5F5;
  text-align: left;
  border-radius: 8px;
  overflow: hidden;
}
.custom-table td {
  text-align: center; /* Center table body cells */
}
.table-row td {
  padding: 12px 20px;
  word-wrap: break-word;
}
.table-row:hover {
  background-color: #e0e0e0;
}
th, td {
  text-align: left;
}
html, body, #app, .v-application {
  height: 100%;
  margin: 0;
}
.v-app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.v-main {
  flex: 1;
}
.custom-footer {
  background-color: #4CAF50;
  color: white;
  height: 50px;
}
.add-button-row {
  margin-bottom: 24px;
}
</style>
