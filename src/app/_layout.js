import { Stack } from "expo-router";

export default function Layout() {
    return(
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#121212"
                },

                headerTintColor: "#FFF"
            }}
        >
            <Stack.Screen name="index" options={{title: "Home"}} />
            <Stack.Screen name="Cadastro" options={{title: "Cadastro"}} />
            <Stack.Screen name="user/id" options={{title: "Usuário"}} />
        </Stack>
    )
}