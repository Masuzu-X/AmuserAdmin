import React, { useEffect, useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// firebase
import { updateProfile, updateEmail, updatePassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

// styles
import {
  ProfileTokens as PT,
  ProfileShell,
  ProfileSidebar,
  ProfileSidebarTop,
  ProfileSidebarBottom,
  NavBrand,
  NavBrandLogo,
  NavBrandLabel,
  NavSection,
  NavItem,
  NavItemText,
  NavActiveDot,
  ProfileMain,
  ProfilePageWrap,
  ProfileTopBar,
  ProfileTopBarTitle,
  ProfileTopBarActions,
  GhostBtn,
  GhostBtnText,
  SolidBtn,
  SolidBtnText,
  ProfileContentScroll,
  ProfileTwoCol,
  ProfileColLeft,
  ProfileColRight,
  IdentityCard,
  AvatarRing,
  AvatarInitials,
  IdentityName,
  IdentityEmail,
  IdentityDivider,
  MetaRow,
  MetaLabel,
  MetaValue,
  ProfileCard,
  ProfileCardHeader,
  ProfileCardTitle,
  ProfileCardSubtitle,
  FieldRow,
  FieldLabel,
  FieldValue,
  FieldInput,
  EditLink,
  EditLinkText,
  SecurityHint,
} from '../components/styles';

// ─── UserProfileContent ───────────────────────────────────────────────────────

export function UserProfileContent() {
  const [user, setUser] = useState(auth.currentUser);

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPass, setEditPass] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    setDisplayName(user?.displayName || '');
    setEmail(user?.email || '');
  }, [user]);

  const isEditing = useMemo(() => editName || editEmail || editPass, [editName, editEmail, editPass]);

  const initials = useMemo(() => {
    const name = user?.displayName?.trim();
    if (!name) return 'AD';
    return name
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  }, [user?.displayName]);

  const userSince = useMemo(() => {
    if (!user?.metadata?.creationTime) return '—';
    return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [user?.metadata?.creationTime]);

  const lastSignIn = useMemo(() => {
    if (!user?.metadata?.lastSignInTime) return '—';
    return new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [user?.metadata?.lastSignInTime]);

  const cancelEdits = () => {
    setEditName(false);
    setEditEmail(false);
    setEditPass(false);
    setDisplayName(user?.displayName || '');
    setEmail(user?.email || '');
    setNewPassword('');
  };

  const saveChanges = async () => {
    if (!user) return;
    try {
      if (editName) await updateProfile(user, { displayName: displayName || '' });
      if (editEmail && email && email !== user.email) await updateEmail(user, email);
      if (editPass && newPassword) await updatePassword(user, newPassword);
      Alert.alert('Saved', 'Your profile has been updated.');
      cancelEdits();
    } catch (err) {
      Alert.alert('Update failed', err?.message || 'Please try again.');
    }
  };

  return (
    <ProfilePageWrap>
      <ProfileTopBar>
        <ProfileTopBarTitle>Profile Settings</ProfileTopBarTitle>
        {isEditing && (
          <ProfileTopBarActions>
            <GhostBtn onPress={cancelEdits}>
              <GhostBtnText>Discard</GhostBtnText>
            </GhostBtn>
            <SolidBtn onPress={saveChanges}>
              <SolidBtnText>Save changes</SolidBtnText>
            </SolidBtn>
          </ProfileTopBarActions>
        )}
      </ProfileTopBar>

      <ProfileContentScroll>
        <ProfileTwoCol>
          {/* Left — identity */}
          <ProfileColLeft>
            <IdentityCard>
              <AvatarRing>
                <AvatarInitials>{initials}</AvatarInitials>
              </AvatarRing>
              <IdentityName>{user?.displayName || 'Admin User'}</IdentityName>
              <IdentityEmail>{user?.email || '—'}</IdentityEmail>

              <IdentityDivider />

              <MetaRow>
                <MetaLabel>Member since</MetaLabel>
                <MetaValue>{userSince}</MetaValue>
              </MetaRow>
              <View style={{ height: 8 }} />
              <MetaRow>
                <MetaLabel>Last login</MetaLabel>
                <MetaValue numberOfLines={1}>{lastSignIn}</MetaValue>
              </MetaRow>
            </IdentityCard>
          </ProfileColLeft>

          {/* Right — forms */}
          <ProfileColRight>
            {/* Personal information */}
            <ProfileCard>
              <ProfileCardHeader>
                <View>
                  <ProfileCardTitle>Personal information</ProfileCardTitle>
                  <ProfileCardSubtitle>Update your name and email address.</ProfileCardSubtitle>
                </View>
              </ProfileCardHeader>

              <FieldRow>
                <FieldLabel>Display name</FieldLabel>
                {editName ? (
                  <FieldInput value={displayName} onChangeText={setDisplayName} placeholder="Your name" autoFocus />
                ) : (
                  <FieldValue>{user?.displayName || '—'}</FieldValue>
                )}
                {!editName && (
                  <EditLink
                    onPress={() => {
                      setEditName(true);
                      setEditEmail(false);
                      setEditPass(false);
                    }}
                  >
                    <EditLinkText>Edit</EditLinkText>
                  </EditLink>
                )}
              </FieldRow>

              <FieldRow style={{ borderBottomWidth: 0 }}>
                <FieldLabel>Email</FieldLabel>
                {editEmail ? (
                  <FieldInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your@email.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoFocus
                  />
                ) : (
                  <FieldValue>{user?.email || '—'}</FieldValue>
                )}
                {!editEmail && (
                  <EditLink
                    onPress={() => {
                      setEditEmail(true);
                      setEditName(false);
                      setEditPass(false);
                    }}
                  >
                    <EditLinkText>Edit</EditLinkText>
                  </EditLink>
                )}
              </FieldRow>
            </ProfileCard>

            {/* Security */}
            <ProfileCard>
              <ProfileCardHeader>
                <View>
                  <ProfileCardTitle>Security</ProfileCardTitle>
                  <ProfileCardSubtitle>Manage your password and sign-in method.</ProfileCardSubtitle>
                </View>
              </ProfileCardHeader>

              <FieldRow style={{ borderBottomWidth: 0 }}>
                <FieldLabel>Password</FieldLabel>
                {editPass ? (
                  <FieldInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New password"
                    secureTextEntry
                    autoFocus
                  />
                ) : (
                  <FieldValue style={{ letterSpacing: 2, fontSize: 10 }}>{'● ● ● ● ● ● ● ●'}</FieldValue>
                )}
                {!editPass && (
                  <EditLink
                    onPress={() => {
                      setEditPass(true);
                      setEditName(false);
                      setEditEmail(false);
                    }}
                  >
                    <EditLinkText>Change</EditLinkText>
                  </EditLink>
                )}
              </FieldRow>

              {!editPass && (
                <SecurityHint>
                  Use a strong, unique password. We recommend at least 12 characters with a mix of letters and numbers.
                </SecurityHint>
              )}
            </ProfileCard>
          </ProfileColRight>
        </ProfileTwoCol>
      </ProfileContentScroll>
    </ProfilePageWrap>
  );
}

// ─── UserProfile (shell + sidebar) ───────────────────────────────────────────

export default function UserProfile() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ProfileShell>
      <ProfileSidebar>
        <ProfileSidebarTop>
          <NavBrand onPress={() => navigation.navigate('Home')}>
            <NavBrandLogo source={require('../assets/image copy.png')} />
            <NavBrandLabel>AmuseR</NavBrandLabel>
          </NavBrand>

          <NavSection>ADMIN</NavSection>

          <NavItem $active={false} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="speedometer-outline" size={16} color={PT.inkMid} />
            <NavItemText $active={false}>Dashboard</NavItemText>
          </NavItem>

          <NavItem $active={true} onPress={() => {}}>
            <Ionicons name="person-outline" size={16} color={PT.ink} />
            <NavItemText $active={true}>Profile</NavItemText>
            <NavActiveDot />
          </NavItem>
        </ProfileSidebarTop>

        <ProfileSidebarBottom>
          <NavItem $active={false} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={16} color={PT.inkMid} />
            <NavItemText $active={false}>Sign out</NavItemText>
          </NavItem>
        </ProfileSidebarBottom>
      </ProfileSidebar>

      <ProfileMain>
        <UserProfileContent />
      </ProfileMain>
    </ProfileShell>
  );
}
