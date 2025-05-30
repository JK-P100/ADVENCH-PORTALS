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

    <!-- Header -->
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
            <h1 class="text-h4 font-weight-bold">COMMISSION MANAGEMENT</h1>
          </v-col>
        </v-row>

        <!-- Search Bar -->
        <v-row class="mb-1" align="center">
          <v-col cols="12" md="10">
            <v-text-field
              label="Search"
              outlined
              dense
              hide-details
              v-model="searchQuery"
              append-inner-icon="mdi-magnify"
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
                      <th class="table-header">ID</th>
                      <th class="table-header">Sales ID</th>
                      <th class="table-header">Property No</th>
                      <th class="table-header">Buyer Name</th>
                      <th class="table-header">Sales Agent</th>
                      <th class="table-header">Gross Commission</th>
                      <th class="table-header">Net Commission</th>
                      <th class="table-header">Date Disbursed</th>
                      <th class="table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(commission, index) in filteredCommissions" :key="index" class="table-row">
                      <td>{{ commission.id }}</td>
                      <td>{{ commission.sales_id }}</td>
                      <td>{{ commission.property_no }}</td>
                      <td>{{ commission.buyer_name }}</td>
                      <td>{{ commission.sales_agent }}</td>
                      <td>{{ commission.gross_commission }}</td>
                      <td>{{ commission.net_commission }}</td>
                      <td>{{ formatDate(commission.date_disbursed) }}</td>
                      <td>
                        <v-btn icon color="green darken-2" @click="openEditModal(commission, index)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red darken-2" @click="deleteCommission(index)">
                          <v-icon>mdi-delete</v-icon>
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
            <v-btn color="grey darken-1" dark style="width: 200px;" @click="openAddModal">Add</v-btn>
          </v-col>
        </v-row>

        <!-- Add/Edit Modal -->
        <v-dialog v-model="modalOpen" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h6">{{ isEditMode ? 'Edit Commission' : 'Add Commission' }}</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="commissionForm" v-model="commissionFormValid">
                <v-text-field
                  v-if="isEditMode"
                  v-model="modalCommission.id"
                  label="ID"
                  :rules="[commissionRules.required]"
                  required
                  disabled
                ></v-text-field>
                <v-text-field v-model="modalCommission.property_no" label="Property No" :rules="[commissionRules.required]" required></v-text-field>
                 <v-text-field
                  v-model="modalCommission.sales_id"
                  label="Sales ID"
                  :rules="[commissionRules.number]"
                  required
                  type="number"
                ></v-text-field>
                <v-text-field v-model="modalCommission.buyer_name" label="Buyer Name" :rules="[commissionRules.required]" required></v-text-field>
                <v-text-field v-model="modalCommission.sales_agent" label="Sales Agent" :rules="[commissionRules.required]" required></v-text-field>
                <v-text-field v-model="modalCommission.gross_commission" label="Gross Commission" :rules="[commissionRules.required, commissionRules.number]" required></v-text-field>
                <v-text-field v-model="modalCommission.net_commission" label="Net Commission" :rules="[commissionRules.required, commissionRules.number]" required></v-text-field>
                <v-text-field
                  v-model="modalCommission.date_disbursed"
                  label="Date Disbursed"
                  :rules="[commissionRules.required]"
                  required
                  type="date"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeModal">Cancel</v-btn>
              <v-btn
                color="green darken-2"
                dark
                @click="saveCommission"
                :disabled="!commissionFormValid"
              >
                {{ isEditMode ? 'Save' : 'Add' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
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
      searchQuery: '',
      modalOpen: false,
      isEditMode: false,
      modalCommission: {},
      editIndex: null,
      commissionRules: {
        required: v => !!v || 'This field is required',
        number: v => /^\d+(\.\d+)?$/.test(v) || 'Must be a number',
      },
      commissionFormValid: false,
      commissions: [],
    };
  },
  created() {
    this.fetchCommissions();
  },
  computed: {
    filteredCommissions() {
      if (!this.searchQuery) return this.commissions;
      const q = this.searchQuery.toLowerCase();
      return this.commissions.filter(
        c =>
          c.id.toString().toLowerCase().includes(q) ||
          c.property_no.toLowerCase().includes(q) ||
          c.buyer_name.toLowerCase().includes(q) ||
          c.sales_agent.toLowerCase().includes(q) ||
          c.gross_commission.toString().toLowerCase().includes(q) ||
          c.net_commission.toString().toLowerCase().includes(q) ||
          c.date_disbursed.toLowerCase().includes(q)
      );
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push('/login');
    },
    openAddModal() {
      this.isEditMode = false;
      this.modalCommission = {
        sales_id: '', // Added
        property_no: '',
        buyer_name: '',
        sales_agent: '',
        gross_commission: '',
        net_commission: '',
        date_disbursed: '',
      };
      this.modalOpen = true;
      this.editIndex = null;
    },
    openEditModal(commission, index) {
      this.isEditMode = true;
      this.modalCommission = { ...commission };
      this.modalOpen = true;
      this.editIndex = index;
    },
    closeModal() {
      this.modalOpen = false;
    },
    saveCommission() {
      if (this.$refs.commissionForm.validate()) {
        let date = this.modalCommission.date_disbursed;
        if (date && date.includes('/')) {
          const [day, month, year] = date.split('/');
          date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          alert('Please enter a valid date in YYYY-MM-DD format.');
          return;
        }
        const gross = parseFloat(this.modalCommission.gross_commission).toFixed(2);
        const net = parseFloat(this.modalCommission.net_commission).toFixed(2);
        if (isNaN(gross) || isNaN(net)) {
          alert('Commission values must be numbers.');
          return;
        }
        if (this.isEditMode && this.editIndex !== null) {
          this.commissions.splice(this.editIndex, 1, { ...this.modalCommission, date_disbursed: date, gross_commission: gross, net_commission: net });
          this.modalOpen = false;
        } else {
          axios.post('http://localhost:3000/api/commissions', {
            sales_id: this.modalCommission.sales_id, // Added
            property_no: this.modalCommission.property_no,
            buyer_name: this.modalCommission.buyer_name,
            sales_agent: this.modalCommission.sales_agent,
            gross_commission: gross,
            net_commission: net,
            date_disbursed: date
          })
          .then(() => {
            this.fetchCommissions();
            this.modalOpen = false;
          })
          .catch(err => {
            alert('Failed to add commission. ' + (err.response?.data?.details || ''));
            console.error(err);
          });
        }
      }
    },
    deleteCommission(index) {
      const commission = this.commissions[index];
      if (confirm('Are you sure you want to delete this commission?')) {
        axios.delete(`http://localhost:3000/api/commissions/${commission.id}`)
          .then(() => {
            this.fetchCommissions(); // Refresh the list from DB
          })
          .catch(err => {
            alert('Failed to delete commission. ' + (err.response?.data?.details || ''));
            console.error(err);
          });
      }
    },
    fetchCommissions() {
      axios.get('http://localhost:3000/api/commissions')
        .then(res => {
          this.commissions = res.data;
        })
        .catch(err => {
          console.error('Failed to fetch commissions:', err);
        });
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.fetchCommissions();
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
}
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
  width: 8%;
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