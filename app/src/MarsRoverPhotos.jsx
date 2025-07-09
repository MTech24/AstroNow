import React, { useCallback, useState } from "react";
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
import { apiKey } from '@env';

const { width } = Dimensions.get("window");

const fetchRandomPhoto = async () => {
    let photo = null;
    let attempts = 0;
    while (!photo && attempts < 5) {
        const randomSol = Math.floor(Math.random() * 2900) + 100;
        const res = await axios.get(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`,
            {
                params: {
                    sol: randomSol,
                    api_key: apiKey,
                },
            }
        );
        const photos = res.data.photos.filter(p =>
            p.img_src.toLowerCase().includes(".jpg") || p.img_src.toLowerCase().includes(".png")
        );
        if (photos.length > 0) {
            photo = photos[Math.floor(Math.random() * photos.length)];
        }
        attempts++;
    }
    return photo;
};


export default function MarsRoverPhotos() {
    const {
        data: photo,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["mars-photo"],
        queryFn: fetchRandomPhoto,
    });

    if (isLoading || isFetching) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#888" />
                <Text className="mt-4 text-base text-gray-400 font-medium">
                    Receiving signals from Mars...
                </Text>
            </View>
        );
    }

    if (error || !photo) {
        return (
            <View className="flex-1 justify-center items-center bg-black px-6">
                <StatusBar barStyle="light-content" />
                <Text className="text-red-500 text-lg font-semibold text-center">
                    Failed to fetch a Mars image. Try again later.
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
                    Mars Rover Photo
                </Text>
            </View>

            {/* Image Card */}
            <View className="mx-4 bg-gray-900 rounded-2xl overflow-hidden shadow-lg shadow-red-500/10 border border-gray-800 mb-8">
                <Image
                    source={{ uri: photo.img_src }}
                    style={{ width: "100%", height: width * 0.7 }}
                    resizeMode="cover"
                    className="rounded-t-2xl"
                />

                <View className="p-4">
                    <Text className="text-white text-xl font-semibold text-center mb-1">
                        {photo.camera.full_name}
                    </Text>

                    <Text className="text-gray-400 text-base text-center mb-3">
                        Rover: {photo.rover.name} | Sol: {photo.sol} | Earth:{" "}
                        {photo.earth_date}
                    </Text>
                </View>
            </View>

            {/* Refresh Button */}
            <View className="items-center mb-10">
                <TouchableOpacity
                    onPress={refetch}
                    className="bg-red-600 px-6 py-3 rounded-full shadow-lg shadow-red-500/30"
                >
                    <Text className="text-white text-base font-semibold">Refresh Photo</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
