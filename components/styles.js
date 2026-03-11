import styled from 'styled-components/native';
import { View, Image, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const StatusBarHeight = Constants.statusBarHeight;

// colors
export const Colors = {
  primary: '#ffffff',
  secondary: '#E5E7EB',
  tertiary: '#1a1a1a',
  darkLight: '#87898b',
  brand: '#6b130f',
};

const { primary, secondary, tertiary, darkLight, brand } = Colors;

/* ================= ROOT ================= */

export const ScreenContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  background-color: ${tertiary};
`;

/* ================= LEFT IMAGE ================= */

export const LeftPane = styled(View)`
  flex: 0.65;
  justify-content: center;
  align-items: center;
  display: ${width < 768 ? 'none' : 'flex'};
`;

export const HeroImage = styled(Image)`
  width: 110%;
  height: 100%;
  resize-mode: cover;
`;

/* ================= RIGHT LOGIN ================= */

export const PageLogo = styled.Image`
  width: 300px;
  height: 200px;
`;

export const RightPane = styled(View)`
  flex: 0.35;
  background-color: ${primary};
  justify-content: center;
  align-items: center;
  padding: 40px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
`;

export const LoginCard = styled(View)`
  width: 100%;
  max-width: 420px;
  background-color: ${primary};
  border-radius: 20px;
  padding: 30px;
  elevation: 5;
`;

/* ================= TEXT ================= */

export const PageTitle = styled(Text)`
  font-size: 32px;
  font-weight: 700;
  color: ${brand};
  text-align: center;
  margin-bottom: 20px;
`;

/* ================= FORM ================= */

export const StyledFormArea = styled(View)`
  width: 100%;
`;

export const StyledTextInput = styled(TextInput)`
  background-color: ${secondary};
  border-radius: 14px;
  padding: 15px;
  font-size: 14px;
  margin-bottom: 10px;
  margin-top: 13px;
  color: ${tertiary};
`;

export const RightIcon = styled(TouchableOpacity)`
  position: absolute;
  right: 16px;
  top: 27.5px;
`;

/* ================= BUTTON ================= */

export const StyledButton = styled(TouchableOpacity)`
  background-color: ${brand};
  padding: 15px;
  border-radius: 14px;
  align-items: center;
  margin-top: 15px;
`;

export const ButtonText = styled(Text)`
  color: ${primary};
  font-size: 15px;
  font-weight: 600;
`;

/* ================= Forgot Password ================= */

export const TextLink = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export const TextLinkContent = styled.Text`
  color: ${brand};
  font-size: 14px;
`;

export const FixedRight = styled.View`
  align-items: flex-end;
  justify-content: center;
`;

/* ===== Forgot Password Logo ===== */

export const ForgotLogo = styled.Image`
  width: 140px;
  height: 140px;
  resize-mode: contain;
  align-self: center;
  margin-bottom: 12px;
`;

export const ForgotLogoWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

/* ====== Forgot Password UI ====== */

export const CardIllustration = styled.Image`
  width: 220px;
  height: 140px;
  resize-mode: contain;
  align-self: center;
`;

export const CardTitle = styled(Text)`
  font-size: 32px;
  font-weight: 700;
  color: ${brand};
  text-align: center;
  margin-bottom: 20px;
`;

export const CardSubtitle = styled.Text`
  margin-top: 8px;
  font-size: 14px;
  color: ${darkLight};
  text-align: center;
  line-height: 20px;
`;

export const DividerSpace = styled.View`
  height: 14px;
`;

export const BackRow = styled.View`
  margin-top: 12px;
  align-items: center;
`;

/* ====== UI style forgot password ====== */

export const CenterContainer = styled.View`
  flex: 1;
  background-color: ${primary};
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const CenterCard = styled.View`
  width: 100%;
  max-width: 420px;
  background-color: ${primary};
  border-radius: 26px;
  padding: 34px 28px;
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.06);
  elevation: 8;
`;

export const InputLabel = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${tertiary};
  margin-bottom: 8px;
  margin-top: 8px;
`;

export const PillTextInput = styled(StyledTextInput)`
  background-color: ${primary};
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.18);
  border-radius: 999px;
  padding-left: 18px;
  padding-right: 18px;
`;

export const PillButton = styled(StyledButton)`
  border-radius: 999px;
  height: 48px;
  justify-content: center;
`;

/* ================= Errors ================= */

export const ErrorRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ErrorLeft = styled.View`
  flex: 1;
  align-items: flex-start;
`;

export const MsgBox = styled.Text`
  font-size: 13px;
  color: ${brand};
  text-align: left;
  left: 6px;
  margin-top: 0.5px;
  margin-bottom: 1px;
`;

/* ================= Admin Dashboard Layout ================= */

export const AdminShell = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${primary};
`;

export const AdminSidebar = styled.View`
  width: 250px;
  background-color: ${brand};
  padding: 18px 14px;
`;

export const SidebarContent = styled.View`
  flex: 1;
`;

export const SidebarBottomArea = styled.View`
  padding-top: 10px;
`;

export const AdminBrandButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 6px 8px 18px 8px;
`;

export const AdminBrandLogo = styled.Image`
  width: 38px;
  height: 38px;
  resize-mode: contain;
  margin-right: 10px;
`;

export const AdminBrandText = styled.Text`
  color: ${primary};
  font-size: 16px;
  font-weight: 600;
`;

export const SidebarSectionTitle = styled.Text`
  margin-top: 14px;
  margin-bottom: 8px;
  padding: 0 10px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

export const SidebarItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 12px 12px;
  border-radius: 12px;
  margin-bottom: 8px;
  border-width: 0px;
  background-color: ${(props) => (props.$active ? 'rgba(255,255,255,0.14)' : 'transparent')};
`;

export const SidebarItemText = styled.Text`
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  font-weight: 600;
  margin-left: 10px;
`;

export const AdminMain = styled.View`
  flex: 1;
  background-color: #f6f7fb;
`;

export const AdminTopbar = styled.View`
  height: 64px;
  background-color: ${primary};
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.08);
  padding: 0 18px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TopbarLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TopbarTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${tertiary};
  margin-left: 10px;
`;

export const TopbarRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const AdminContent = styled.View`
  flex: 1;
  padding: 18px;
`;

export const PlaceholderCard = styled.View`
  width: 100%;
  border-radius: 16px;
  background-color: ${primary};
  padding: 18px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.06);
  elevation: 3;
`;

export const PlaceholderTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${tertiary};
  margin-bottom: 6px;
`;

export const PlaceholderText = styled.Text`
  font-size: 13px;
  color: ${darkLight};
  line-height: 18px;
`;

export const GridRow = styled.View`
  flex-direction: row;
`;

export const GridCol = styled.View`
  flex: 1;
`;

export const SpacerH = styled.View`
  width: 18px;
`;

export const SpacerV = styled.View`
  height: 18px;
`;

/* ================= Profile (legacy) ================= */

export const ProfilePage = styled.View`
  flex: 1;
  background-color: ${primary};
`;

export const PageHeader = styled.View`
  padding: 18px 18px 6px 18px;
`;

export const PageHeading = styled.Text`
  color: ${tertiary};
  font-size: 26px;
  font-weight: 700;
`;

export const PageSubHeading = styled.Text`
  color: ${darkLight};
  font-size: 13px;
  margin-top: 6px;
`;

export const HeaderActions = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SoftButton = styled.TouchableOpacity`
  padding: 10px 14px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.05);
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.08);
  margin-left: 10px;
`;

export const SoftButtonText = styled.Text`
  color: ${tertiary};
  font-size: 13px;
  font-weight: 600;
`;

export const AccentButton = styled.TouchableOpacity`
  padding: 10px 14px;
  border-radius: 12px;
  background-color: ${brand};
  margin-left: 10px;
`;

export const AccentButtonText = styled.Text`
  color: ${primary};
  font-size: 13px;
  font-weight: 600;
`;

export const SectionCard = styled(PlaceholderCard)`
  padding: 18px;
`;

export const SectionTitle = styled.Text`
  color: ${tertiary};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

export const RowBetween = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.Text`
  color: ${darkLight};
  font-size: 13px;
  font-weight: 600;
`;

export const Value = styled.Text`
  color: ${tertiary};
  font-size: 14px;
  font-weight: 600;
`;

export const InlineInput = styled.TextInput`
  flex: 1;
  height: 42px;
  padding: 0px 14px;
  border-radius: 12px;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.12);
  background-color: ${primary};
  color: ${tertiary};
`;

export const IconPill = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.08);
  margin-left: 10px;
`;

export const AvatarWrap = styled.View`
  width: 84px;
  height: 84px;
  border-radius: 22px;
  background-color: rgba(0, 0, 0, 0.06);
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const AvatarImg = styled.Image`
  width: 84px;
  height: 84px;
  resize-mode: cover;
`;

export const SmallHint = styled.Text`
  margin-top: 8px;
  font-size: 12px;
  color: ${darkLight};
`;

/* ================= Profile Redesign — Design Tokens ================= */

export const ProfileTokens = {
  brand: '#6b130f',
  brandSub: '#8f1a15',
  ink: '#1c1917',
  inkMid: '#57534e',
  inkLight: '#a8a29e',
  surface: '#ffffff',
  ground: '#fafaf9',
  line: '#e7e5e4',
  lineAlt: '#f0efee',
};

const PT = ProfileTokens;

/* ================= Profile Redesign — Shell & Sidebar ================= */

export const ProfileShell = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${PT.surface};
`;

export const ProfileSidebar = styled.View`
  width: 220px;
  background-color: ${PT.surface};
  border-right-width: 1px;
  border-right-color: ${PT.line};
  padding: 28px 16px;
  justify-content: space-between;
`;

export const ProfileSidebarTop = styled.View`
  flex: 1;
`;

export const ProfileSidebarBottom = styled.View`
  padding-top: 12px;
`;

export const NavBrand = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 36px;
  padding: 0 4px;
`;

export const NavBrandLogo = styled.Image`
  width: 30px;
  height: 30px;
  resize-mode: contain;
  margin-right: 10px;
`;

export const NavBrandLabel = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${PT.brand};
  letter-spacing: -0.3px;
`;

export const NavSection = styled.Text`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: ${PT.inkLight};
  margin-bottom: 6px;
  margin-top: 4px;
  padding: 0 10px;
`;

export const NavItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 2px;
  background-color: ${(p) => (p.$active ? PT.lineAlt : 'transparent')};
`;

export const NavItemText = styled.Text`
  font-size: 13.5px;
  font-weight: ${(p) => (p.$active ? '700' : '500')};
  color: ${(p) => (p.$active ? PT.ink : PT.inkMid)};
  margin-left: 10px;
`;

export const NavActiveDot = styled.View`
  width: 3px;
  height: 3px;
  border-radius: 2px;
  background-color: ${PT.brand};
  margin-left: auto;
`;

export const ProfileMain = styled.View`
  flex: 1;
  background-color: ${PT.ground};
`;

/* ================= Profile Redesign — Page & Topbar ================= */

export const ProfilePageWrap = styled.View`
  flex: 1;
`;

export const ProfileTopBar = styled.View`
  height: 60px;
  background-color: ${PT.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${PT.line};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
`;

export const ProfileTopBarTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${PT.ink};
  letter-spacing: -0.1px;
`;

export const ProfileTopBarActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const GhostBtn = styled.TouchableOpacity`
  padding: 7px 14px;
  border-radius: 7px;
  border-width: 1px;
  border-color: ${PT.line};
  background-color: ${PT.surface};
`;

export const GhostBtnText = styled.Text`
  font-size: 12.5px;
  font-weight: 600;
  color: ${PT.inkMid};
`;

export const SolidBtn = styled.TouchableOpacity`
  padding: 7px 16px;
  border-radius: 7px;
  background-color: ${PT.brand};
`;

export const SolidBtnText = styled.Text`
  font-size: 12.5px;
  font-weight: 600;
  color: #fff;
`;

/* ================= Profile Redesign — Content Layout ================= */

export const ProfileContentScroll = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 28, paddingBottom: 60 },
})``;

export const ProfileTwoCol = styled.View`
  flex-direction: row;
  gap: 20px;
`;

export const ProfileColLeft = styled.View`
  width: 260px;
`;

export const ProfileColRight = styled.View`
  flex: 1;
`;

/* ================= Profile Redesign — Identity Card ================= */

export const IdentityCard = styled.View`
  background-color: ${PT.surface};
  border-radius: 14px;
  border-width: 1px;
  border-color: ${PT.line};
  padding: 24px;
  align-items: center;
  margin-bottom: 16px;
`;

export const AvatarRing = styled.View`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background-color: ${PT.brand};
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`;

export const AvatarInitials = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
`;

export const IdentityName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${PT.ink};
  text-align: center;
  letter-spacing: -0.3px;
`;

export const IdentityEmail = styled.Text`
  font-size: 12.5px;
  color: ${PT.inkLight};
  margin-top: 3px;
  text-align: center;
`;

export const IdentityDivider = styled.View`
  height: 1px;
  background-color: ${PT.line};
  width: 100%;
  margin: 16px 0;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 2px;
`;

export const MetaLabel = styled.Text`
  font-size: 11.5px;
  color: ${PT.inkLight};
  font-weight: 500;
`;

export const MetaValue = styled.Text`
  font-size: 11.5px;
  color: ${PT.inkMid};
  font-weight: 600;
  flex-shrink: 1;
  text-align: right;
  margin-left: 8px;
`;

/* ================= Profile Redesign — Form Cards ================= */

export const ProfileCard = styled.View`
  background-color: ${PT.surface};
  border-radius: 14px;
  border-width: 1px;
  border-color: ${PT.line};
  padding: 24px;
  margin-bottom: 16px;
`;

export const ProfileCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export const ProfileCardTitle = styled.Text`
  font-size: 13.5px;
  font-weight: 700;
  color: ${PT.ink};
  letter-spacing: 0.1px;
`;

export const ProfileCardSubtitle = styled.Text`
  font-size: 12px;
  color: ${PT.inkLight};
  margin-top: 1px;
`;

export const FieldRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 14px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${PT.lineAlt};
`;

export const FieldLabel = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${PT.inkLight};
  width: 110px;
  letter-spacing: 0.1px;
`;

export const FieldValue = styled.Text`
  font-size: 13.5px;
  font-weight: 500;
  color: ${PT.ink};
  flex: 1;
`;

export const FieldInput = styled.TextInput`
  flex: 1;
  height: 36px;
  padding: 0 12px;
  border-radius: 7px;
  border-width: 1px;
  border-color: ${PT.line};
  background-color: ${PT.ground};
  font-size: 13.5px;
  color: ${PT.ink};
`;

export const EditLink = styled.TouchableOpacity`
  padding: 4px 8px;
  margin-left: 10px;
`;

export const EditLinkText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${PT.brand};
`;

export const SecurityHint = styled.Text`
  font-size: 12px;
  color: ${PT.inkLight};
  line-height: 17px;
  margin-top: 6px;
`;
