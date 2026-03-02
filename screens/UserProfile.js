import React, { useEffect, useMemo, useState } from "react";
import { View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// firebase
import {
  updateProfile,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

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
  AdminContent,
  Colors,
  ProfilePage,
  PageHeader,
  PageHeading,
  HeaderActions,
  SoftButton,
  SoftButtonText,
  AccentButton,
  AccentButtonText,
  GridRow,
  GridCol,
  SpacerH,
  SpacerV,
  SectionCard,
  SectionTitle,
  RowBetween,
  Label,
  Value,
  InlineInput,
  IconPill,
  AvatarWrap,
  SmallHint,
} from "../components/styles";

const { primary, tertiary, darkLight } = Colors;

export default function UserProfile() {
  const navigation = useNavigation();

  const [user, setUser] = useState(auth.currentUser);

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPass, setEditPass] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    setDisplayName(user?.displayName || "");
    setEmail(user?.email || "");
  }, [user]);

  const isEditing = useMemo(() => editName || editEmail || editPass, [
    editName,
    editEmail,
    editPass,
  ]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const cancelEdits = () => {
    setEditName(false);
    setEditEmail(false);
    setEditPass(false);

    setDisplayName(user?.displayName || "");
    setEmail(user?.email || "");
    setNewPassword("");
  };

  const saveChanges = async () => {
    if (!user) return;

    try {
      // Name
      if (editName) {
        await updateProfile(user, {
          displayName: displayName || "",
        });
      }

      // Email (often requires recent login)
      if (editEmail && email && email !== user.email) {
        await updateEmail(user, email);
      }

      // Password (requires recent login)
      if (editPass && newPassword) {
        await updatePassword(user, newPassword);
      }

      Alert.alert("Saved", "Your profile has been updated.");
      cancelEdits();
    } catch (err) {
      Alert.alert("Update failed", err?.message || "Please try again.");
    }
  };

  return (
    <AdminShell>
      {/* SIDEBAR */}
      <AdminSidebar>
        <SidebarContent>
          <AdminBrandButton onPress={() => navigation.navigate("Home")}>
            <AdminBrandLogo source={require("../assets/image copy.png")} />
            <AdminBrandText>AmuseR</AdminBrandText>
          </AdminBrandButton>

          <SidebarSectionTitle>ADMIN</SidebarSectionTitle>

          <SidebarItem $active={false} onPress={() => navigation.navigate("Home")}>
            <Ionicons name="speedometer-outline" size={18} color={primary} />
            <SidebarItemText>Dashboard</SidebarItemText>
          </SidebarItem>

          <SidebarItem $active={true} onPress={() => {}}>
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
      <AdminMain style={{ backgroundColor: primary }}>
        <ProfilePage style={{ backgroundColor: primary }}>
          <PageHeader>
            <GridRow style={{ alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <PageHeading>Personal area</PageHeading>
              </View>

              {/* Save ONLY when editing */}
              <HeaderActions>
                {isEditing ? (
                  <>
                    <SoftButton onPress={cancelEdits}>
                      <SoftButtonText>Cancel</SoftButtonText>
                    </SoftButton>

                    <AccentButton onPress={saveChanges}>
                      <AccentButtonText>Save</AccentButtonText>
                    </AccentButton>
                  </>
                ) : null}
              </HeaderActions>
            </GridRow>
          </PageHeader>

          <AdminContent>
            <GridRow>
              {/* Profile card */}
              <GridCol>
                <SectionCard>
                  <SectionTitle>Profile</SectionTitle>

                  <GridRow style={{ alignItems: "center" }}>
                    <AvatarWrap>
                      <Ionicons name="person" size={34} color={darkLight} />
                    </AvatarWrap>

                    <SpacerH />

                    <GridCol>
                      {/* Name */}
                      <RowBetween>
                        <Label>Name</Label>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          {!editName ? (
                            <Value>{displayName || "-"}</Value>
                          ) : (
                            <InlineInput
                              value={displayName}
                              onChangeText={setDisplayName}
                              placeholder="Enter display name"
                              placeholderTextColor={darkLight}
                            />
                          )}

                          <IconPill onPress={() => setEditName((v) => !v)}>
                            <Ionicons
                              name={editName ? "close" : "pencil"}
                              size={16}
                              color={tertiary}
                            />
                          </IconPill>
                        </View>
                      </RowBetween>

                      <SpacerV />
                    </GridCol>
                  </GridRow>
                </SectionCard>
              </GridCol>

              <SpacerH />

              {/* Contact info card */}
              <GridCol>
                <SectionCard>
                  <SectionTitle>Contact information</SectionTitle>

                  {/* Email */}
                  <RowBetween>
                    <Label>E-mail</Label>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {!editEmail ? (
                        <Value>{email || "-"}</Value>
                      ) : (
                        <InlineInput
                          value={email}
                          onChangeText={setEmail}
                          placeholder="name@email.com"
                          placeholderTextColor={darkLight}
                          autoCapitalize="none"
                          keyboardType="email-address"
                        />
                      )}

                      <IconPill onPress={() => setEditEmail((v) => !v)}>
                        <Ionicons
                          name={editEmail ? "close" : "pencil"}
                          size={16}
                          color={tertiary}
                        />
                      </IconPill>
                    </View>
                  </RowBetween>

                  <SpacerV />

                  {/* Password */}
                  <RowBetween>
                    <Label>Password</Label>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {!editPass ? (
                        <Value>••••••••</Value>
                      ) : (
                        <InlineInput
                          value={newPassword}
                          onChangeText={setNewPassword}
                          placeholder="New password"
                          placeholderTextColor={darkLight}
                          secureTextEntry
                        />
                      )}

                      <IconPill onPress={() => setEditPass((v) => !v)}>
                        <Ionicons
                          name={editPass ? "close" : "pencil"}
                          size={16}
                          color={tertiary}
                        />
                      </IconPill>
                    </View>
                  </RowBetween>
                </SectionCard>
              </GridCol>
            </GridRow>

          </AdminContent>
        </ProfilePage>
      </AdminMain>
    </AdminShell>
  );
}
