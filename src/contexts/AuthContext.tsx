import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('pauloCell_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, using hardcoded credentials
      if (email === 'paullo.celullar2020@gmail.com' && password === 'paulocell@admin') {
        const user = {
          id: '1',
          name: 'Paulo Cell Admin',
          email: email
        };
        setUser(user);
        localStorage.setItem('pauloCell_user', JSON.stringify(user));
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Bem-vindo ao sistema Paulo Cell.'
        });
        navigate('/dashboard');
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao fazer login.'
      });
    }
  };

  const loginWithGoogle = async () => {
    try {
      // TODO: Implement Google OAuth integration
      toast({
        variant: 'destructive',
        title: 'Não implementado',
        description: 'O login com Google será implementado em breve.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login com Google',
        description: 'Ocorreu um erro ao fazer login com Google.'
      });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // For demo purposes, store user in localStorage
      const newUser = {
        id: Date.now().toString(),
        name,
        email
      };
      setUser(newUser);
      localStorage.setItem('pauloCell_user', JSON.stringify(newUser));
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Bem-vindo ao sistema Paulo Cell.'
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer cadastro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao fazer cadastro.'
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pauloCell_user');
    navigate('/login');
    toast({
      title: 'Logout realizado com sucesso!',
      description: 'Até logo!'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};