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
        <!-- Header -->
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
            <h1 class="text-h4 font-weight-bold">SALES TRACKING</h1>
          </v-col>
        </v-row>

        <!-- Sales Summary -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-card class="pa-4" :color="salesTab === 'yearly' ? '#e3f2fd' : salesTab === 'monthly' ? '#e8f5e9' : '#fffde7'">
              <div class="font-weight-bold">
                {{ salesTab.charAt(0).toUpperCase() + salesTab.slice(1) }} Sales
              </div>
              <div class="text-h5">
                ₱{{
                  salesTab === 'yearly' ? yearlySales.toLocaleString() :
                  salesTab === 'monthly' ? monthlySales.toLocaleString() :
                  weeklySales.toLocaleString()
                }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Tabs and Search Row (side by side) -->
        <v-row class="mb-2" align="center">
          <v-col cols="12" md="7" class="d-flex justify-start">
            <v-tabs
              v-model="salesTab"
              background-color="transparent"
              grow
              class="custom-flat-tabs"
              slider-color="green darken-4"
              height="48"
              style="max-width: 500px;"
            >
              <v-tab value="yearly">YEARLY</v-tab>
              <v-tab value="monthly">MONTHLY</v-tab>
              <v-tab value="weekly">WEEKLY</v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="12" md="5" class="d-flex justify-end">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search..."
              outlined
              dense
              hide-details
              style="max-width: 500px;"
            ></v-text-field>
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
                      <th class="table-header id-header">ID</th>
                      <th class="table-header">RS Date</th>
                      <th class="table-header">Sales Manager</th>
                      <th class="table-header">Sales Person</th>
                      <th class="table-header">Name of Buyer</th>
                      <th class="table-header">TCP</th>
                      <th class="table-header">Project Name</th>
                      <th class="table-header">Total</th>
                      <th class="table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sale, index) in filteredSalesByTabSorted" :key="index" class="table-row">
                      <td>{{ sale.id }}</td>
                      <td>{{ formatDate(sale.rs_date) }}</td>
                      <td>{{ sale.sales_manager }}</td>
                      <td>{{ sale.sales_person }}</td>
                      <td>{{ sale.buyer_name }}</td>
                      <td>₱{{ sale.tcp ? sale.tcp.toLocaleString() : '' }}</td>
                      <td>{{ sale.project_name }}</td>
                      <td>₱{{ sale.total ? Number(sale.total).toLocaleString() : '' }}</td>
                      <td class="action-cell">
                        <v-btn icon color="green darken-2" class="action-btn" @click="openEditSaleModal(sale)">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red darken-2" class="action-btn" @click="deleteSale(sale)">
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
            <v-btn color="grey darken-1" dark style="width: 200px;" @click="openAddSaleModal">Add</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <!-- Sale Details Modal -->
      <v-dialog v-model="showDetailsModal" max-width="500px">
        <v-card>
          <v-card-title>Sale Details</v-card-title>
          <v-card-text>
            <p><strong>RS Date:</strong> {{ selectedSale.rs_date }}</p>
            <p><strong>Buyer Name:</strong> {{ selectedSale.buyer_name }}</p>
            <p><strong>TCP:</strong> ₱{{ selectedSale.tcp ? selectedSale.tcp.toLocaleString() : '' }}</p>
            <p><strong>Sales Person:</strong> {{ selectedSale.sales_person }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="showDetailsModal = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Add Sale Modal -->
      <v-dialog v-model="showAddSaleModal" max-width="600px">
        <v-card>
          <v-card-title class="d-flex align-center justify-center">
            <img src="../assets/logo.png" alt="Advench Realty Logo" style="max-width: 80px; margin-right: 16px;" />
            <span class="text-h5 font-weight-bold">Add New Sales</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="addSaleForm" v-model="addSaleFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="newSale.rs_date"
                    label="RS Date"
                    type="date"
                    :rules="[saleRules.required, saleRules.date]"
                    required
                    dense
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="newSale.tcp" label="TCP" :rules="[saleRules.required, saleRules.decimal]" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select v-model="newSale.sales_manager" :items="salesManagers" label="Sales Manager" outlined dense :rules="[saleRules.required]"></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="newSale.project_name" :items="projectNames" label="Project Name" outlined dense :rules="[saleRules.required]"></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="newSale.sales_person" label="Sales Person" outlined dense :rules="[saleRules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="newSale.total" label="Total" :rules="[saleRules.required, saleRules.decimal]" outlined dense></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="newSale.buyer_name" label="Name of Buyer" outlined dense :rules="[saleRules.required, saleRules.legalName]"></v-text-field>
                </v-col>
              </v-row>
          
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-between">
            <v-btn text color="green" @click="showAddSaleModal = false">Cancel</v-btn>
            <v-btn color="grey darken-1" dark @click="addSale" :disabled="!addSaleFormValid">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Edit Sale Modal -->
      <v-dialog v-model="showEditSaleModal" max-width="600px">
        <v-card>
          <v-card-title class="d-flex align-center justify-center">
            <img src="../assets/logo.png" alt="Advench Realty Logo" style="max-width: 80px; margin-right: 16px;" />
            <span class="text-h5 font-weight-bold">Edit Sale</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="editSaleForm" v-model="editSaleFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editSaleData.rs_date"
                    label="RS Date"
                    type="date"
                    :rules="[saleRules.required, saleRules.date]"
                    required
                    dense
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editSaleData.tcp" label="TCP" :rules="[saleRules.required, saleRules.decimal]" outlined dense></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select v-model="editSaleData.sales_manager" :items="salesManagers" label="Sales Manager" outlined dense :rules="[saleRules.required]"></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="editSaleData.project_name" :items="projectNames" label="Project Name" outlined dense :rules="[saleRules.required]"></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editSaleData.sales_person" label="Sales Person" outlined dense :rules="[saleRules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editSaleData.total" label="Total" :rules="[saleRules.required, saleRules.decimal]" outlined dense></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="editSaleData.buyer_name" label="Name of Buyer" outlined dense :rules="[saleRules.required, saleRules.legalName]"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="editSaleData.other_project" label="Other Project" outlined dense :rules="[saleRules.legalOtherProject]"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-between">
            <v-btn text color="green" @click="showEditSaleModal = false">Cancel</v-btn>
            <v-btn color="grey darken-1" dark @click="saveEditSale">Save</v-btn>
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
const legalOtherProjectRegex = /^[a-zA-Z.\-| ]{0,150}$/;

export default {
  data() {
    return {
      drawer: false,
      sales: [],
      showDetailsModal: false,
      showAddSaleModal: false,
      showEditSaleModal: false,
      selectedSale: {},
      newSale: {
        rs_date: '',
        tcp: '',
        sales_manager: '',
        project_name: '',
        sales_person: '',
        total: '',
        buyer_name: '',
        other_project: '',
      },
      editSaleData: {},
      searchQuery: '',
      filter: 'All',
      filters: ['All', 'This Month', 'This Year'],
      sort: 'Newest',
      sorts: ['Newest', 'Oldest', 'TCP High-Low', 'TCP Low-High'],
      dateMenu: false,
      pickerDate: '',      // YYYY-MM-DD for the picker
      displayDate: '',     // DD/MM/YYYY for the text field
      salesTab: 'yearly',
      salesManagers: ['JK Polagne', 'Anna Lim', 'Mark Lee', 'Maria Santos', 'Jose Tan'],
      projectNames: ['Camella', 'Astera', 'Santerra', 'Bria', 'Futura'],
      saleRules: {
        required: v => !!v || 'This field is required',
        number: v => /^\d+(\.\d+)?$/.test(v) || 'Must be a number',
        decimal: v => /^\d+(\.\d{1,2})?$/.test(v) || 'Must be a valid decimal (max 2 decimals)',
        date: v => !isNaN(Date.parse(v)) || 'Must be a valid date',
        legalName: v => !v || legalNameRegex.test(v) || 'Only [a-z A-Z . - | ] characters',
        legalOtherProject: v => !v || legalOtherProjectRegex.test(v) || 'Up to 150 [a-z A-Z . - | ] characters',
      },
      addSaleFormValid: false,
      editSaleFormValid: false,
      salesManagerToPersons: {
        'JK Polagne': ['Anna Lim', 'Mark Lee'],
        'Anna Lim': ['Maria Santos', 'Jose Tan'],
        'Mark Lee': ['Peter Cruz'],
        'Maria Santos': ['Liza Reyes'],
        'Jose Tan': ['Ben Cruz'],
      },
      salesPersons: [],
      drawerItems: [
        { title: 'DASHBOARD', icon: 'mdi-view-dashboard', to: '/dashboard' },
        { title: 'CLIENT TRACKING', icon: 'mdi-account-group', to: '/clients' },
        { title: 'AGENT TRACKING', icon: 'mdi-account-tie', to: '/agents' },
        { title: 'COMMS. MGMT.', icon: 'mdi-message-text-outline', to: '/commission-management' },
        { title: 'SALES TRACKING', icon: 'mdi-chart-line', to: '/sales-tracking' },
        { title: 'PROPERTY LISTING', icon: 'mdi-home-city-outline', to: { name: 'PropertyListing' } },
      ],
    };
  },
  watch: {
    'newSale.sales_manager'(val) {
      if (val && this.salesManagerToPersons[val] && this.salesManagerToPersons[val].length > 0) {
        this.newSale.sales_person = this.salesManagerToPersons[val][0];
        this.salesPersons = this.salesManagerToPersons[val];
      } else {
        this.newSale.sales_person = '';
        this.salesPersons = [];
      }
    },
    'newSale.rs_date': {
      immediate: true,
      handler(val) {
        this.pickerDate = val || '';
        this.displayDate = val ? this.formatDate(val) : '';
      }
    },
    'editSaleData.rs_date': {
      immediate: false,
      handler(val) {
        this.editDisplayDate = val ? this.formatDate(val) : '';
      }
    }
  },
  computed: {
    filteredSales() {
      const query = this.searchQuery.toLowerCase();
      return this.sales.filter((sale) => {
        return (
          sale.buyer_name.toLowerCase().includes(query) ||
          sale.sales_person.toLowerCase().includes(query) ||
          String(sale.id).toLowerCase().includes(query)
        );
      });
    },
    filteredSalesByTab() {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const year = now.getFullYear();
      const month = now.getMonth();
      return this.filteredSales.filter(sale => {
        const saleDate = new Date(sale.rs_date);
        if (this.salesTab === 'yearly') {
          return saleDate.getFullYear() === year;
        } else if (this.salesTab === 'monthly') {
          return saleDate.getFullYear() === year && saleDate.getMonth() === month;
        } else if (this.salesTab === 'weekly') {
          return saleDate >= startOfWeek && saleDate <= now;
        }
        return true;
      });
    },
    filteredSalesByTabSorted() {
      let result = this.filteredSalesByTab;
      // Filter
      if (this.filter === 'This Month') {
        const now = new Date();
        result = result.filter(sale => {
          const d = new Date(sale.rs_date);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        });
      } else if (this.filter === 'This Year') {
        const year = new Date().getFullYear();
        result = result.filter(sale => new Date(sale.rs_date).getFullYear() === year);
      }
      // Sort
      if (this.sort === 'Newest') {
        result = result.slice().sort((a, b) => new Date(b.rs_date) - new Date(a.rs_date));
      } else if (this.sort === 'Oldest') {
        result = result.slice().sort((a, b) => new Date(a.rs_date) - new Date(b.rs_date));
      } else if (this.sort === 'TCP High-Low') {
        result = result.slice().sort((a, b) => b.tcp - a.tcp);
      } else if (this.sort === 'TCP Low-High') {
        result = result.slice().sort((a, b) => a.tcp - b.tcp);
      }
      return result;
    },
    yearlySales() {
      const year = new Date().getFullYear();
      return this.sales
        .filter(sale => new Date(sale.rs_date).getFullYear() === year)
        .reduce((sum, sale) => sum + Number(sale.tcp), 0);
    },
    monthlySales() {
      const now = new Date();
      return this.sales
        .filter(sale => {
          const d = new Date(sale.rs_date);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })
        .reduce((sum, sale) => sum + Number(sale.tcp), 0);
    },
    weeklySales() {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return this.sales
        .filter(sale => {
          const d = new Date(sale.rs_date);
          return d >= startOfWeek && d <= now;
        })
        .reduce((sum, sale) => sum + Number(sale.tcp), 0);
    },
  },
  mounted() {
    this.fetchSales();
  },
  methods: {
    openAddSaleModal() {
      this.newSale = {
        rs_date: '',
        tcp: '',
        sales_manager: '',
        project_name: '',
        sales_person: '',
        total: '',
        buyer_name: '',
        other_project: ''
      };
      this.pickerDate = '';
      this.displayDate = '';
      this.showAddSaleModal = true;
    },
    addSale() {
      if (!this.$refs.addSaleForm.validate()) return;
      const payload = {
        ...this.newSale,
        other_project: this.newSale.other_project || '',
        rs_date: this.newSale.rs_date
          ? new Date(this.newSale.rs_date).toISOString().slice(0, 10)
          : '',
      };
      axios.post('http://localhost:3000/api/sales', payload)
        .then(() => {
          this.fetchSales();
          this.showAddSaleModal = false;
          this.newSale = { rs_date: '', tcp: '', sales_manager: '', project_name: '', sales_person: '', total: '', buyer_name: '', other_project: '' };
          this.$refs.addSaleForm.reset();
        });
    },
    openEditSaleModal(sale) {
      this.editSaleData = { ...sale };
      this.showEditSaleModal = true;
    },
    saveEditSale() {
      if (!this.$refs.editSaleForm.validate()) return;
      const payload = {
        ...this.editSaleData,
        rs_date: this.editSaleData.rs_date
          ? new Date(this.editSaleData.rs_date).toISOString().slice(0, 10)
          : '',
      };
      axios.put(`http://localhost:3000/api/sales/${payload.id}`, payload)
        .then(() => {
          this.fetchSales();
          this.showEditSaleModal = false;
        })
        .catch(error => {
          alert('Failed to update sale.');
          console.error('Error updating sale:', error);
        });
    },
    deleteSale(sale) {
      if (confirm('Are you sure you want to delete this sale?')) {
        axios.delete(`http://localhost:3000/api/sales/${sale.id}`)
          .then(() => {
            this.fetchSales();
          })
          .catch(error => {
            alert('Failed to delete sale.');
            console.error('Error deleting sale:', error);
          });
      }
    },
    onDatePicked(val) {
      // val is YYYY-MM-DD
      this.pickerDate = val;
      this.displayDate = this.formatDate(val); // DD/MM/YYYY
      this.newSale.rs_date = val; // always store as YYYY-MM-DD for backend
      this.dateMenu = false;
    },
    onEditDatePicked(val) {
      this.editSaleData.rs_date = val;
      this.editDateMenu = false;
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (isNaN(d)) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    viewSaleDetails(sale) {
      this.selectedSale = sale;
      this.showDetailsModal = true;
    },
    fetchSales() {
      axios.get('http://localhost:3000/api/sales')
        .then(response => {
          this.sales = response.data;
          console.log('Fetched sales:', this.sales);
        })
        .catch(error => {
          console.error('Error fetching sales:', error);
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
  border-radius: 12px;
  background: transparent;
  padding: 0;
}
.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 12px; /* space between rows */
  table-layout: fixed;
  background: transparent;
}
.table-header,
th,
td {
  text-align: center !important;
  vertical-align: middle !important;
  padding: 16px 12px;
  font-size: 1rem;
}
.id-header {
  width: 60px !important;
  min-width: 40px !important;
  max-width: 80px !important;
  text-align: center;
}
.table-row {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(60,60,60,0.04);
  transition: box-shadow 0.2s;
}
.table-row:hover {
  box-shadow: 0 4px 16px rgba(60,60,60,0.10);
  background: #f5f5f5;
}
.table-row td {
  padding: 16px 14px;
  border: none;
  font-size: 0.98rem;
  vertical-align: middle;
  background: transparent;
}
.action-cell {
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: center;
  align-items: center;
  min-width: 120px;
}
.action-btn {
  margin: 0;
}
th, td {
  text-align: center !important;
  vertical-align: middle !important;
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