import { useState, useEffect, useRef } from "react";
import KeycloakConfig from "keycloak-js";

const client = new KeycloakConfig({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
})

const useAuth = () => {
    const isGo = useRef(false);
    const [isLogin, setLogin] = useState(false);

    useEffect(() => {

        if (isGo.current) return;

        isGo.current = true;
        client.init({
            onLoad: "login-required"
        }).then(
            (res) => {
                setLogin(res)
            }
        );
    }, []);

    return isLogin;
}

export default useAuth;