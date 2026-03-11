import styled from 'styled-components/native';

/* ─── Color tokens ─── */
export const C = {
  bg: '#f8f9fa',
  surface: '#ffffff',
  border: '#e8eaed',
  borderFocus: '#6b130f',
  text: '#202124',
  textSec: '#5f6368',
  textTertiary: '#9aa0a6',
  brand: '#6b130f',
  brandLight: 'rgba(107,19,15,0.08)',
  brandMid: 'rgba(107,19,15,0.15)',
  green: '#137333',
  greenLight: '#e6f4ea',
  red: '#c5221f',
  redLight: '#fce8e6',
};

/* ─── Styled Components ─── */

export const Shell = styled.View`
  flex: 1;
  background-color: ${C.bg};
`;

export const TopBarTitle = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: ${C.text};
`;

export const Scroller = styled.ScrollView`
  flex: 1;
`;

export const Section = styled.View`
  padding: 0px 20px 0 20px;
  flex: 1;
`;

export const SectionLabel = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: ${C.textSec};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

export const CardsRow = styled.View`
  flex-direction: row;
  gap: 12px;
  flex: 1;
`;

/* ─── Gallery Card ─── */

export const Card = styled.View`
  flex: 1;
  background-color: ${C.surface};
  border-radius: 10px;
  border-width: 1px;
  border-color: ${C.border};
  overflow: hidden;
`;

export const CardContent = styled.View`
  flex: 1;
`;

export const CardTopStripe = styled.View`
  height: 4px;
  background-color: ${C.brand};
`;

export const CardBody = styled.View`
  padding: 16px;
  flex: 1;
`;

export const CardHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const CardTitleLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${C.text};
`;

export const StatusBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  background-color: ${(p) => (p.$saved ? C.greenLight : C.brandLight)};
`;

export const StatusText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: ${(p) => (p.$saved ? C.green : C.brand)};
`;

export const FieldLabel = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${C.textSec};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
  margin-top: 10px;
`;

export const StyledInput = styled.TextInput`
  background-color: ${C.bg};
  border-width: 1px;
  border-color: ${(p) => (p.$focused ? C.borderFocus : C.border)};
  border-radius: 6px;
  padding: 9px 12px;
  font-size: 13px;
  color: ${C.text};
`;

export const DescInput = styled(StyledInput)`
  flex: 1;
  min-height: 72px;
  text-align-vertical: top;
`;

export const CardFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top-width: 1px;
  border-top-color: ${C.border};
  background-color: ${C.bg};
`;

export const FooterHint = styled.Text`
  font-size: 11px;
  color: ${C.textTertiary};
`;

export const SaveBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  background-color: ${(p) => (p.$loading ? C.textTertiary : C.brand)};
  padding: 8px 16px;
  border-radius: 6px;
`;

export const SaveBtnText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
`;

export const ResetBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 6px;
  border-width: 1px;
  border-color: ${C.border};
`;

export const ResetBtnText = styled.Text`
  font-size: 12px;
  color: ${C.textSec};
`;

export const ToastWrap = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: ${(p) => (p.$error ? C.redLight : C.greenLight)};
  border-radius: 6px;
  padding: 8px 12px;
  margin: 10px 20px 0 20px;
`;

export const ToastText = styled.Text`
  font-size: 12px;
  color: ${(p) => (p.$error ? C.red : C.green)};
  font-weight: 500;
`;

/* ─── Divider ─── */
export const Divider = styled.View`
  height: 1px;
  background-color: ${C.border};
  margin: 10px 0;
`;

/* ─── Firestore field info strip ─── */
export const FirestoreStrip = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: rgba(26, 115, 232, 0.05);
  border-top-width: 1px;
  border-top-color: rgba(26, 115, 232, 0.12);
`;

export const FirestoreStripText = styled.Text`
  font-size: 10px;
  color: #1a73e8;
`;

/* ─── Inline style components (converted to styled components) ─── */

export const IconContainer = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background-color: ${C.brandLight};
  align-items: center;
  justify-content: center;
`;

export const LoadingContainer = styled.View`
  align-items: center;
  padding: 24px;
`;

export const LoadingText = styled.Text`
  margin-top: 8px;
  font-size: 12px;
  color: ${C.textSec};
`;

export const InfoStrip = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${C.brandLight};
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 14px;
  border-width: 1px;
  border-color: ${C.brandMid};
`;

export const InfoStripText = styled.Text`
  font-size: 12px;
  color: ${C.brand};
  flex: 1;
`;

export const BoldText = styled.Text`
  font-weight: 700;
`;

export const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background-color: ${C.redLight};
  padding: 10px;
  border-top-width: 1px;
  border-top-color: rgba(197, 34, 31, 0.15);
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: ${C.red};
`;

export const Spacer = styled.View`
  height: 28px;
`;
