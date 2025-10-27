import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const auth = useAuthStore();

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: auth.login,
    logout: auth.logout,
    clearError: auth.clearError,
  };
};
