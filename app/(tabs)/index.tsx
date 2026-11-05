import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, Send} from "lucide-react-native";
import { PostCard, type Post } from "@/components/home/PostCard";
import { StoriesRow, type Story } from "@/components/home/StoriesRow";
import { GradientBackdrop } from "@/components/GradientBackdrop";
import SmallHouseCard from "@/components/SmallHouseCard";

// ---- placeholder data (swap for your API) ----------------------------------
const YOUR_AVATAR =
    "https://api.flowstep.ai/assets/chat_attachments/6a540c59-899c-4731-b223-d55b78b52aac.jpg";

const STORIES: Story[] = [
  { name: "_w.bn_", avatar: YOUR_AVATAR },
  { name: "joialexandri", avatar: YOUR_AVATAR },
  { name: "uksashx", avatar: YOUR_AVATAR },
  { name: "Cynthia_landy", avatar: YOUR_AVATAR },
  { name: "Drake", avatar: YOUR_AVATAR },
];

const POSTS: Post[] = [
  {
    id: "1",
    user: "fboy",
    avatar: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200",
    subtitle: "Featured listing",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    listingType: "For Sale",
    title: "Modern Villa with Pool",
    location: "Beverly Hills, CA",
    price: "$2.4M",
    likes: 124,
    postedAgo: "2 hours ago",
    caption: "Modern architecture, warm interiors, and a private pool make this a standout listing.",
    menuIcon: "filters",
    beds:4,
    baths:7
  },
  {
    id: "2",
    user: "cozynest",
    avatar: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200",
    subtitle: "Soft ambient tour",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200",
    listingType: "For Rent",
    title: "Cozy Family Home",
    location: "Brooklyn, NY",
    price: "$4,500/mo",
    likes: 89,
    postedAgo: "5 hours ago",
    caption: "Spacious layout, bright rooms, and a quiet neighborhood close to everything.",
    initiallyLiked: true,
    beds:4,
    baths:7
  },
  {
    id: "3",
    user: "luxuryloop",
    avatar: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=200",
    subtitle: "Trending listing",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
    listingType: "For Sale",
    title: "Luxury Downtown Condo",
    location: "Manhattan, NYC",
    price: "$1.9M",
    likes: 76,
    postedAgo: "1 day ago",
    caption: "A city-view home with premium finishes and a polished, modern feel.",
    beds:4,
    baths:7
  },
];

const NEARBY = [
  { title: "Garden Townhouse", price: "$890K", beds: 3, baths: 2, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600" },
  { title: "Modern Loft", price: "$1.2M", beds: 2, baths: 1, image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600" },
  { title: "Brownstone Unit", price: "$725K", beds: 2, baths: 2, image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=600" },
  { title: "Suburban Home", price: "$650K", beds: 4, baths: 3, image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600" },
];
// ----------------------------------------------------------------------------

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();

  return (
      <View className="flex-1 bg-white">
        {focused && <StatusBar style="dark" />}

        {/* fixed behind the scroll view: the content scrolls over it, it never moves */}
        <GradientBackdrop height={300} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* header: top bar + stories (scrolls with the page, sits on the gradient) */}
          <View style={{ paddingTop: insets.top }}>
            <View className="flex-row items-center justify-between px-6 pb-3 pt-4">
              <Pressable className="">
                <Send size={26} color="#0a0a0a" />
              </Pressable>
              <Text className="font-jakarta-bold text-2xl text-neutral-950">SettleIn</Text>
              <Pressable className="relative">
                <Bell size={26} color="#0a0a0a" />
                <View className="absolute right-0 top-0 h-4 w-4 flex justify-center items-center rounded-full bg-teal-600" >
                  <Text className="text-white text-xs font-jakarta-bold">1</Text>
                </View>
              </Pressable>
            </View>
            <StoriesRow yourAvatar={YOUR_AVATAR} stories={STORIES} />
          </View>

          {/* feed */}
          <View className="gap-6 px-3 pb-8 pt-4">
            {POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}

            <View className="flex-row items-center justify-between pt-1">
              <Text className="font-jakarta-bold text-base text-neutral-950">Nearby Properties</Text>
              <Text className="font-jakarta-bold text-sm text-teal-600">See All</Text>
            </View>

            <View className="flex-row flex-wrap justify-between gap-y-3">
              {NEARBY.map((h) => (
                  <SmallHouseCard key={h.title} house={h} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
  );
}