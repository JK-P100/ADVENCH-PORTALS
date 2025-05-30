<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      color="#f5f5f5"
      width="260"
      class="elevation-3 rounded-drawer"
      dark
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

    <!-- Header -->


    <!-- Main Content -->
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
            <h1 class="text-h4 font-weight-bold">RECORDS OF CLIENTS</h1>
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
              <v-simple-table dense class="custom-table">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="table-header">First Name</th>
                      <th class="table-header">Surname</th>
                      <th class="table-header">Phone Number</th>
                      <th class="table-header">Email</th>
                      <th class="table-header actions-column">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(client, index) in filteredClients" :key="index" class="table-row">
                      <td>{{ client.first_name }}</td>
                      <td>{{ client.last_name }}</td>
                      <td>{{ client.phone_number }}</td>
                      <td>{{ client.email }}</td>
                      <td class="actions-cell">
                        <v-btn icon :to="{ name: 'ClientDetails', params: { id: client.id } }">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </v-col>
        </v-row>

        <!-- Add Button -->
        <v-row justify="end" class="mt-4 add-button-row">
          <v-col cols="auto">
            <v-btn color="grey darken-1" dark style="width: 200px;" @click="openAddClientModal">Add</v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- Client Details Modal -->
      <v-dialog v-model="showDetailsModal" max-width="600px">
        <v-card>
          <v-card-title>Client Details</v-card-title>
          <v-card-text>
            <p><strong>First Name:</strong> {{ selectedClient.first_name }}</p>
            <p><strong>Last Name:</strong> {{ selectedClient.last_name }}</p>
            <p><strong>Phone Number:</strong> {{ selectedClient.phone_number }}</p>
            <p><strong>Email:</strong> {{ selectedClient.email }}</p>
            <p><strong>Gender:</strong> {{ selectedClient.gender }}</p>
            <p><strong>Address:</strong> {{ selectedClient.address }}</p>
            <p><strong>Date of Birth:</strong> {{ selectedClient.dob }}</p>
            <p><strong>Job Details:</strong> {{ selectedClient.job_details }}</p>
            <p><strong>Monthly Income:</strong> {{ selectedClient.monthly_income }}</p>
            <p><strong>Source of Funds:</strong> {{ selectedClient.source_of_funds }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="showDetailsModal = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Add Client Modal -->
      <v-dialog v-model="showAddClientModal" max-width="600px">
        <v-card>
          <v-card-title>Add New Client</v-card-title>
          <v-card-text>
            <v-form ref="addClientForm" v-model="addClientFormValid" lazy-validation>
              <v-text-field
                v-model="newClient.first_name"
                label="First Name"
                :rules="[addClientRules.required, addClientRules.legalName]"
                @input="filterLegalName('first_name')"
              ></v-text-field>
              <v-text-field
                v-model="newClient.last_name"
                label="Last Name"
                :rules="[addClientRules.required, addClientRules.legalName]"
                @input="filterLegalName('last_name')"
              ></v-text-field>
              <v-text-field
                v-model="newClient.phone_number"
                label="Phone Number"
                :rules="[addClientRules.required, addClientRules.number]"
                @input="filterPhoneNumber"
              ></v-text-field>
              <v-text-field
                v-model="newClient.email"
                label="Email"
                :rules="[addClientRules.required, addClientRules.email, addClientRules.emailLegal]"
                required
                @input="filterEmail"
                maxlength="50"
              ></v-text-field>
              <v-select
                v-model="newClient.gender"
                :items="['Male', 'Female', 'Other', 'Prefer not to say']"
                label="Gender"
                :rules="[addClientRules.required]"
                outlined
                dense
                clearable
              ></v-select>
              <v-text-field
                v-model="newClient.address"
                label="Address"
                :rules="[addClientRules.required]"
              ></v-text-field>
              <v-text-field
                v-model="newClient.dob"
                label="Date of Birth"
                type="date"
                dense
                outlined
                hide-details
                class="mb-4"
                clearable
                :rules="[addClientRules.required]"
                :max="new Date().toISOString().substr(0, 10)"
              ></v-text-field>
              <v-text-field
                v-model="newClient.job_details"
                label="Job Details"
                :rules="[addClientRules.required, addClientRules.jobDetailsLegal]"
                @input="filterJobDetails"
              ></v-text-field>
              <v-text-field
                v-model="newClient.monthly_income"
                label="Monthly Income"
                prefix="₱"
                :rules="[addClientRules.required, addClientRules.number]"
                type="number"
                step="0.01"
              ></v-text-field>
              <v-text-field
                v-model="newClient.source_of_funds"
                label="Source of Funds"
                :rules="[addClientRules.required, addClientRules.sourceOfFundsLegal]"
                @input="filterSourceOfFunds"
              ></v-text-field>

              <!-- Documents -->
              <v-divider class="addClientForm"></v-divider>
              <div class="section-title mb-2" style="color:#26a69a;">Documents</div>
              <v-checkbox v-model="newClient.proof_of_billing" label="Proof of Billing"></v-checkbox>
              <v-checkbox v-model="newClient.tax_certificate" label="Tax Certificate"></v-checkbox>
              <v-checkbox v-model="newClient.birth_certificate" label="Birth of Certificate"></v-checkbox>
              <v-checkbox v-model="newClient.marriage_contract" label="Marriage Contract (if married)"></v-checkbox>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="green darken-1"
              text
              @click="addClient"
              :disabled="!addClientFormValid"
            >
              Add
            </v-btn>
            <v-btn color="red darken-1" text @click="showAddClientModal = false">Cancel</v-btn>
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

const legalNameRegex = /^[a-zA-Z.\-| ]+$/;
const legalEmailRegex = /^[a-zA-Z0-9,.\-@|]+$/;
const legalJobDetailsRegex = /^[a-zA-Z0-9,.\-| ]+$/;

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
      clients: [],
      showDetailsModal: false,
      showAddClientModal: false,
      selectedClient: {},
      newClient: {
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        gender: '',
        address: '',
        dob: '',
        job_details: '',
        monthly_income: '',
        source_of_funds: '',

        // Document fields
        proof_of_billing: false,
        tax_certificate: false,
        birth_certificate: false,
        marriage_contract: false,
      },
      searchQuery: '',
      dobMenu: false,
      addClientRules: {
        required: v => !!v || 'This field is required',
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        emailLegal: v => legalEmailRegex.test(v || '') || 'Only letters, numbers, comma, dot, dash, @, and pipe allowed',
        number: v =>
          /^[0-9|]+$/.test(v || '') &&
          ((v || '').replace(/[^0-9]/g, '').length <= 11) ||
          'Only numbers and max 11 digits',
        legalName: v => legalNameRegex.test(v || '') || 'Only letters, dot, dash, and spaces allowed',
        jobDetailsLegal: v =>
          legalJobDetailsRegex.test(v || '') || 'Only letters, numbers, comma, dot, dash, pipe, and spaces allowed',
        sourceOfFundsLegal: v =>
          legalJobDetailsRegex.test(v || '') || 'Only letters, numbers, comma, dot, dash, pipe, and spaces allowed',
      },
      addClientFormValid: false,
    };
  },
  computed: {
    filteredClients() {
      return this.clients.filter((client) => {
        const fullName = `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase();
        const phone = client.phone_number || '';
        const email = (client.email || '').toLowerCase();
        const query = (this.searchQuery || '').toLowerCase();
        return (
          fullName.includes(query) ||
          phone.includes(this.searchQuery || '') ||
          email.includes(query)
        );
      });
    },
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    fetchClients() {
      axios
        .get('http://localhost:3000/api/clients')
        .then((response) => {
          this.clients = response.data;
        })
        .catch((error) => {
          console.error('Error fetching clients:', error);
        });
    },
    viewClientDetails(clientId) {
      axios
        .get(`http://localhost:3000/api/clients/${clientId}`)
        .then((response) => {
          this.selectedClient = response.data;
          this.showDetailsModal = true;
        })
        .catch((error) => {
          console.error('Error fetching client details:', error);
        });
    },
    openAddClientModal() {
      this.showAddClientModal = true;
      // Do NOT reset the form here!
    },
    addClient() {
      if (this.$refs.addClientForm.validate()) {
        axios
          .post('http://localhost:3000/api/clients', this.newClient)
          .then(() => {
            this.fetchClients();
            this.showAddClientModal = false;
            this.$nextTick(() => {
              if (this.$refs.addClientForm) {
                this.$refs.addClientForm.reset();
                this.$refs.addClientForm.resetValidation();
              }
            });
          })
          .catch((error) => {
            console.error('Error adding client:', error);
          });
      }
    },
    filterLegalName(field) {
      this.newClient[field] = this.newClient[field].replace(/[^a-zA-Z.\-| ]/g, '');
    },
    filterPhoneNumber() {
      // Only allow numbers and pipes, max 11 digits (excluding pipes)
      let value = this.newClient.phone_number.replace(/[^0-9|]/g, '');
      let digits = value.replace(/[^0-9]/g, '');
      if (digits.length > 11) {
        // Trim to 11 digits, keep pipes in place
        let digitCount = 0;
        let result = '';
        for (let i = 0; i < value.length; i++) {
          if (/\d/.test(value[i])) {
            if (digitCount < 11) {
              result += value[i];
              digitCount++;
            }
          } else if (value[i] === '|') {
            result += '|';
          }
        }
        value = result;
      }
      this.newClient.phone_number = value;
    },
    filterEmail() {
      let filtered = this.newClient.email.replace(/[^a-zA-Z0-9,.\-@|]/g, '');
      if (filtered.length > 50) {
        filtered = filtered.slice(0, 50);
      }
      this.newClient.email = filtered;
    },
    filterJobDetails() {
      this.newClient.job_details = this.newClient.job_details.replace(/[^a-zA-Z0-9,.\-| ]/g, '');
    },
    filterSourceOfFunds() {
      this.newClient.source_of_funds = this.newClient.source_of_funds.replace(/[^a-zA-Z0-9,.\-| ]/g, '');
    },
    logout() {
      // Add your logout logic here
      this.$router.push('/login');
    }
  },
};
</script>

<style>
.table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
}
.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  table-layout: fixed;
}
.table-header {
  background-color: #4CAF50;
  color: white;
  text-align: left;
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
.table-row td {
  padding: 12px 20px;
  word-wrap: break-word;
}
.table-row:hover {
  background-color: #e0e0e0;
}
th, td {
  text-align: left;
  width: 24%;
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
</style>
