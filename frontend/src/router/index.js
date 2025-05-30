import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import AppDashboard from '../components/Dashboard.vue'
import ClientRecords from '@/components/ClientRecords.vue';
import ClientDetails from '@/components/ClientDetails.vue';
import SalesTracking from '@/components/SalesTracking.vue';
import AgentRecords from '@/components/AgentRecords.vue';
import AgentDetails from '@/components/AgentDetails.vue'; 
import PropertyListing from '@/components/PropertyListing.vue'; 
import CommissionManagement from '@/components/CommissionManagement.vue'; 

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'AppDashboard',
    component: AppDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'ClientRecords',
    component: ClientRecords,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id',
    name: 'ClientDetails',
    component: ClientDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/sales-tracking',
    name: 'SalesTracking',
    component: SalesTracking,
    meta: { requiresAuth: true }
  },
  {
    path: '/agents',
    name: 'AgentRecords',
    component: AgentRecords,
    meta: { requiresAuth: true }
  },
  {
    path: '/agents/:id', // <-- Add this route
    name: 'AgentDetails',
    component: AgentDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/property-listing',
    name: 'PropertyListing',
    component: PropertyListing,
    meta: { requiresAuth: true }
  },
  {
    path: '/commission-management',
    name: 'CommissionManagement',
    component: CommissionManagement,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router