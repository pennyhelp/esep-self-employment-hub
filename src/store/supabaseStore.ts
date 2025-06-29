
import { create } from 'zustand';
import { supabase } from '../integrations/supabase/client';
import { Category, Panchayath, Registration, Admin } from '../types';

interface SupabaseStore {
  categories: Category[];
  panchayaths: Panchayath[];
  registrations: Registration[];
  admins: Admin[];
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    is_active: boolean;
    created_at: string;
  }>;
  currentAdmin: Admin | null;
  loading: boolean;
  
  // Actions
  fetchCategories: () => Promise<void>;
  fetchPanchayaths: () => Promise<void>;
  fetchRegistrations: () => Promise<void>;
  fetchAdmins: () => Promise<void>;
  fetchAnnouncements: () => Promise<void>;
  addRegistration: (registration: Omit<Registration, 'id' | 'customerId'>) => Promise<string>;
  updateRegistration: (id: string, updates: Partial<Registration>) => Promise<void>;
  addPanchayath: (panchayath: Omit<Panchayath, 'id'>) => Promise<void>;
  updatePanchayath: (id: string, updates: Partial<Panchayath>) => Promise<void>;
  deletePanchayath: (id: string) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  updateAdmin: (id: string, updates: Partial<Admin>) => Promise<void>;
  setCurrentAdmin: (admin: Admin | null) => void;
  generateCustomerId: (mobile: string, name: string) => string;
  getRegistrationByMobile: (mobile: string) => Registration | undefined;
  setupRealtimeSubscriptions: () => void;
}

export const useSupabaseStore = create<SupabaseStore>((set, get) => ({
  categories: [],
  panchayaths: [],
  registrations: [],
  admins: [],
  announcements: [],
  currentAdmin: null,
  loading: false,

  fetchCategories: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      const categories = data?.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        actualFee: item.actual_fee,
        offerFee: item.offer_fee,
        image: item.image_url,
        isActive: item.is_active
      })) || [];
      
      set({ categories, loading: false });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ loading: false });
    }
  },

  fetchPanchayaths: async () => {
    try {
      const { data, error } = await supabase
        .from('panchayaths')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching panchayaths:', error);
        return;
      }
      
      const panchayaths = data?.map(item => ({
        id: item.id,
        name: item.name,
        district: item.district,
        isActive: item.is_active
      })) || [];
      
      set({ panchayaths });
    } catch (error) {
      console.error('Error fetching panchayaths:', error);
    }
  },

  fetchRegistrations: async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*');
      
      if (error) {
        console.error('Error fetching registrations:', error);
        return;
      }
      
      const registrations = data?.map(item => ({
        id: item.id,
        customerId: item.customer_id,
        categoryId: item.category_id,
        categoryName: item.category_name,
        name: item.name,
        address: item.address,
        mobileNumber: item.mobile_number,
        panchayathId: item.panchayath_id,
        panchayathName: item.panchayath_name,
        ward: item.ward,
        agentPro: item.agent_pro,
        status: item.status as 'pending' | 'approved' | 'rejected',
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) || [];
      
      set({ registrations });
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  },

  fetchAdmins: async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*');
      
      if (error) {
        console.error('Error fetching admins:', error);
        return;
      }
      
      const admins = data?.map(item => ({
        id: item.id,
        username: item.username,
        password: item.password,
        role: item.role as 'super' | 'local' | 'user',
        isActive: item.is_active
      })) || [];
      
      set({ admins });
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  },

  fetchAnnouncements: async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }
      
      set({ announcements: data || [] });
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  },

  addRegistration: async (registration) => {
    const customerId = get().generateCustomerId(registration.mobileNumber, registration.name);
    
    try {
      const { error } = await supabase
        .from('registrations')
        .insert({
          customer_id: customerId,
          category_id: registration.categoryId,
          category_name: registration.categoryName,
          name: registration.name,
          address: registration.address,
          mobile_number: registration.mobileNumber,
          panchayath_id: registration.panchayathId,
          panchayath_name: registration.panchayathName,
          ward: registration.ward,
          agent_pro: registration.agentPro,
          status: registration.status
        });
      
      if (error) {
        console.error('Error adding registration:', error);
        throw error;
      }
      
      await get().fetchRegistrations();
      return customerId;
    } catch (error) {
      console.error('Error adding registration:', error);
      throw error;
    }
  },

  updateRegistration: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating registration:', error);
        throw error;
      }
      await get().fetchRegistrations();
    } catch (error) {
      console.error('Error updating registration:', error);
      throw error;
    }
  },

  addPanchayath: async (panchayath) => {
    try {
      const { error } = await supabase
        .from('panchayaths')
        .insert({
          name: panchayath.name,
          district: panchayath.district,
          is_active: true
        });
      
      if (error) {
        console.error('Error adding panchayath:', error);
        throw error;
      }
      await get().fetchPanchayaths();
    } catch (error) {
      console.error('Error adding panchayath:', error);
      throw error;
    }
  },

  updatePanchayath: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('panchayaths')
        .update({
          name: updates.name,
          district: updates.district,
          is_active: updates.isActive
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating panchayath:', error);
        throw error;
      }
      await get().fetchPanchayaths();
    } catch (error) {
      console.error('Error updating panchayath:', error);
      throw error;
    }
  },

  deletePanchayath: async (id) => {
    try {
      const { error } = await supabase
        .from('panchayaths')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting panchayath:', error);
        throw error;
      }
      await get().fetchPanchayaths();
    } catch (error) {
      console.error('Error deleting panchayath:', error);
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: updates.name,
          description: updates.description,
          actual_fee: updates.actualFee,
          offer_fee: updates.offerFee,
          image_url: updates.image,
          is_active: updates.isActive
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }
      await get().fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  updateAdmin: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('admins')
        .update({
          is_active: updates.isActive
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating admin:', error);
        throw error;
      }
      await get().fetchAdmins();
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  setCurrentAdmin: (admin) => set({ currentAdmin: admin }),

  generateCustomerId: (mobile: string, name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    return `ESEP${mobile}${firstLetter}`;
  },

  getRegistrationByMobile: (mobile: string) => {
    return get().registrations.find(reg => reg.mobileNumber === mobile);
  },

  setupRealtimeSubscriptions: () => {
    try {
      // Subscribe to categories changes
      supabase
        .channel('categories')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
          get().fetchCategories();
        })
        .subscribe();

      // Subscribe to registrations changes
      supabase
        .channel('registrations')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => {
          get().fetchRegistrations();
        })
        .subscribe();

      // Subscribe to panchayaths changes
      supabase
        .channel('panchayaths')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'panchayaths' }, () => {
          get().fetchPanchayaths();
        })
        .subscribe();

      // Subscribe to announcements changes
      supabase
        .channel('announcements')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
          get().fetchAnnouncements();
        })
        .subscribe();

      console.log('Realtime subscriptions setup complete');
    } catch (error) {
      console.error('Error setting up realtime subscriptions:', error);
    }
  }
}));
