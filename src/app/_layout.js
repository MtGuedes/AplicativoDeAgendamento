import { Stack } from "expo-router";
import NavigationBar from '../app/NavigationBar'; // Ajuste o caminho conforme necessário

export default function Layout() {
    return (
        <>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#121212"
                    },
                    headerTintColor: "#FFF",
                    headerShown: false, // Ocultar o cabeçalho padrão do Stack
                }}
            >
                <Stack.Screen name="index" options={{ title: "Home" }} />
                <Stack.Screen name="Cadastro" options={{ title: "Cadastro" }} />
                <Stack.Screen name="user/id" options={{ title: "Usuário" }} />
                <Stack.Screen name="busca" options={{ title: "Buscar" }} />
            </Stack>
        </>
    );
}
