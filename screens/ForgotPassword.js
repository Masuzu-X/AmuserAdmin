import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getFirebaseErrorMessage } from "../utilities/firebaseErrors";

import {
  CenterContainer,
  CenterCard,
  StyledFormArea,
  Colors,
  MsgBox,
  TextLink,
  TextLinkContent,
  CardIllustration,
  CardTitle,
  CardSubtitle,
  PillTextInput,
  PillButton,
  ButtonText,
  BackRow,
  ForgotLogo,
  ForgotLogoWrapper
} from "../components/styles";

const { darkLight } = Colors;

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSend = async () => {
    setFormError("");
    setSuccessMsg("");

    try {
      const trimmed = email.trim();
      if (!trimmed) {
        setFormError("Please enter your email.");
        return;
      }

      await sendPasswordResetEmail(auth, trimmed);
      setSuccessMsg("Password reset link sent. Please check your email.");
    } catch (error) {
      setFormError(getFirebaseErrorMessage(error));
    }
  };

  return (
    <CenterContainer>
      <CenterCard>
        {/* IMAGE PLACEHOLDER (replace later with local asset) */}
        <ForgotLogoWrapper>
          <ForgotLogo source={require("../assets/forgot.png")} />
        </ForgotLogoWrapper>


        <CardTitle>Forgot your password?</CardTitle>
        <CardSubtitle>
          Enter your email so that we can send you a password reset link
        </CardSubtitle>

        <StyledFormArea>
          <PillTextInput
            placeholder="e.g. username@amuser.com"
            placeholderTextColor={darkLight}
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setFormError("");
              setSuccessMsg("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {formError ? <MsgBox>{formError}</MsgBox> : null}
          {successMsg ? <MsgBox style={{ color: "green" }}>{successMsg}</MsgBox> : null}

          <PillButton onPress={handleSend}>
            <ButtonText>Send Email</ButtonText>
          </PillButton>

          <BackRow>
            <TextLink onPress={() => navigation.navigate("Login")}>
              <TextLinkContent> Back to Login</TextLinkContent>
            </TextLink>
          </BackRow>
        </StyledFormArea>
      </CenterCard>
    </CenterContainer>
  );
}
