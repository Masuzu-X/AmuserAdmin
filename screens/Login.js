//react
import React, { useState } from "react";
import { View } from "react-native";

//firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase/firebaseConfig";
import { getFirebaseErrorMessage } from "../utilities/firebaseErrors";
import { sendPasswordResetEmail } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";

//validation
import { loginSchema} from "../utilities/validation";

//formik
import { Formik } from "formik";

//icons
import { Ionicons } from "@expo/vector-icons";

//stlyed components
import {
  ScreenContainer,
  LeftPane,
  RightPane,
  HeroImage,
  LoginCard,
  PageTitle,
  StyledFormArea,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  PageLogo,
  TextLink,
  TextLinkContent,
  ErrorRow,
  ErrorLeft,
  MsgBox,
  FixedRight
} from "../components/styles";

const { darkLight } = Colors;

const Login = ({navigation}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [formError, setFormError] = useState('');

  return (
    <ScreenContainer>

      <LeftPane>
        <HeroImage
          source={require("../assets/12.jpg")}
        />
      </LeftPane>

      <RightPane>
        <PageLogo source = {require('./../assets/Logo1.png')} />
        <LoginCard>
          <PageTitle>Admin Login</PageTitle>

          <Formik
            initialValues = {{ email: '', password: '' }}
            validationSchema = {loginSchema}
            onSubmit={async (values) => {
              try {
                const userCredential = await signInWithEmailAndPassword(
                  auth,
                  values.email,
                  values.password
                );

                if (!userCredential.user.emailVerified) {
                  setUnverifiedUser(userCredential.user);
                  setFormError('Please verify your email.');
                  return;
                }

              } catch (error) {
                setFormError(getFirebaseErrorMessage(error));
              }
            }}
          >
            {({ handleChange, handleBlur, values, handleSubmit, errors, touched }) => (
              <StyledFormArea>
                <StyledTextInput
                  placeholder = "Enter Email Address:"
                  placeholderTextColor = {darkLight}
                  onChangeText = {(text) => {
                    setFormError('');
                    handleChange('email')(text);
                  }}
                  onBlur = {handleBlur('email')}
                  value = {values.email}
                  keyboardType = "email-address"
                  autoCapitalize = "none"
                />
                  {errors.email && touched.email && (
                    <MsgBox>{errors.email}</MsgBox>
                  )}
                <View>
                  <StyledTextInput
                    placeholder = "Enter Password:"
                  placeholderTextColor = {darkLight}
                  onChangeText = {(text) => {
                    setFormError('');
                    handleChange('password')(text);
                  }}

                  onBlur = {handleBlur('password')}
                  value = {values.password}
                  secureTextEntry = {hidePassword}
                  isPassword
                  hidePassword = {hidePassword}
                  setHidePassword = {setHidePassword}
                  autoCapitalize = "none"
                  />

                  <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons
                      name={hidePassword ? "eye-off" : "eye"}
                      size={20}
                      color={darkLight}
                    />
                  </RightIcon>
                </View>

                <ErrorRow>
                  <ErrorLeft>
                    {errors.password && touched.password && (
                      <MsgBox>{errors.password}</MsgBox>
                    )}

                    {formError && (
                      <MsgBox>{formError}</MsgBox>
                    )}
                  </ErrorLeft>

                  <FixedRight>
                    <TextLink onPress={() => navigation.navigate('ForgotPassword')}>
                      <TextLinkContent>Forgot password?</TextLinkContent>
                    </TextLink>
                  </FixedRight>
                </ErrorRow>        

                <StyledButton style={{ marginTop: 10 }} onPress={handleSubmit}>
                  <ButtonText>Login</ButtonText>
                </StyledButton>
              </StyledFormArea>
            )}
          </Formik>
        </LoginCard>
      </RightPane>
    </ScreenContainer>
  );
};

export default Login;
