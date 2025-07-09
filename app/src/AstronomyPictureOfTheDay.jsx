import React, { useState } from "react";
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
import { MoveLeft, MoveRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

const formatDate = (date) => date.toISOString().split('T')[0];
const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

export default function AstronomyPictureOfTheDay() {
    const [targetDate, setTargetDate] = useState(new Date());

    const { data, error, isLoading } = useQuery({
        queryKey: ["apod", targetDate],
        queryFn: async () => {
            const response = await axios.get(
                `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${formatDate(targetDate)}`
            );
            return response.data;
        },
    });

    const [showFull, setShowFull] = useState(false);

    const goToPreviousDate = () => {
        const prevDate = new Date(targetDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setTargetDate(prevDate);
    };

    const goToNextDate = () => {
        if (!isSameDay(targetDate, new Date())) {
            const nextDate = new Date(targetDate);
            nextDate.setDate(nextDate.getDate() + 1);
            setTargetDate(nextDate);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#888" />
                <Text className="mt-4 text-base text-gray-400 font-medium">
                    Unveiling today’s cosmic wonder...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-black px-6">
                <StatusBar barStyle="light-content" />
                <Text className="text-red-500 text-lg font-semibold text-center">
                    Failed to load data. Please check your connection.
                </Text>
            </View>
        );
    }

    const formattedDate = data?.date
        ? new Date(data.date).toLocaleDateString()
        : "Loading Date...";

    const shortExplanation = data?.explanation?.split(" ").slice(0, 25).join(" ") + "...";

    return (
        <ScrollView className="flex-1 bg-black pt-8">
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View className="px-4 mt-8 mb-2">
                <Text className="text-white text-3xl font-bold text-center">
                    Astronomy Picture
                </Text>
                <Text className="text-white text-3xl font-bold text-center">
                    of the Day
                </Text>
                <Text className="text-blue-400 text-base text-center mt-2">
                    {formattedDate}
                </Text>

                {/* Arrows Row */}
                <View className="flex-row justify-center items-center mt-3">
                    <TouchableOpacity onPress={goToPreviousDate}>
                        <MoveLeft color="white" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={goToNextDate}
                        disabled={isSameDay(targetDate, new Date())}
                        className="ml-8"
                    >
                        <MoveRight
                            color={isSameDay(targetDate, new Date()) ? "#4B5563" : "white"}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Image Card */}
            <View className="mx-4 bg-gray-900 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/10 border border-gray-800 mb-8">
                {data.media_type === "image" ? (
                    <Image
                        source={{ uri: data.url }}
                        style={{ width: "100%", height: width * 0.7 }}
                        resizeMode="cover"
                        className="rounded-t-2xl"
                    />
                ) : (
                    <View className="h-48 justify-center items-center bg-gray-800">
                        <Text className="text-gray-400 text-center px-4">
                            Video not supported.{"\n"}Visit NASA APOD to view.
                        </Text>
                    </View>
                )}

                {/* Content */}
                <View className="p-4">
                    <Text className="text-white text-xl font-semibold text-center mb-2">
                        {data.title}
                    </Text>

                    <Text className="text-gray-300 text-base leading-relaxed text-justify">
                        {showFull ? data.explanation : shortExplanation}
                    </Text>

                    <TouchableOpacity
                        onPress={() => setShowFull(!showFull)}
                        className="mt-2"
                    >
                        <Text className="text-blue-400 text-sm font-medium text-center">
                            {!showFull ? "Show more" : "Show less"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}