import React, { useCallback } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    StatusBar,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { apiKey } from '@env';

const { width } = Dimensions.get("window");

const fetchEarthPhoto = async () => {
    const apiBase = "https://api.nasa.gov/EPIC/api/natural/date";
    const archiveBase = "https://epic.gsfc.nasa.gov/archive/natural";
    const allPhotos = [];

    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split("T")[0]; // yyyy-mm-dd

        try {
            const res = await axios.get(`${apiBase}/${formattedDate}`, {
                params: { api_key: apiKey },
            });

            if (res.data && res.data.length > 0) {
                res.data.forEach((photo) => {
                    allPhotos.push({ ...photo, date: formattedDate });
                });
            }
        } catch (e) {
            // Skip days with no data
        }
    }

    if (allPhotos.length === 0) return null;

    const random = allPhotos[Math.floor(Math.random() * allPhotos.length)];
    const [year, month, day] = random.date.split("-");
    const imageUrl = `${archiveBase}/${year}/${month}/${day}/jpg/${random.image}.jpg`;

    return {
        url: imageUrl,
        date: random.date,
        caption: random.caption,
        identifier: random.identifier,
    };
};



export default function EarthPhoto() {
    const {
        data: photo,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["earth-photo"],
        queryFn: fetchEarthPhoto,
    });

    if (isLoading || isFetching) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#88ccff" />
                <Text className="mt-4 text-base text-blue-300 font-medium">
                    Connecting to Earth satellite...
                </Text>
            </View>
        );
    }

    if (error || !photo) {
        return (
            <View className="flex-1 justify-center items-center bg-black px-6">
                <StatusBar barStyle="light-content" />
                <Text className="text-red-500 text-lg font-semibold text-center">
                    Failed to fetch Earth image. Try again later.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-black pt-8">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="px-4 mt-8 mb-8">
                <Text className="text-white text-3xl font-bold text-center">
                    Earth Satellite Photo
                </Text>
            </View>

            {/* Image Card */}
            <View className="mx-4 bg-gray-900 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/10 border border-gray-800 mb-8">
                <Image
                    source={{ uri: photo.url }}
                    style={{ width: "100%", height: width * 0.7 }}
                    resizeMode="cover"
                    className="rounded-t-2xl"
                />

                <View className="p-4">
                    <Text className="text-white text-xl font-semibold text-center mb-2">
                        {photo.caption}
                    </Text>
                    <Text className="text-blue-300 text-base text-center">
                        Earth date: {photo.date}
                    </Text>
                </View>
            </View>

            {/* Refresh Button */}
            <View className="items-center mb-10">
                <TouchableOpacity
                    onPress={refetch}
                    className="bg-blue-400 px-6 py-3 rounded-full shadow-lg shadow-blue-300/40"
                >
                    <Text className="text-white text-base font-semibold">Refresh Photo</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
