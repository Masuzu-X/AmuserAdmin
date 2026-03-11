import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Import all styled components and colors
import {
  C,
  Shell,
  TopBarTitle,
  Scroller,
  Section,
  SectionLabel,
  CardsRow,
  Card,
  CardTopStripe,
  CardBody,
  CardHeaderRow,
  CardTitleLabel,
  StatusBadge,
  StatusText,
  FieldLabel,
  StyledInput,
  DescInput,
  CardFooter,
  FooterHint,
  SaveBtn,
  SaveBtnText,
  ResetBtn,
  ResetBtnText,
  FirestoreStrip,
  FirestoreStripText,
  IconContainer,
  LoadingContainer,
  LoadingText,
  ErrorContainer,
  ErrorText,
  Spacer,
  CardContent,
} from '../components/GalleryStyles';

/* ─── Individual Gallery Card ─── */
function GalleryCard({ docId, label }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalDesc, setOriginalDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [titleFocused, setTitleFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  const isDirty = title !== originalTitle || description !== originalDesc;

  useEffect(() => {
    fetchData();
  }, [docId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const ref = doc(db, 'Gallery', docId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.Title || '');
        setDescription(data.Description || '');
        setOriginalTitle(data.Title || '');
        setOriginalDesc(data.Description || '');
      }
    } catch (e) {
      setError('Failed to load data.');
      console.log('GalleryCard fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    setError(null);
    try {
      const ref = doc(db, 'Gallery', docId);
      await updateDoc(ref, { Title: title, Description: description });
      setOriginalTitle(title);
      setOriginalDesc(description);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError('Failed to save. Check permissions.');
      console.log('GalleryCard save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setTitle(originalTitle);
    setDescription(originalDesc);
    setError(null);
  };

  return (
    <Card>
      <CardTopStripe />
      <CardBody>
        <CardContent>
          <CardHeaderRow>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <IconContainer>
                <Ionicons name="images-outline" size={15} color={C.brand} />
              </IconContainer>
              <CardTitleLabel>{label}</CardTitleLabel>
            </View>

            <StatusBadge $saved={saved && !isDirty}>
              <Ionicons
                name={saved && !isDirty ? 'checkmark-circle' : isDirty ? 'ellipse' : 'cloud-done'}
                size={10}
                color={saved && !isDirty ? C.green : isDirty ? C.brand : C.green}
              />
              <StatusText $saved={saved && !isDirty}>
                {saved && !isDirty ? 'Saved' : isDirty ? 'Unsaved' : 'Synced'}
              </StatusText>
            </StatusBadge>
          </CardHeaderRow>

          {loading ? (
            <LoadingContainer>
              <ActivityIndicator size="small" color={C.brand} />
              <LoadingText>Loading…</LoadingText>
            </LoadingContainer>
          ) : (
            <>
              <FieldLabel>Title</FieldLabel>
              <StyledInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter gallery title…"
                placeholderTextColor={C.textTertiary}
                $focused={titleFocused}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
              />

              <FieldLabel>Description</FieldLabel>
              <DescInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter gallery description…"
                placeholderTextColor={C.textTertiary}
                multiline
                numberOfLines={3}
                $focused={descFocused}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
              />
            </>
          )}
        </CardContent>
      </CardBody>

      <FirestoreStrip>
        <Ionicons name="flame" size={10} color="#1a73e8" />
        <FirestoreStripText>Gallery / {docId}</FirestoreStripText>
      </FirestoreStrip>

      <CardFooter>
        <ResetBtn onPress={handleReset} disabled={!isDirty || loading}>
          <Ionicons name="refresh-outline" size={13} color={isDirty ? C.textSec : C.textTertiary} />
          <ResetBtnText style={{ color: isDirty ? C.textSec : C.textTertiary }}>Reset</ResetBtnText>
        </ResetBtn>

        <SaveBtn onPress={handleSave} $loading={!isDirty || saving || loading} disabled={!isDirty || saving || loading}>
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="cloud-upload-outline" size={13} color="#fff" />
          )}
          <SaveBtnText>{saving ? 'Saving…' : 'Save Changes'}</SaveBtnText>
        </SaveBtn>
      </CardFooter>

      {error && (
        <ErrorContainer>
          <Ionicons name="alert-circle-outline" size={13} color={C.red} />
          <ErrorText>{error}</ErrorText>
        </ErrorContainer>
      )}
    </Card>
  );
}

/* ─── Main Component ─── */
export default function EditLibraryContents() {
  const galleries = [
    { docId: 'Gallery V', label: 'Gallery V' },
    { docId: 'Gallery VI', label: 'Gallery VI' },
    { docId: 'Gallery VIII', label: 'Gallery VIII' },
  ];

  return (
    <Shell>
      <Scroller showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <Section>
          <SectionLabel>Gallery Collection</SectionLabel>
          <CardsRow>
            {galleries.map((g) => (
              <GalleryCard key={g.docId} docId={g.docId} label={g.label} />
            ))}
          </CardsRow>
          <Spacer />
        </Section>
      </Scroller>
    </Shell>
  );
}
