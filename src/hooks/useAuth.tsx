import { useState, useEffect, useRef, useCallback } from "react";
import KeycloakConfig from "keycloak-js";

// Configuración del cliente de Keycloak
const client = new KeycloakConfig({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
});

// Tipos para el estado de autenticación
interface AuthData {
    isLogin: boolean;
    userId: string | null;
    roles: string[];
}

const useAuth = () => {
    const isGo = useRef(false);
    const [authData, setAuthData] = useState<AuthData>({
        isLogin: false,
        userId: null,
        roles: []
    });

    useEffect(() => {
        if (isGo.current) return;

        isGo.current = true;
        client.init({
            onLoad: "login-required"
        }).then((authenticated) => {
            if (authenticated) {
                const userId = client.tokenParsed?.sub || null;
                const roles = client.realmAccess?.roles || [];
                setAuthData({
                    isLogin: true,
                    userId: userId,
                    roles: roles
                });
            } else {
                setAuthData({
                    isLogin: false,
                    userId: null,
                    roles: []
                });
            }
        });
    }, []);

    const logout = useCallback(() => {
        client.logout().then(() => {
            setAuthData({
                isLogin: false,
                userId: null,
                roles: []
            });
        });
    }, []);

    return { ...authData, logout };
};

export default useAuth;
