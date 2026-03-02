import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// firebase
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

import Dashboard from './Dashboard';
import Gallery from './Gallery';
import ManageUsers from './ManageUser';

// styles
import {
  AdminShell,
  AdminSidebar,
  SidebarContent,
  SidebarBottomArea,
  AdminBrandButton,
  AdminBrandLogo,
  AdminBrandText,
  SidebarSectionTitle,
  SidebarItem,
  SidebarItemText,
  AdminMain,
  AdminTopbar,
  TopbarLeft,
  TopbarTitle,
  AdminContent,
  PlaceholderCard,
  PlaceholderTitle,
  PlaceholderText,
  Colors,
} from '../components/styles';

const { primary } = Colors;

const STORAGE_KEY = 'amuser_admin_activeKey';

export default function Homescreen() {
  const navigation = useNavigation();

  // ✅ CHANGED: load activeKey from localStorage (web only)
  const [activeKey, setActiveKey] = useState(() => {
    if (Platform.OS !== 'web') return 'dashboard';
    try {
      return localStorage.getItem(STORAGE_KEY) || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  // ✅ ADDED: persist activeKey on change (web only)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      localStorage.setItem(STORAGE_KEY, activeKey);
    } catch {}
  }, [activeKey]);

  const handleLogout = async () => {
    // ✅ OPTIONAL: clear saved tab on logout
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
    await signOut(auth);
  };

  const goHome = () => {
    setActiveKey('dashboard');
    navigation.navigate('Home');
  };

  return (
    <AdminShell>
      {/* SIDEBAR */}
      <AdminSidebar>
        <SidebarContent>
          {/* Brand button -> Home */}
          <AdminBrandButton onPress={goHome}>
            <AdminBrandLogo source={require('../assets/image copy.png')} />
            <AdminBrandText>AmuseR</AdminBrandText>
          </AdminBrandButton>

          <SidebarSectionTitle>ADMIN</SidebarSectionTitle>

          <SidebarItem $active={activeKey === 'users'} onPress={() => setActiveKey('users')}>
            <Ionicons name="people-outline" size={18} color={primary} />
            <SidebarItemText>Manage Users</SidebarItemText>
          </SidebarItem>

          <SidebarItem $active={activeKey === 'gallery'} onPress={() => setActiveKey('gallery')}>
            <Ionicons name="create-outline" size={18} color={primary} />
            <SidebarItemText>Edit Gallery Contents</SidebarItemText>
          </SidebarItem>

          <SidebarItem $active={activeKey === 'fossil'} onPress={() => setActiveKey('fossil')}>
            <Ionicons name="paw-outline" size={18} color={primary} />
            <SidebarItemText>Edit Fossil Information</SidebarItemText>
          </SidebarItem>

          <SidebarSectionTitle>ACCOUNT</SidebarSectionTitle>

          <SidebarItem
            $active={activeKey === 'profile'}
            onPress={() => {
              setActiveKey('profile');
              navigation.navigate('UserProfile');
            }}
          >
            <Ionicons name="person-circle-outline" size={18} color={primary} />
            <SidebarItemText>Profile</SidebarItemText>
          </SidebarItem>
        </SidebarContent>

        {/* Bottom logout */}
        <SidebarBottomArea>
          <SidebarItem $active={false} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color={primary} />
            <SidebarItemText>Logout</SidebarItemText>
          </SidebarItem>
        </SidebarBottomArea>
      </AdminSidebar>

      {/* MAIN */}
      <AdminMain style={{ backgroundColor: '#f6f7fb' }}>
        <AdminTopbar>
          <TopbarLeft>
            <TopbarTitle>Dashboard</TopbarTitle>
          </TopbarLeft>
        </AdminTopbar>

        <AdminContent>
          {activeKey === 'dashboard' ? <Dashboard /> : null}
          {activeKey === 'users' ? <ManageUsers /> : null}
          {activeKey === 'gallery' ? <Gallery /> : null}

          {activeKey === 'fossil' ? (
            <PlaceholderCard>
              <PlaceholderTitle>Edit Fossil Information</PlaceholderTitle>
              <PlaceholderText>Placeholder</PlaceholderText>
            </PlaceholderCard>
          ) : null}
        </AdminContent>
      </AdminMain>
    </AdminShell>
  );
}