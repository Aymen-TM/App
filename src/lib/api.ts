import { Cars } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('jwt');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchCars(): Promise<Cars[]> {
  try {
    const res = await fetch(`${API_BASE}/api/voitures/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch cars');
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchBookings(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/api/bookings/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function fetchCarById(id: string | number): Promise<Cars | null> {
  try {
    const res = await fetch(`${API_BASE}/api/voitures/${id}/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
} 