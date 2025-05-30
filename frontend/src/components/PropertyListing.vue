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
            <h1 class="text-h4 font-weight-bold">PROPERTY MANAGEMENT</h1>
          </v-col>
        </v-row>

        <!-- Tabs -->
        <v-row>
          <v-col cols="12">
            <v-tabs v-model="tab" background-color="green darken-2" dark>
              <v-tab>Private Property</v-tab>
              <v-tab>Property Project</v-tab>
            </v-tabs>
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

        <!-- Table for Private Property -->
        <v-row v-show="tab === 0" class="pa-0 ma-0" style="width: 100%;">
          <v-col cols="12" class="pa-0 ma-0" style="width: 100%;">
            <div class="table-container">
              <v-simple-table dense class="custom-table">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="table-header">ID</th>
                      <th class="table-header">Ownership</th>
                      <th class="table-header">Owner Firstname</th>
                      <th class="table-header">Owner Lastname</th>
                      <th class="table-header">Price</th>
                      <th class="table-header">Model</th>
                      <th class="table-header">Location</th>
                      <th class="table-header">Lot Area</th>
                      <th class="table-header">Type</th>
                      <th class="table-header">Status</th>
                      <th class="table-header">Date Listed</th>
                      <th class="table-header actions-column">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(property, index) in filteredProperties" :key="index" class="table-row">
                      <td>{{ property.id }}</td>
                      <td>{{ property.ownership }}</td>
                      <td>{{ property.owner_firstname }}</td>
                      <td>{{ property.owner_lastname }}</td>
                      <td>{{ property.price }}</td>
                      <td>{{ property.model }}</td>
                      <td>{{ property.location }}</td>
                      <td>{{ property.lot_area }}</td>
                      <td>{{ property.type }}</td>
                      <td>{{ property.status }}</td>
                      <td>{{ formatDate(property.date_listed) }}</td>
                      <td class="actions-cell">
                        <v-btn icon color="green darken-2" @click="openEditPropertyModal(property, 'private')">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red darken-2" @click="deleteProperty(index, 'private')">
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

        <!-- Table for Property Project -->
        <v-row v-show="tab === 1" class="pa-0 ma-0" style="width: 100%;">
          <v-col cols="12" class="pa-0 ma-0" style="width: 100%;">
            <div class="table-container">
              <v-simple-table dense class="custom-table">
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="table-header">ID</th>
                      <th class="table-header">Price</th>
                      <th class="table-header">Model</th>
                      <th class="table-header">Location</th>
                      <th class="table-header">Lot Area</th>
                      <th class="table-header">Type</th>
                      <th class="table-header">Status</th>
                      <th class="table-header">Date Listed</th>
                      <th class="table-header actions-column">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(property, index) in filteredProjects" :key="index" class="table-row">
                      <td>{{ property.id }}</td>
                      <td>{{ property.price }}</td>
                      <td>{{ property.model }}</td>
                      <td>{{ property.location }}</td>
                      <td>{{ property.lot_area }}</td>
                      <td>{{ property.type }}</td>
                      <td>{{ property.status }}</td>
                      <td>{{ formatDate(property.date_listed) }}</td>
                      <td class="actions-cell">
                        <v-btn icon color="green darken-2" @click="openEditPropertyModal(property, 'project')">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="red darken-2" @click="deleteProperty(index, 'project')">
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
            <v-btn color="grey darken-1" dark style="width: 200px;" @click="openAddPropertyModal">Add</v-btn>
          </v-col>
        </v-row>

        <!-- Add/Edit Property Modal -->
        <v-dialog v-model="propertyModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h6">{{ isEditMode ? 'Edit Property' : 'Add Property' }}</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="propertyForm" v-model="formValid">
                <v-row>
                  <template v-if="modalListType === 'private'">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="modalProperty.ownership"
                        label="Ownership"
                        :rules="[rules.required, rules.ownership]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="modalProperty.owner_firstname"
                        label="Owner Firstname"
                        :rules="[rules.required, rules.ownerFirst]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="modalProperty.owner_lastname"
                        label="Owner Lastname"
                        :rules="[rules.required, rules.ownerLast]"
                        required
                      ></v-text-field>
                    </v-col>
                  </template>
                  <!-- Shared fields for both -->
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="modalProperty.price"
                      label="Price"
                      :rules="[rules.required, rules.price]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="modalProperty.model"
                      label="Model"
                      :rules="[rules.required, rules.housemodel]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="modalProperty.location"
                      label="Location"
                      :rules="[rules.required, rules.location]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="modalProperty.lot_area"
                      label="Lot Area"
                      :rules="[rules.required, rules.lotArea]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="modalProperty.type"
                      label="Type"
                      :rules="[rules.required, rules.type]"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="modalProperty.status"
                      :items="['RFO', 'NRFO', 'Available', 'Sold', 'Occupied']"
                      label="Status"
                      :rules="[rules.required]"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="modalProperty.date_listed"
                      label="Date Listed"
                      :rules="[rules.required]"
                      required
                      type="date"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closePropertyModal">Cancel</v-btn>
              <v-btn color="green darken-2" dark :disabled="!formValid" @click="saveProperty">
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
      tab: 0,
      searchQuery: '',
      properties: [],
      projects: [],
      propertyModal: false,
      isEditMode: false,
      modalProperty: {},
      modalListType: 'private',
      formValid: false,
      rules: {
        required: v => !!v || 'This field is required',
        price: v => /^\d+$/.test(v) || 'Price must be a number',
        lotArea: v => /^\d+(\.\d{1,2})?$/.test(v) || 'Decimal, up to 2 places',
        housemodel: v => !!v || 'Model is required',
        location: v => !!v || 'Location is required',
        type: v => !!v || 'Type is required',
        ownership: v => !!v || 'Ownership is required',
        ownerFirst: v => !!v || 'Owner Firstname is required',
        ownerLast: v => !!v || 'Owner Lastname is required',
      },
    };
  },
  created() {
    this.fetchProperties();
    this.fetchProjects();
  },
  computed: {
    filteredProperties() {
      if (!this.searchQuery) return this.properties;
      const q = this.searchQuery.toLowerCase();
      return this.properties.filter(
        p =>
          p.id.toLowerCase().includes(q) ||
          p.ownership.toLowerCase().includes(q) ||
          p.owner_firstname.toLowerCase().includes(q) ||
          p.owner_lastname.toLowerCase().includes(q) ||
          p.price.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.lot_area.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q) ||
          p.date_listed.toLowerCase().includes(q)
      );
    },
    filteredProjects() {
      if (!this.searchQuery) return this.projects;
      const q = this.searchQuery.toLowerCase();
      return this.projects.filter(
        p =>
          p.id.toLowerCase().includes(q) ||
          p.ownership.toLowerCase().includes(q) ||
          p.owner_firstname.toLowerCase().includes(q) ||
          p.owner_lastname.toLowerCase().includes(q) ||
          p.price.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.lot_area.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q) ||
          p.date_listed.toLowerCase().includes(q)
      );
    },
  },
  methods: {
    logout() {
      localStorage.removeItem('isAuthenticated');
      this.$router.push('/login');
    },
    openAddPropertyModal() {
  this.isEditMode = false;
  this.modalListType = this.tab === 0 ? 'private' : 'project';
  if (this.modalListType === 'private') {
    this.modalProperty = {
      ownership: '',
      owner_firstname: '',
      owner_lastname: '',
      price: '',
      model: '',
      location: '',
      lot_area: '',
      type: '',
      status: '',
      date_listed: '',
    };
  } else {
    this.modalProperty = {
      price: '',
      model: '',
      location: '',
      lot_area: '',
      type: '',
      status: '',
      date_listed: '',
    };
  }
  this.propertyModal = true;
},
    openEditPropertyModal(property, listType) {
        this.isEditMode = true;
        this.modalListType = listType;
        this.modalProperty = { ...property };
        this.propertyModal = true;
      },
    closePropertyModal() {
      this.propertyModal = false;
    },
    fetchProperties() {
      axios.get('http://localhost:3000/api/private-properties')
        .then(res => { this.properties = res.data; });
    },
    fetchProjects() {
      axios.get('http://localhost:3000/api/property-projects')
        .then(response => {
          this.projects = response.data;
        });
    },
    saveProperty() {
  this.$refs.propertyForm.validate();
  if (!this.formValid) return;
  const payload = { ...this.modalProperty };
  if (this.isEditMode) {
    // Update existing property
    const id = this.modalProperty.id;
    if (!id) return;
    const url = this.modalListType === 'private'
      ? `http://localhost:3000/api/private-properties/${id}`
      : `http://localhost:3000/api/property-projects/${id}`;
    axios.put(url, payload)
      .then(() => {
        if (this.modalListType === 'private') this.fetchProperties();
        else this.fetchProjects();
        this.propertyModal = false;
      });
  } else {
    // Add new property
    const url = this.modalListType === 'private'
      ? 'http://localhost:3000/api/private-properties'
      : 'http://localhost:3000/api/property-projects';
    axios.post(url, payload)
      .then(() => {
        if (this.modalListType === 'private') this.fetchProperties();
        else this.fetchProjects();
        this.propertyModal = false;
      });
  }
},
    deleteProperty(index, listType) {
      if (confirm('Are you sure you want to delete this property?')) {
        let id;
        if (listType === 'private') {
          id = this.filteredProperties[index]?.id;
        } else {
          id = this.filteredProjects[index]?.id;
        }
        if (!id) {
          alert('Delete failed: Property not found.');
          return;
        }
        const url = listType === 'private'
          ? `http://localhost:3000/api/private-properties/${id}`
          : `http://localhost:3000/api/property-projects/${id}`;
        axios.delete(url).then(() => {
          if (listType === 'private') this.fetchProperties();
          else this.fetchProjects();
        }).catch(err => {
          alert('Delete failed: ' + (err.response?.data?.error || err.message));
        });
      }
    },
    formatDate(dateString) {
  if (!dateString) return '';
  // If already in DD/MM/YYYY, just return
  if (dateString.includes('/')) return dateString;
  // If in YYYY-MM-DD, convert to DD/MM/YYYY
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
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