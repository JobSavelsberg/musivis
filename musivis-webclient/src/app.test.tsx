import { render, screen } from '@testing-library/react';
import App, { User } from './app'; // Import User type
import { BrowserRouter } from 'react-router-dom';
import { AuthContext, IAuthContext } from './components/auth-provider'; // Use IAuthContext

describe('App component', () => {
  it('renders without crashing and shows initial content', () => {
    // Mock User
    const mockUser: User = {
      display_name: "Test User",
      email: "test@example.com",
      id: "testid",
      images: [],
    };

    // Mock AuthContext value
    const mockAuthContext: IAuthContext = {
      user: mockUser,
      isLoggedIn: true, // Assuming a logged-in state for more coverage, or false for initial view
      login: vi.fn(),
      logout: vi.fn(),
      goToSpotifyAuth: vi.fn(), // Added missing function from IAuthContext
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <App />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Check for the main application title/link
    expect(screen.getByText('Musivis')).toBeInTheDocument();

    // Check for the main landmark role
    expect(screen.getByRole('main')).toBeInTheDocument();

    // If isLoggedIn is true, the search bar should be present
    expect(screen.getByPlaceholderText('What music do you want to visualize?')).toBeInTheDocument();
  });
});
