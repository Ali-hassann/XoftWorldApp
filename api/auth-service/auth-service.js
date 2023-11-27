import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  constructor() {
    this.user = null;
    this.loadUser();
  }

  async setUser(user) {
    if (this.user?.BranchId > 0) {
      this.logout();
    }
    this.user = user;
    try {
      const userData = JSON.stringify(user);
      await AsyncStorage.setItem('user', userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  async loadUser() {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData !== null) {
        this.user = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  getUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.user;
  }

  async logout() {
    this.user = null;
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;