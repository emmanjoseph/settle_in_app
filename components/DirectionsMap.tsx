import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, type Region } from "react-native-maps";
import * as Location from "expo-location";
import { Home, LocateFixed, Minus, Plus } from "lucide-react-native";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN!;
// console.log("MAPBOX_TOKEN", MAPBOX_TOKEN);
const TEAL = "#0d9488";

type LatLng = { latitude: number; longitude: number };
export type Step = { instruction: string; distance: number; maneuver: string; modifier?: string };
export type RouteInfo = { distance: number; duration: number; steps: Step[] };

async function fetchRoute(from: LatLng, to: LatLng) {
    const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${from.longitude},${from.latitude};${to.longitude},${to.latitude}` +
        `?steps=true&geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

    const res = await fetch(url);
    const json = await res.json();
    const r = json.routes?.[0];
    if (!r) return null;

    const coords: LatLng[] = r.geometry.coordinates.map(([lng, lat]: number[]) => ({
        latitude: lat,
        longitude: lng,
    }));
    const info: RouteInfo = {
        distance: r.distance, // meters
        duration: r.duration, // seconds
        steps: r.legs[0].steps.map((s: any) => ({
            instruction: s.maneuver.instruction,
            distance: s.distance,
            maneuver: s.maneuver.type,
            modifier: s.maneuver.modifier,
        })),
    };
    return { coords, info };
}

export function DirectionsMap({
                                  destination,
                                  onRoute,
                              }: {
    destination: LatLng;
    onRoute?: (info: RouteInfo) => void;
}) {
    const mapRef = useRef<MapView>(null);
    const region = useRef<Region | null>(null);
    const [route, setRoute] = useState<LatLng[]>([]);
    const [me, setMe] = useState<LatLng | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;
            const pos = await Location.getCurrentPositionAsync({});
            const origin = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
            setMe(origin);

            const result = await fetchRoute(origin, destination);
            if (!result) return;
            setRoute(result.coords);
            onRoute?.(result.info);
            mapRef.current?.fitToCoordinates(result.coords, {
                edgePadding: { top: 120, right: 60, bottom: 320, left: 60 },
                animated: true,
            });
        })();
    }, [destination.latitude, destination.longitude]);

    const zoom = (factor: number) => {
        const r = region.current;
        if (!r) return;
        mapRef.current?.animateToRegion(
            { ...r, latitudeDelta: r.latitudeDelta * factor, longitudeDelta: r.longitudeDelta * factor },
            200,
        );
    };

    const recenter = () =>
        me && mapRef.current?.animateToRegion({ ...me, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 300);

    const Btn = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => (
        <Pressable
            onPress={onPress}
            className="h-10 w-10 items-center justify-center rounded-xl bg-white active:bg-neutral-100"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.12,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 4,
            }}
        >
            {children}
        </Pressable>
    );

    return (
        <View className="flex-1">
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE} // remove to use Apple Maps on iOS
                showsUserLocation
                showsCompass={false}
                showsMyLocationButton={false}
                toolbarEnabled={false}
                onRegionChangeComplete={(r) => (region.current = r)}
                // customMapStyle={mutedStyleJson}
            >
                {route.length > 0 && <Polyline coordinates={route} strokeColor={TEAL} strokeWidth={5} />}
                <Marker coordinate={destination} anchor={{ x: 0.5, y: 0.5 }}>
                    <View className="h-9 w-9 items-center justify-center rounded-full border-2 border-neutral-900 bg-white">
                        <Home size={16} color="#0a0a0a" />
                    </View>
                </Marker>
            </MapView>

            {/* zoom + locate */}
            <View className="absolute left-4 top-28 gap-2">
                <Btn onPress={() => zoom(0.5)}><Plus size={18} color="#0a0a0a" /></Btn>
                <Btn onPress={() => zoom(2)}><Minus size={18} color="#0a0a0a" /></Btn>
                <Btn onPress={recenter}><LocateFixed size={18} color="#0a0a0a" /></Btn>
            </View>
        </View>
    );
}