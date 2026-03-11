import React, { useEffect, useState } from 'react';
import { Platform, View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

import Dashboard from './Dashboard';
import Gallery from './Gallery';
import ManageUsers from './ManageUser';
import { UserProfileContent } from './UserProfile';

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

  const [activeKey, setActiveKey] = useState('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const pageTitles = {
    dashboard: 'Dashboard',
    users: 'Manage Users',
    gallery: 'Edit Gallery Contents',
    fossil: 'Edit Fossil Information',
    profile: 'Profile',
  };

  return (
    <View style={{ flex: 1 }}>

      {/* ===== MAIN LAYOUT ===== */}
      <AdminShell>

        {/* SIDEBAR */}
        <AdminSidebar>
          <SidebarContent>

            <AdminBrandButton onPress={() => { setActiveKey('dashboard'); setProfileOpen(false); }}>
              <AdminBrandLogo source={require('../assets/image copy.png')} />
              <AdminBrandText>AmuseR</AdminBrandText>
            </AdminBrandButton>

            <SidebarSectionTitle>ADMIN</SidebarSectionTitle>

            <SidebarItem $active={activeKey === 'dashboard'} onPress={() => { setActiveKey('dashboard'); setProfileOpen(false); }}>
              <Ionicons name="analytics-outline" size={18} color={primary} />
              <SidebarItemText>Dashboard</SidebarItemText>
            </SidebarItem>

            <SidebarItem $active={activeKey === 'users'} onPress={() => { setActiveKey('users'); setProfileOpen(false); }}>
              <Ionicons name="people-outline" size={18} color={primary} />
              <SidebarItemText>Manage Users</SidebarItemText>
            </SidebarItem>

            <SidebarItem $active={activeKey === 'gallery'} onPress={() => { setActiveKey('gallery'); setProfileOpen(false); }}>
              <Ionicons name="create-outline" size={18} color={primary} />
              <SidebarItemText>Edit Gallery Contents</SidebarItemText>
            </SidebarItem>

            <SidebarItem $active={activeKey === 'fossil'} onPress={() => { setActiveKey('fossil'); setProfileOpen(false); }}>
              <Ionicons name="paw-outline" size={18} color={primary} />
              <SidebarItemText>Edit Fossil Information</SidebarItemText>
            </SidebarItem>

            <SidebarSectionTitle>ACCOUNT</SidebarSectionTitle>

            {/* OPEN MODAL */}
            <SidebarItem $active={profileOpen} onPress={() => setProfileOpen(true)}>
              <Ionicons name="person-circle-outline" size={18} color={primary} />
              <SidebarItemText>Profile</SidebarItemText>
            </SidebarItem>

          </SidebarContent>

          <SidebarBottomArea>
            <SidebarItem $active={false} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color={primary} />
              <SidebarItemText>Logout</SidebarItemText>
            </SidebarItem>
          </SidebarBottomArea>
        </AdminSidebar>

        {/* MAIN CONTENT */}
        <AdminMain>
          <AdminTopbar>
            <TopbarLeft>
              <TopbarTitle>{pageTitles[activeKey]}</TopbarTitle>
            </TopbarLeft>
          </AdminTopbar>

          <AdminContent>
            {activeKey === 'dashboard' && <Dashboard />}
            {activeKey === 'users' && <ManageUsers />}
            {activeKey === 'gallery' && <Gallery />}

            {activeKey === 'fossil' && (
              <PlaceholderCard>
                <PlaceholderTitle>Edit Fossil Information</PlaceholderTitle>
                <PlaceholderText>Placeholder</PlaceholderText>
              </PlaceholderCard>
            )}
          </AdminContent>
        </AdminMain>

      </AdminShell>

      {/* ===== TRUE GLOBAL OVERLAY ===== */}
      {profileOpen && (
        <View
          style={[
            styles.overlay,
            Platform.OS === 'web' && { position: 'fixed' }
          ]}
        >
          <Pressable style={styles.backdrop} onPress={() => setProfileOpen(false)} />

          <View style={styles.modal}>
            <UserProfileContent />
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    elevation: 999999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modal: {
    position: 'absolute',
    top: 70,
    left: 280,
    right: 40,
    bottom: 40,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
});