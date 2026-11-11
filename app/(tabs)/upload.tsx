import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { VideoView, useVideoPlayer } from "expo-video";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bath,
  BedDouble,
  Camera,
  Film,
  Home,
  Image as ImageIcon,
  MapPin,
  Plus,
  Ruler,
  Video,
  X,
} from "lucide-react-native";
import { PostField, Segmented } from "@/components/post/PostField";
import {GradientBackdrop} from "@/components/GradientBackdrop";

const CURRENCY = "KES"; // change to "$" etc.
const MAX_PHOTOS = 10;

type Mode = "listing" | "reel";
type ListingType = "sale" | "rent";
type Asset = { uri: string; type: "image" | "video" };

const digits = (v: string) => v.replace(/\D/g, "");
const withCommas = (v: string) => digits(v).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
  });
  return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls />;
}

const Glass = ({ onPress, label, children }: { onPress: () => void; label: string; children: React.ReactNode }) => (
    <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="h-10 w-10 items-center justify-center rounded-full bg-white/90 active:bg-white"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}
    >
      {children}
    </Pressable>
);

export default function NewPostScreen() {
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode>("listing");
  const [listingType, setListingType] = useState<ListingType>("sale");
  const [cover, setCover] = useState<Asset | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");

  const [errors, setErrors] = useState<Partial<Record<"media" | "title" | "price" | "location", string>>>({});
  const [loading, setLoading] = useState(false);

  const pickCover = async (kind: "any" | "images" | "videos" = "any") => {
    const mediaTypes: ImagePicker.MediaType[] =
        kind === "images" ? ["images"] : kind === "videos" ? ["videos"] : ["images", "videos"];
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes, quality: 0.85, videoMaxDuration: 90 });
    if (res.canceled) return;
    const a = res.assets[0];
    setCover({ uri: a.uri, type: a.type === "video" ? "video" : "image" });
    setErrors((e) => ({ ...e, media: undefined }));
  };

  const addPhotos = async () => {
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.85,
    });
    if (res.canceled) return;
    setPhotos((p) => [...p, ...res.assets.map((a) => a.uri)].slice(0, MAX_PHOTOS));
  };

  const changeMode = (m: Mode) => {
    Haptics.selectionAsync();
    setMode(m);
  };

  const submit = async () => {
    const next: typeof errors = {};
    if (!cover) next.media = mode === "reel" ? "Add a video or photo for your reel" : "Add a cover photo or video";
    if (mode === "listing") {
      if (title.trim().length < 3) next.title = "Enter a title";
      if (!digits(price)) next.price = listingType === "rent" ? "Enter the monthly rent" : "Enter a price";
      if (!location.trim()) next.location = "Enter the location";
    }
    setErrors(next);
    if (Object.keys(next).length) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    try {
      const payload =
          mode === "listing"
              ? {
                kind: "listing" as const,
                listingType,
                title: title.trim(),
                price: Number(digits(price)),
                location: location.trim(),
                beds: Number(digits(beds)) || undefined,
                baths: Number(digits(baths)) || undefined,
                areaSqft: Number(digits(area)) || undefined,
                description: description.trim() || undefined,
                cover,
                photos,
              }
              : {
                kind: "reel" as const,
                caption: caption.trim() || undefined,
                tags: tags.match(/#[\p{L}\p{N}_]+/gu) ?? [],
                media: cover,
              };

      // TODO: upload the media (multipart/FormData or a presigned URL) and send `payload` to your backend
      void payload;
      await new Promise((r) => setTimeout(r, 800));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(mode === "reel" ? "Reel posted" : "Listing posted", "Your post is live.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
      <View className="flex-1 bg-white">
          <StatusBar style="dark" />


        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100, gap: 20 }}
          >
              <GradientBackdrop height={240} />

              {/* header (scrolls with the page) */}
              <View
                  className="flex-row items-center justify-between px-2"
                  style={{ paddingTop: insets.top + 8 }}
              >
                  <Text className="font-jakarta-bold text-[20px] leading-9 tracking-tight text-neutral-950">
                      New Post
                  </Text>
                  <Pressable
                      onPress={() => router.back()}
                      hitSlop={6}
                      accessibilityRole="button"
                      accessibilityLabel="Close"
                      className="h-10 w-10 items-center justify-center rounded-full bg-white/70 active:bg-white"
                  >
                      <X size={18} color="#0a0a0a" />
                  </Pressable>
              </View>
            {/* mode */}
            <Segmented
                value={mode}
                onChange={changeMode}
                options={[
                  { key: "listing", label: "Listing", Icon: Home },
                  { key: "reel", label: "Reel", Icon: Film },
                ]}
            />

            {/* media */}
            <View className="gap-2">
              <Pressable
                  onPress={() => pickCover("any")}
                  accessibilityRole="button"
                  accessibilityLabel={cover ? "Change photo or video" : "Upload photo or video"}
                  className={`w-full items-center justify-center overflow-hidden rounded-3xl ${
                      mode === "reel" ? "aspect-[3/4]" : "aspect-[4/3]"
                  } ${
                      cover
                          ? "bg-neutral-900"
                          : errors.media
                              ? "border-[1.5px] border-dashed border-red-500 bg-red-50/40"
                              : "bg-neutral-100"
                  }`}
              >
                {cover?.type === "image" && (
                    <>
                      <Image source={{ uri: cover.uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
                      <View pointerEvents="none" className="absolute inset-0 bg-neutral-950/20" />
                    </>
                )}
                {cover?.type === "video" && <VideoPreview uri={cover.uri} />}

                {!cover && (
                    <View className="items-center gap-3">
                      <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
                        <Camera size={28} color="#0a0a0a" />
                      </View>
                      <View className="items-center">
                        <Text className="font-jakarta-semibold text-base text-neutral-950">Add photo or video</Text>
                        <Text className="mt-0.5 font-jakarta-regular text-xs text-neutral-500">
                          {mode === "reel" ? "Vertical video works best" : "Your cover shows first"}
                        </Text>
                      </View>
                    </View>
                )}

                {cover && (
                    <View className="absolute bottom-3 right-3 flex-row gap-2">
                      <Glass onPress={() => pickCover("images")} label="Pick a photo">
                        <ImageIcon size={17} color="#0a0a0a" />
                      </Glass>
                      <Glass onPress={() => pickCover("videos")} label="Pick a video">
                        <Video size={17} color="#0a0a0a" />
                      </Glass>
                    </View>
                )}
              </Pressable>
              {errors.media ? <Text className="pl-1 font-jakarta-regular text-xs text-red-600">{errors.media}</Text> : null}
            </View>

            {mode === "listing" ? (
                <View className="gap-5">
                  <Segmented
                      value={listingType}
                      onChange={setListingType}
                      options={[
                        { key: "sale", label: "For Sale" },
                        { key: "rent", label: "For Rent" },
                      ]}
                  />
                  <PostField
                      label="Property title"
                      placeholder="Modern 3BR Apartment with Sea View"
                      value={title}
                      onChangeText={setTitle}
                      error={errors.title}
                  />
                  <PostField
                      label={listingType === "rent" ? "Monthly rent" : "Price"}
                      prefix={CURRENCY}
                      placeholder="450,000"
                      keyboardType="number-pad"
                      value={price}
                      onChangeText={(v) => setPrice(withCommas(v))}
                      error={errors.price}
                  />
                  <PostField
                      label="Location"
                      icon={MapPin}
                      placeholder="Kilimani, Nairobi"
                      value={location}
                      onChangeText={setLocation}
                      error={errors.location}
                  />
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <PostField label="Beds" labelIcon={BedDouble} center placeholder="3" keyboardType="number-pad" value={beds} onChangeText={(v) => setBeds(digits(v))} />
                    </View>
                    <View className="flex-1">
                      <PostField label="Baths" labelIcon={Bath} center placeholder="2" keyboardType="number-pad" value={baths} onChangeText={(v) => setBaths(digits(v))} />
                    </View>
                    <View className="flex-1">
                      <PostField label="Sq ft" labelIcon={Ruler} center placeholder="1,250" keyboardType="number-pad" value={area} onChangeText={(v) => setArea(withCommas(v))} />
                    </View>
                  </View>
                  <PostField
                      label="Description"
                      multiline
                      placeholder="Describe the best features, amenities and neighborhood..."
                      value={description}
                      onChangeText={setDescription}
                  />

                  {/* more photos */}
                  <View className="gap-2">
                    <View className="flex-row items-center justify-between px-1">
                      <Text className="font-jakarta-medium text-[13px] text-neutral-500">More photos</Text>
                      <Text className="font-jakarta-regular text-xs text-neutral-400">
                        {photos.length}/{MAX_PHOTOS}
                      </Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="-mx-4"
                        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
                    >
                      {photos.map((uri) => (
                          <View key={uri} className="h-24 w-24 overflow-hidden rounded-2xl bg-neutral-200">
                            <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
                            <Pressable
                                onPress={() => setPhotos((p) => p.filter((x) => x !== uri))}
                                hitSlop={6}
                                accessibilityLabel="Remove photo"
                                className="absolute right-1.5 top-1.5 h-6 w-6 items-center justify-center rounded-full bg-neutral-950/60"
                            >
                              <X size={13} color="#ffffff" />
                            </Pressable>
                          </View>
                      ))}
                      {photos.length < MAX_PHOTOS && (
                          <Pressable
                              onPress={addPhotos}
                              accessibilityRole="button"
                              accessibilityLabel="Add photos"
                              className="h-24 w-24 items-center justify-center gap-1 rounded-2xl bg-neutral-100 active:bg-neutral-200"
                          >
                            <Plus size={22} color="#0a0a0a" />
                            <Text className="font-jakarta-medium text-[11px] text-neutral-500">Add</Text>
                          </Pressable>
                      )}
                    </ScrollView>
                  </View>
                </View>
            ) : (
                <View className="gap-5">
                  <PostField
                      label="Caption"
                      multiline
                      placeholder="Share something about this reel..."
                      value={caption}
                      onChangeText={setCaption}
                  />
                  <PostField
                      label="Tags"
                      placeholder="#luxury #realestate #nairobi"
                      autoCapitalize="none"
                      value={tags}
                      onChangeText={setTags}
                  />
                </View>
            )}
              <Pressable
                  onPress={submit}
                  disabled={loading}
                  accessibilityRole="button"
                  className={`mt-2 h-14 items-center justify-center rounded-full bg-neutral-950 active:opacity-90 ${
                      loading ? "opacity-70" : ""
                  }`}
              >
                  {loading ? (
                      <ActivityIndicator color="#fafafa" />
                  ) : (
                      <Text className="font-jakarta-semibold text-base text-white">
                          {mode === "reel" ? "Post reel" : "Post listing"}
                      </Text>
                  )}
              </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
  );
}