import { supabase, isSupabaseConfigured } from './supabaseClient';

// ========== SUPABASE FUNCTIONS ==========

export async function saveUserDataToSupabase(trigram, data) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data: result, error } = await supabase
    .from('assessments')
    .upsert({
      trigram: trigram.toUpperCase(),
      answers: data.answers,
      current_dim: data.currentDim,
      current_sub: data.currentSub,
      completed: data.completed,
      last_update: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'trigram'
    })
    .select();

  if (error) {
    console.error('Error saving to Supabase:', error);
    throw error;
  }

  return result;
}

export async function loadUserDataFromSupabase(trigram) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('trigram', trigram.toUpperCase())
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error loading from Supabase:', error);
    throw error;
  }

  if (!data) return null;

  return {
    answers: data.answers,
    currentDim: data.current_dim,
    currentSub: data.current_sub,
    completed: data.completed,
    lastUpdate: data.last_update
  };
}

export async function getAllUsersFromSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('last_update', { ascending: false });

  if (error) {
    console.error('Error fetching users from Supabase:', error);
    throw error;
  }

  return data.map(user => ({
    trigram: user.trigram,
    answers: user.answers,
    currentDim: user.current_dim,
    currentSub: user.current_sub,
    completed: user.completed,
    lastUpdate: user.last_update
  }));
}

export async function deleteUserDataFromSupabase(trigram) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('trigram', trigram.toUpperCase());

  if (error) {
    console.error('Error deleting from Supabase:', error);
    throw error;
  }
}

// ========== LOCALSTORAGE FALLBACK FUNCTIONS ==========

const STORAGE_KEY_PREFIX = "digitalMaturity_";

function saveUserDataToLocalStorage(trigram, data) {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${trigram.toUpperCase()}`, JSON.stringify(data));
}

function loadUserDataFromLocalStorage(trigram) {
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${trigram.toUpperCase()}`);
  return data ? JSON.parse(data) : null;
}

function getAllUsersFromLocalStorage() {
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORAGE_KEY_PREFIX)) {
      const trigram = key.replace(STORAGE_KEY_PREFIX, "");
      const data = JSON.parse(localStorage.getItem(key));
      users.push({ trigram, ...data });
    }
  }
  return users.sort((a, b) => new Date(b.lastUpdate || 0) - new Date(a.lastUpdate || 0));
}

function deleteUserDataFromLocalStorage(trigram) {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${trigram.toUpperCase()}`);
}

// ========== UNIFIED API ==========

export async function saveUserData(trigram, data) {
  if (isSupabaseConfigured()) {
    try {
      return await saveUserDataToSupabase(trigram, data);
    } catch (error) {
      console.error('Supabase save failed, falling back to localStorage:', error);
      saveUserDataToLocalStorage(trigram, data);
    }
  } else {
    saveUserDataToLocalStorage(trigram, data);
  }
}

export async function loadUserData(trigram) {
  if (isSupabaseConfigured()) {
    try {
      return await loadUserDataFromSupabase(trigram);
    } catch (error) {
      console.error('Supabase load failed, falling back to localStorage:', error);
      return loadUserDataFromLocalStorage(trigram);
    }
  } else {
    return loadUserDataFromLocalStorage(trigram);
  }
}

export async function getAllUsers() {
  if (isSupabaseConfigured()) {
    try {
      return await getAllUsersFromSupabase();
    } catch (error) {
      console.error('Supabase getAllUsers failed, falling back to localStorage:', error);
      return getAllUsersFromLocalStorage();
    }
  } else {
    return getAllUsersFromLocalStorage();
  }
}

export async function deleteUserData(trigram) {
  if (isSupabaseConfigured()) {
    try {
      return await deleteUserDataFromSupabase(trigram);
    } catch (error) {
      console.error('Supabase delete failed, falling back to localStorage:', error);
      deleteUserDataFromLocalStorage(trigram);
    }
  } else {
    deleteUserDataFromLocalStorage(trigram);
  }
}
