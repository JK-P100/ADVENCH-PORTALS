<!-- filepath: c:\Users\jann kevin\Desktop\ADVENCH PORTAL\frontend\src\components\ClientDetails.vue -->
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

    <v-main>
      <v-container fluid class="pa-0" style="max-width: 85vw; margin: 0 auto;">
        <!-- Top Navigation Row (matches ClientRecords.vue) -->
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
          <v-row align="center">
            <v-col cols="auto">
              <v-avatar size="80">
                <v-icon size="80" color="grey lighten-2">mdi-account</v-icon>
              </v-avatar>
            </v-col>
            <v-col>
              <div class="profile-title">{{ client.first_name }} {{ client.last_name }}</div>
              <div class="profile-subtitle">{{ client.job_details }}</div>
              <div class="profile-location">{{ client.address }}</div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Personal Information Card -->
        <v-card class="mb-6 pa-6">
          <div class="d-flex align-center mb-4">
            <span class="section-title mr-2" style="color:#26a69a;">Personal information</span>
          </div>
          <v-form ref="editClientForm" v-model="addClientFormValid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <div class="label">First Name</div>
                <div v-if="!isEditing">{{ client.first_name }}</div>
                <v-text-field
                  v-else
                  v-model="editableClient.first_name"
                  label="First Name"
                  :rules="[addClientRules.required, addClientRules.legalName]"
                  @input="filterLegalName('first_name')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Last Name</div>
                <div v-if="!isEditing">{{ client.last_name }}</div>
                <v-text-field
                  v-else
                  v-model="editableClient.last_name"
                  label="Last Name"
                  :rules="[addClientRules.required, addClientRules.legalName]"
                  @input="filterLegalName('last_name')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Phone Number</div>
                <div v-if="!isEditing">{{ client.phone_number }}</div>
                <v-text-field
                  v-else
                  v-model="editableClient.phone_number"
                  label="Phone Number"
                  :rules="[addClientRules.required, addClientRules.number]"
                  @input="filterPhoneNumber"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Email</div>
                <div v-if="!isEditing">{{ client.email }}</div>
                <v-text-field
                  v-else
                  v-model="editableClient.email"
                  label="Email"
                  :rules="[addClientRules.required, addClientRules.email, addClientRules.emailLegal]"
                  @input="filterEmail"
                  maxlength="50"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Gender</div>
                <div v-if="!isEditing">{{ client.gender }}</div>
                <v-select
                  v-else
                  v-model="editableClient.gender"
                  :items="['Male', 'Female', 'Other', 'Prefer not to say']"
                  label="Gender"
                  :rules="[addClientRules.required]"
                  dense
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Date of Birth</div>
                <div v-if="!isEditing">{{ client.dob }}</div>
                <v-text-field
                  v-else
                  v-model="editableClient.dob"
                  label="Date of Birth"
                  type="date"
                  :rules="[addClientRules.required]"
                  dense
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Address</div>
                <div v-if="!isEditing">{{ client.address }}</div>
                <v-text-field
                  v-else
                  v-model="editableClient.address"
                  label="Address"
                  :rules="[addClientRules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Occupation</div>
                <div v-if="!isEditing">{{ client.job_details }}</div>
                <v-text-field v-else v-model="editableClient.job_details" dense hide-details></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Monthly Income</div>
                <div v-if="!isEditing">{{ client.monthly_income ? `₱${client.monthly_income}` : '' }}</div>
                <v-text-field
                  v-else
                  v-model="editableClient.monthly_income"
                  dense
                  hide-details
                  prefix="₱"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="label">Source of Funds</div>
                <div v-if="!isEditing">{{ client.source_of_funds }}</div>
                <v-text-field
                  v-else
                  v-model="editableClient.source_of_funds"
                  label="Source of Funds"
                  :rules="[addClientRules.required, addClientRules.sourceOfFundsLegal]"
                  @input="filterSourceOfFunds"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card>


        <!-- Documents Card -->
        <v-card class="mb-6 pa-6">
          <div class="section-title mb-4" style="color:#26a69a;">Documents</div>
          <v-row>
            <v-col cols="12" md="6">
              <div class="d-flex align-center mb-2">
                <div class="label">Proof of Billing</div>
                <template v-if="!isEditing">
                  <v-icon v-if="client.proof_of_billing" color="success" small>mdi-checkbox-marked</v-icon>
                  <v-icon v-else color="grey" small>mdi-checkbox-blank-outline</v-icon>
                </template>
                <v-checkbox v-else v-model="editableClient.proof_of_billing" hide-details dense class="ml-2"></v-checkbox>
              </div>
              <div class="d-flex align-center mb-2">
                <div class="label">Tax Certificate</div>
                <template v-if="!isEditing">
                  <v-icon v-if="client.tax_certificate" color="success" small>mdi-checkbox-marked</v-icon>
                  <v-icon v-else color="grey" small>mdi-checkbox-blank-outline</v-icon>
                </template>
                <v-checkbox v-else v-model="editableClient.tax_certificate" hide-details dense class="ml-2"></v-checkbox>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="d-flex align-center mb-2">
                <div class="label">Birth Certificate</div>
                <template v-if="!isEditing">
                  <v-icon v-if="client.birth_certificate" color="success" small>mdi-checkbox-marked</v-icon>
                  <v-icon v-else color="grey" small>mdi-checkbox-blank-outline</v-icon>
                </template>
                <v-checkbox v-else v-model="editableClient.birth_certificate" hide-details dense class="ml-2"></v-checkbox>
              </div>
              <div class="d-flex align-center mb-2">
                <div class="label">Marriage Contract (if married)</div>
                <template v-if="!isEditing">
                  <v-icon v-if="client.marriage_contract" color="success" small>mdi-checkbox-marked</v-icon>
                  <v-icon v-else color="grey" small>mdi-checkbox-blank-outline</v-icon>
                </template>
                <v-checkbox v-else v-model="editableClient.marriage_contract" hide-details dense class="ml-2"></v-checkbox>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Edit/Save Button -->
        <div class="d-flex justify-end mb-8">
          <v-btn color="primary" @click="toggleEdit" small>
            {{ isEditing ? 'Save' : 'Edit' }}
          </v-btn>
        </div>
      </v-container>
    </v-main>
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
      client: {},
      editableClient: {},
      isEditing: false,
      drawer: false,
      drawerItems: [
        { title: 'DASHBOARD', icon: 'mdi-view-dashboard', to: '/dashboard' },
        { title: 'CLIENT TRACKING', icon: 'mdi-account-group', to: '/clients' },
        { title: 'AGENT TRACKING', icon: 'mdi-account-tie', to: '/agents' },
        { title: 'COMMS. MGMT.', icon: 'mdi-message-text-outline', to: '/commission-management' },
        { title: 'SALES TRACKING', icon: 'mdi-chart-line', to: '/sales-tracking' },
        { title: 'PROPERTY LISTING', icon: 'mdi-home-city-outline', to: { name: 'PropertyListing' } },
      ],
      agentOptions: [
        'Jann Kevin Polagne',
        'Daniella Villamer',
        'jerome Mark Salud',
        'Sean Rey Dizon',
        'Ken Chavez',
      ],
       sales_manager: [
        'Jann Kevin Polagne',
        'Daniella Villamer',
        'jerome Mark Salud',
        'Sean Rey Dizon',
        'Ken Chavez',
      ],
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
  created() {
    const clientId = this.$route.params.id;
    this.fetchClientDetails(clientId);
  },
  computed: {
    firstNameError() {
      return this.isEditing && !this.legalNameRule(this.editableClient.first_name)
        ? ['Only [a-z | A-Z | . | - | | ] characters are allowed']
        : [];
    },
    lastNameError() {
      return this.isEditing && !this.legalNameRule(this.editableClient.last_name)
        ? ['Only [a-z | A-Z | . | - | | ] characters are allowed']
        : [];
    }
  },
  methods: {
    fetchClientDetails(clientId) {
      axios
        .get(`http://localhost:3000/api/clients/${clientId}`)
        .then((response) => {
          this.client = response.data;
          // Ensure boolean conversion for checkboxes
          this.editableClient = {
            ...response.data,
            proof_of_billing: !!response.data.proof_of_billing,
            tax_certificate: !!response.data.tax_certificate,
            birth_certificate: !!response.data.birth_certificate,
            marriage_contract: !!response.data.marriage_contract,
          };
        })
        .catch((error) => {
          console.error('Error fetching client details:', error);
        });
    },
    toggleEdit() {
      if (this.isEditing) {
        // Validate before saving
        if (this.$refs.editClientForm && !this.$refs.editClientForm.validate()) {
          // If validation fails, do not save
          return;
        }
        // Convert booleans to 1/0 for backend
        const payload = {
          ...this.editableClient,
          proof_of_billing: this.editableClient.proof_of_billing ? 1 : 0,
          tax_certificate: this.editableClient.tax_certificate ? 1 : 0,
          birth_certificate: this.editableClient.birth_certificate ? 1 : 0,
          marriage_contract: this.editableClient.marriage_contract ? 1 : 0,
        };
        axios
          .put(`http://localhost:3000/api/clients/${this.client.id}`, payload)
          .then(() => {
            this.client = { ...this.editableClient };
            this.isEditing = false;
          })
          .catch((error) => {
            console.error('Error saving client details:', error);
            alert('Failed to save changes. Please try again.');
          });
      } else {
        this.isEditing = true;
      }
    },
    logout() {
      // Implement logout functionality here
    },
    legalNameRule(value) {
      return /^[a-zA-Z.\-| ]*$/.test(value) || 'Only letters, dot (.), dash (-), pipe (|), and spaces are allowed';
    },
    onLegalNameInput(field, event) {
      // Always get the value from the event target
      const value = typeof event === 'string' ? event : event?.target?.value || '';
      this.editableClient[field] = value.replace(/[^a-zA-Z.\-| ]/g, '');
    },
    filterLegalName(field) {
      const legal = this.editableClient[field].replace(/[^a-zA-Z.\-| ]/g, '');
      this.editableClient[field] = legal;
    },
    filterPhoneNumber() {
      let value = this.editableClient.phone_number.replace(/[^0-9|]/g, '');
      const digits = value.replace(/[^0-9]/g, '');
      if (digits.length > 11) {
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
      this.editableClient.phone_number = value;
    },
    filterEmail() {
      let filtered = this.editableClient.email.replace(/[^a-zA-Z0-9,.\-@|]/g, '');
      if (filtered.length > 50) {
        filtered = filtered.slice(0, 50);
      }
      this.editableClient.email = filtered;
    },
    filterJobDetails() {
      this.editableClient.job_details = this.editableClient.job_details.replace(/[^a-zA-Z0-9,.\-| ]/g, '');
    },
    filterSourceOfFunds() {
      this.editableClient.source_of_funds = this.editableClient.source_of_funds.replace(/[^a-zA-Z0-9,.\-| ]/g, '');
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
.label {
  color: #757575;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 2px;
}
.text-success {
  color: #4CAF50;
}
</style>


