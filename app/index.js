import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Globe, Image, GalleryVertical } from "lucide-react-native";
import "./index.css";

// Import your screen components
import AstronomyPictureOfTheDay from "./src/AstronomyPictureOfTheDay";
import MarsRoverPhotos from "./src/MarsRoverPhotos";
import EarthPhoto from "./src/EarthPhoto";

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Tab.Navigator
            initialRouteName="AstronomyPictureOfTheDay"
                screenOptions={({ route }) => ({
                    headerShown: false, // Keep header hidden
                    tabBarIcon: ({ color, size }) => {
                        let IconComponent;

                        if (route.name === "EarthPhoto") {
                            IconComponent = Globe; 
                        } else if (route.name === "AstronomyPictureOfTheDay") {
                            IconComponent = Image;
                        } else if (route.name === "MarsRoverPhotos"){
                            IconComponent = GalleryVertical;
                        }

                        return IconComponent ? <IconComponent color={color} size={20} /> : null;
                    },
                    tabBarActiveTintColor: "#E0E0E0", 
                    tabBarInactiveTintColor: "#6B7280",
                    tabBarStyle: {
                        backgroundColor: "#171717", 
                        borderTopWidth: 1,
                        borderTopColor: "#262626",
                        elevation: 0,
                        height: 75,
                        paddingBottom: 5,
                        paddingTop: 5,
                        
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -6 }, 
                        shadowOpacity: 0.5,
                        shadowRadius: 12,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: "600",
                        marginTop: 4,
                    },
                })}
            >

                <Tab.Screen
                    name="EarthPhoto"
                    component={EarthPhoto}
                    options={{
                        tabBarLabel: "EarthPhoto",
                    }}
                />

                <Tab.Screen
                    name="AstronomyPictureOfTheDay"
                    component={AstronomyPictureOfTheDay}
                    options={{
                        tabBarLabel: "APOD",
                    }}
                />

                <Tab.Screen
                    name="MarsRoverPhotos"
                    component={MarsRoverPhotos}
                    options={{
                        tabBarLabel: "Rover",
                    }}
                />

            </Tab.Navigator>
        </QueryClientProvider>
    );
}