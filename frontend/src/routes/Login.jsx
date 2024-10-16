import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import axios from "axios"; // Importando axios para realizar a chamada da API

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Chama a função para validar o token
      validateToken(token);
    }
  }, [navigate]);

  const validateToken = async (token) => {
    try {
      // Faz uma requisição para validar o token
      const response = await axios.get("/api/validate-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Se a resposta for bem-sucedida, redireciona para /app
      if (response.data) {
        navigate("/app");
      }
    } catch (err) {
      // Se ocorrer um erro, limpa o token do localStorage e redireciona para /login
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setLoading(true);

    if (!validateEmail(email)) {
      setEmailError("Email inválido ou não existe.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setTimeout(() => {
        navigate("/app");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data.error || "Erro ao realizar login.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsContent value="login">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Bem vindo de volta!</CardTitle>
              <CardDescription>
                Pronto para mais um dia produtivo?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
                {emailError && <p style={{ color: "red" }}>{emailError}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <ColorRing
                      visible={true}
                      height="40"
                      width="40"
                      ariaLabel="color-ring-loading"
                      colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
                    />
                  </div>
                ) : (
                  <span>Entrar</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Login;
